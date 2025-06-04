"use client";

import { useState, useEffect } from "react";
import Button from "@/app/components/button";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/app/components/input";
import { useAuthStore } from "@/app/store/authStore";

export default function AddProduct() {
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const isEditMode = !!productId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product>({
    id: "",
    name: "",
    stock: 0,
    sellingprice: 0,
    purchaseprice: 0,
    category: "",
    brand: "",
    imagepath: "",
    status: "active",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.uid) return;

      try {
        const response = await fetch(`/api/category/all-categories?shopId=${user.uid}`);
        const result = await response.json();
        
        if (result.success) {
          setCategories(result.categories);
        } else {
          setError(result.message || "Failed to load categories");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, [user?.uid]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (isEditMode && user?.uid) {
        try {
          const response = await fetch(`/api/product/get-product?id=${productId}&shopId=${user.uid}`);
          const result = await response.json();

          if (result.success) {
            setProduct({
              id: productId,
              name: result.product.name,
              stock: result.product.stock,
              sellingprice: result.product.sellingprice,
              purchaseprice: result.product.purchaseprice,
              category: result.product.category,
              brand: result.product.brand,
              imagepath: result.product.imagepath || "",
              status: result.product.status || "active"
            });
          } else {
            setError(result.message || "Failed to fetch product details");
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          setError("Failed to fetch product details");
        }
      }
    };

    fetchProductDetails();
  }, [productId, user?.uid, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProduct(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(null);
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setProduct(prev => ({
  //       ...prev,
  //       imagepath: URL.createObjectURL(e.target.files![0])
  //     }));
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.uid) {
      setError("You must be logged in to manage products");
      return;
    }

    if (
      product.name.trim() === "" ||
      product.category.trim() === "" ||
      product.brand.trim() === ""
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (
      Number(product.stock) < 0 ||
      Number(product.sellingprice) < 0 ||
      Number(product.purchaseprice) < 0
    ) {
      setError("Numerical values cannot be negative");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/product/add-product", {
        method: "POST",
        body: JSON.stringify({
          ...product,
          stock: Number(product.stock),
          sellingprice: Number(product.sellingprice),
          purchaseprice: Number(product.purchaseprice),
          shopId: user.uid,
          id: isEditMode ? productId : undefined
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        setProduct({
          id: "",
          name: "",
          stock: 0,
          sellingprice: 0,
          purchaseprice: 0,
          category: "",
          brand: "",
          imagepath: "",
          status: "active"
        });
        
        alert(isEditMode ? "Product updated successfully!" : "Product added successfully!");
        router.push("/dashboard/products/all");
      } else {
        setError(result.message || (isEditMode ? "Failed to update product" : "Failed to add product"));
      }
    } catch (error) {
      console.error(isEditMode ? "Error updating product:" : "Error adding product:", error);
      setError(isEditMode ? "Failed to update product. Please try again." : "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white my-8">
      <div className="w-full max-w-lg p-8 bg-primary rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-white text-center">
          {isEditMode ? "Edit Product" : "Add Product"}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Product Name"
            name="name"
            type="text"
            placeholder="Enter product name"
            value={product.name}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Category</label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background border border-soft rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-accent"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Stock"
            name="stock"
            type="number"
            placeholder="Enter stock"
            value={product.stock.toString()}
            onChange={handleChange}
          />

          <Input
            label="Selling Price ($)"
            name="sellingprice"
            type="number"
            placeholder="Enter selling price"
            value={product.sellingprice.toString()}
            onChange={handleChange}
          />

          <Input
            label="Purchase Price ($)"
            name="purchaseprice"
            type="number"
            placeholder="Enter purchase price"
            value={product.purchaseprice.toString()}
            onChange={handleChange}
          />

          <Input
            label="Brand"
            name="brand"
            type="text"
            placeholder="Enter brand"
            value={product.brand}
            onChange={handleChange}
          />

          {/* <div>
            <label className="block text-sm font-medium text-foreground mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-highlight hover:file:bg-accent"
            />
          </div> */}
          
          <Button 
            text={loading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Product" : "Add Product")} 
            type="submit" 
            disabled={loading} 
          />
        </form>
      </div>
    </div>
  );
}