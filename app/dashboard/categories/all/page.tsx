"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";

export default function AllCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.uid) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/category/all-categories?shopId=${user.uid}`);
        const result = await response.json();

        if (result.success) {
          setCategories(result.categories);
        } else {
          setError(result.message || "Failed to fetch categories");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("An error occurred while fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [user?.uid]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/category/delete-category?id=${id}&shopId=${user?.uid}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setCategories(categories.filter((category) => category.id !== id));
        alert("Category deleted successfully");
      } else {
        alert(result.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("An error occurred while deleting the category");
    }
  };

  const getRandomColor = (index: number) => {
    const colors = ["#FF5733", "#33B5E5", "#FFD700", "#4CAF50", "#FF69B4"];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-xl text-primary">Loading categories...</p>
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
      <div className="flex justify-end items-end w-full">
        <Link
          href={'/dashboard/categories/add'}
          className="bg-secondary px-4 py-2 rounded-lg text-white"
        >
          New Category
        </Link>
      </div>

      <h2 className="text-2xl font-semibold text-primary mb-6">Categories</h2>

      {categories.length === 0 ? (
        <div className="w-full max-w-4xl text-center text-gray-500">
          No categories found. Add a new category to get started.
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Category Name</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr
                  key={category.id}
                  className="border-b border-gray-300 hover:bg-gray-100"
                >
                  <td className="p-3 text-black">{index + 1}</td>
                  <td className="p-3">
                    <div
                      className={`w-12 h-12 rounded-md`}
                      style={{ backgroundColor: getRandomColor(index) }}
                    ></div>
                  </td>
                  <td className="p-3 text-black">{category.name}</td>
                  <td className="p-3 text-black">{category.description}</td>
                  <td className="p-3 flex space-x-2">
                    <Link
                      href={`/dashboard/categories/add?id=${category.id}`}
                      className="bg-accent text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="bg-danger text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}