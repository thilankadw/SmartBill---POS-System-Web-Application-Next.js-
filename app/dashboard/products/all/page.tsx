"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/app/store/authStore";
import Papa from "papaparse";
import JsBarcode from "jsbarcode";

interface Product {
  id: string;
  name: string;
  stock: number;
  sellingprice: number;
  purchaseprice: number;
  category: string;
  brand: string;
  imagepath: string;
  status: string;
}

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<Record<string, string>[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user?.uid) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/product/all-products?shopId=${user.uid}`);
        const result = await response.json();

        if (result.success) {
          setProducts(result.products);
          console.log(result.success);
        } else {
          setError(result.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("An error occurred while fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user?.uid]);

  // Effect to generate barcode when the modal is shown
  useEffect(() => {
    if (showBarcodeModal && selectedProduct && barcodeRef.current) {
      try {
        // Create barcode data with all product details as JSON string
        const barcodeData = selectedProduct.id;
        
        JsBarcode(barcodeRef.current, barcodeData, {
          format: "CODE128",
          lineColor: "#000",
          width: 2,
          height: 100,
          displayValue: true,
          fontSize: 16,
          margin: 10,
          text: selectedProduct.name
        });
      } catch (err) {
        console.error("Error generating barcode:", err);
      }
    }
  }, [showBarcodeModal, selectedProduct]);

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      parseCSV(file);
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      complete: (result: Papa.ParseResult<Record<string, string>>) => {
        setCsvData(result.data);
        setShowModal(true);
      },
      error: (err: Papa.ParseError) => {
        setError("Error parsing CSV file");
        console.error(err);
      },
      header: true,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/product/delete-product?id=${id}&shopId=${user?.uid}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setProducts(products.filter((product) => product.id !== id));
        alert("Product deleted successfully");
      } else {
        alert(result.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product");
    }
  };

  const handleShowBarcode = (product: Product) => {
    setSelectedProduct(product);
    setShowBarcodeModal(true);
  };

  const handlePrintBarcode = () => {
    if (!selectedProduct) return;
    
    const printWindow = window.open('', '_blank');
    
    if (printWindow && barcodeRef.current) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Barcode - ${selectedProduct.name}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; }
              .barcode-container { margin: 20px auto; }
              .product-info { margin-top: 10px; font-size: 14px; }
              .product-details { margin-top: 15px; text-align: left; display: inline-block; }
              .product-details table { border-collapse: collapse; }
              .product-details th, .product-details td { padding: 5px 10px; text-align: left; border-bottom: 1px solid #eee; }
              .product-details th { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="barcode-container">
              ${barcodeRef.current.outerHTML}
              <div class="product-info">
                <p><strong>${selectedProduct.name}</strong></p>
                <p>Price: Rs. ${selectedProduct.sellingprice}</p>
              </div>
              <div class="product-details">
                <table>
                  <tr><th>Product ID:</th><td>${selectedProduct.id}</td></tr>
                  <tr><th>Category:</th><td>${selectedProduct.category}</td></tr>
                  <tr><th>Brand:</th><td>${selectedProduct.brand}</td></tr>
                  <tr><th>Status:</th><td>${selectedProduct.status}</td></tr>
                  <tr><th>Stock:</th><td>${selectedProduct.stock}</td></tr>
                  <tr><th>Purchase Price:</th><td>Rs. ${selectedProduct.purchaseprice}</td></tr>
                </table>
              </div>
            </div>
            <script>
              window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-xl text-primary">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-xl text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-white p-8">
      <div className="flex justify-end items-end w-full gap-4 mb-6">
        <Link href={'/dashboard/products/add'} className="bg-secondary px-4 py-2 rounded-lg text-white">
          New Product
        </Link>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleCSVUpload} 
          className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer"
        />
      </div>

      <h2 className="text-2xl font-semibold text-primary mb-6">Products</h2>

      {products.length === 0 ? (
        <div className="w-full max-w-4xl text-center text-gray-500">
          No products found. Add a new product to get started.
        </div>
      ) : (
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Product Name</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Selling Price</th>
                <th className="p-3 text-left">Purchase Price</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Brand</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className="border-b border-gray-300 hover:bg-gray-100">
                  <td className="p-3 text-black">{index + 1}</td>
                  <td className="p-3 text-black">{product.name}</td>
                  <td className="p-3 text-black">{product.stock}</td>
                  <td className="p-3 text-black">Rs. {product.sellingprice}</td>
                  <td className="p-3 text-black">Rs. {product.purchaseprice}</td>
                  <td className="p-3 text-black">{product.category}</td>
                  <td className="p-3 text-black">{product.brand}</td>
                  <td className={`p-3 font-semibold ${product.status === "active" ? "text-green-600" : "text-red-600"}`}>
                    {product.status}
                  </td>
                  <td className="p-3 flex space-x-2">
                    <Link
                      href={`/dashboard/products/add?id=${product.id}`}
                      className="bg-accent text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-danger text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleShowBarcode(product)}
                      className="bg-accent text-white px-3 py-1 rounded-md"
                    >
                      Bar Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CSV Data Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-3xl w-full">
            <h2 className="text-2xl font-semibold mb-4">CSV Data</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  {Object.keys(csvData[0] || {}).map((key) => (
                    <th key={key} className="p-3 text-left">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    {Object.values(row).map((value, idx) => (
                      <td key={idx} className="p-3 text-black">{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <button 
                onClick={() => setShowModal(false)} 
                className="bg-danger text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showBarcodeModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-black p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Product Barcode</h2>
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg shadow-md w-full text-center">
                <svg ref={barcodeRef} className="w-full"></svg>
                <div className="mt-2">
                  <p className="font-semibold">{selectedProduct.name}</p>
                  <p className="text-gray-600">Rs. {selectedProduct.sellingprice}</p>
                </div>
              </div>
              
              <div className="mt-4 w-full">
                <h3 className="text-lg font-semibold mb-2">Product Details</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium">Category:</td>
                      <td className="py-2 px-3">{selectedProduct.category}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium">Brand:</td>
                      <td className="py-2 px-3">{selectedProduct.brand}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium">Stock:</td>
                      <td className="py-2 px-3">{selectedProduct.stock}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium">Purchase Price:</td>
                      <td className="py-2 px-3">Rs. {selectedProduct.purchaseprice}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium">Status:</td>
                      <td className="py-2 px-3">{selectedProduct.status}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <button 
                  onClick={handlePrintBarcode}
                  className="bg-primary text-white px-4 py-2 rounded-lg"
                >
                  Print Barcode
                </button>
                <button 
                  onClick={() => setShowBarcodeModal(false)} 
                  className="bg-danger text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}