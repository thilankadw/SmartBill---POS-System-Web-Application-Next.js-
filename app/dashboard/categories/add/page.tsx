"use client";

import { useState, useEffect } from "react";
import Button from "@/app/components/button";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/app/components/input";
import { useAuthStore } from "@/app/store/authStore";

export default function AddCategory() {
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('id');
  const isEditMode = !!categoryId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<Category>({
    id: categoryId || "",
    name: "",
    description: "",
    imagepath: null,
    status: "active"
  });

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (isEditMode && user?.uid) {
        try {
          const response = await fetch(`/api/category/get-category?id=${categoryId}&shopId=${user.uid}`);
          const result = await response.json();

          if (result.success) {
            setCategory({
              id: categoryId,
              name: result.category.name,
              description: result.category.description,
              imagepath: result.category.imagepath || null,
              status: result.category.status || "active"
            });
          } else {
            setError(result.message || "Failed to fetch category details");
          }
        } catch (error) {
          console.error("Error fetching category:", error);
          setError("Failed to fetch category details");
        }
      }
    };

    fetchCategoryDetails();
  }, [categoryId, user?.uid, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.uid) {
      setError("You must be logged in to manage categories");
      return;
    }

    if (category.name.trim() === "" || category.description.trim() === "") {
      setError("Please fill in all fields");
      return;
    }

    if (category.name.length < 3) {
      setError("Category name must be at least 3 characters long");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/category/add-category", {
        method: "POST",
        body: JSON.stringify({
          name: category.name.trim(),
          description: category.description.trim(),
          shopId: user.uid,
          categoryId: isEditMode ? categoryId : undefined
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        setCategory({ 
          id: "", 
          name: "", 
          description: "", 
          imagepath: null, 
          status: "active" 
        });
        
        alert(isEditMode ? "Category updated successfully!" : "Category added successfully!");
        
        router.push("/dashboard/categories/all");
      } else {
        setError(result.message || (isEditMode ? "Failed to update category" : "Failed to add category"));
      }
    } catch (error) {
      console.error(isEditMode ? "Error updating category:" : "Error adding category:", error);
      setError(isEditMode ? "Failed to update category. Please try again." : "Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="w-full max-w-lg p-8 bg-primary rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-white text-center">
          {isEditMode ? "Edit Category" : "Add Category"}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Category Name"
            name="name"
            type="text"
            placeholder="Enter category name"
            value={category.name}
            onChange={handleChange}
          />
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Enter category description"
              className="w-full px-4 py-2 bg-background border border-soft rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              rows={4}
              value={category.description}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <Button 
            text={loading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Category" : "Add Category")} 
            type="submit" 
            disabled={loading} 
          />
        </form>
      </div>
    </div>
  );
}