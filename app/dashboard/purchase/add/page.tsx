'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";

const PlaceOrder = () => {
  const {user} = useAuthStore();
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<SupplierOrder>({
    id: "",
    supplierid: "",
    purchaseDate: new Date(),
    products: [],
    paymentmethod: "",
    advancedpayment: 0,
    totalamount: 0,
    duepayment: 0,
    status: "pending",
  });

  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch(`/api/supplier/all-suppliers?shopId=${user?.uid}`);
        const data = await response.json();
        if (data.success) {
          console.log(data.suppliers)
          setSuppliers(data.suppliers);
        }
      } catch (error) {
        console.error("Failed to fetch suppliers", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/product/all-products?shopId=${user?.uid}`);
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchSuppliers();
    fetchProducts();
  }, [user]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (product: Product) => {
    setOrder((prevOrder) => {
      const newProduct = {
        productid: product.id,
        purchasePrice: product.purchaseprice,
        purchaseStock: 1,
      };
      if (prevOrder.products.some(p => p.productid === product.id)) {
        return prevOrder;
      }
      return {
        ...prevOrder,
        products: [...prevOrder.products, newProduct],
        totalamount: prevOrder.totalamount + product.purchaseprice
      };
    });
    setSearchTerm('');
  };

  const handleRemoveProduct = (productId: string) => {
    setOrder((prevOrder) => {
      const removedProduct = prevOrder.products.find(p => p.productid === productId);
      return {
        ...prevOrder,
        products: prevOrder.products.filter((product) => product.productid !== productId),
        totalamount: prevOrder.totalamount - (removedProduct?.purchasePrice || 0)
      };
    });
  };

  const handleProductChange = (index: number, field: string, value: number) => {
    const updatedProducts = [...order.products];
    const oldProduct = updatedProducts[index];
    updatedProducts[index] = { ...oldProduct, [field]: value };
    
    const priceDifference = (field === 'purchasePrice' ? value - oldProduct.purchasePrice : 0);
    const stockDifference = (field === 'purchaseStock' ? value - oldProduct.purchaseStock : 0);

    setOrder({ 
      ...order, 
      products: updatedProducts,
      totalamount: order.totalamount + priceDifference * stockDifference
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/purchase/add-purchase?shopId=${user?.uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
      });
      const result = await response.json();
      if (result.success) {
        router.push('/dashboard/purchase/all');
      }
    } catch (error) {
      console.error("Order submission failed", error);
    }
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-4xl p-8 bg-primary rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">Place Supplier Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-white mb-1">Supplier</label>
            <select
              name="supplierid"
              className="w-full px-4 py-2 bg-white border border-soft rounded-lg text-black"
              onChange={(e) => setOrder({ ...order, supplierid: e.target.value })}
              value={order.supplierid}
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id} >
                  {supplier.suppliername}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Search Products</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-white border border-soft rounded-lg text-black"
              placeholder="Search by product name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && filteredProducts.length > 0 && (
              <ul className="bg-white border border-soft mt-2 max-h-60 overflow-y-auto rounded-lg shadow-lg absolute">
                {filteredProducts.map((product) => (
                  <li
                    key={product.id}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
                    onClick={() => {
                      handleAddProduct(product);
                      setSearchTerm('');
                    }}
                  >
                    {product.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-4 mt-4">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-white">Product Name</th>
                  <th className="px-4 py-2 text-white">Purchase Price</th>
                  <th className="px-4 py-2 text-white">Purchase Stock</th>
                  <th className="px-4 py-2 text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-white">{products.find(p => p.id === product.productid)?.name}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        className="w-full px-4 py-2 border border-soft rounded-lg text-black"
                        value={product.purchasePrice}
                        onChange={(e) => handleProductChange(index, "purchasePrice", Number(e.target.value))}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        className="w-full px-4 py-2 border border-soft rounded-lg text-black"
                        value={product.purchaseStock}
                        onChange={(e) => handleProductChange(index, "purchaseStock", Number(e.target.value))}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        className="text-red-500"
                        onClick={() => handleRemoveProduct(product.productid)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Payment Method</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-white border border-soft rounded-lg text-black"
              placeholder="Enter payment method"
              onChange={(e) => setOrder({ ...order, paymentmethod: e.target.value })}
              value={order.paymentmethod}
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-white mb-1">Advanced Payment</label>
              <input
                type="number"
                className="w-full px-4 py-2 bg-white border border-soft rounded-lg text-black"
                value={order.advancedpayment}
                onChange={(e) => setOrder({ ...order, advancedpayment: Number(e.target.value) })}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-white mb-1">Total Amount</label>
              <input
                type="number"
                className="w-full px-4 py-2 bg-white border border-soft rounded-lg text-black"
                value={order.totalamount}
                onChange={(e) => setOrder({ ...order, totalamount: Number(e.target.value) })}
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-accent text-white py-3 rounded-lg">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;
