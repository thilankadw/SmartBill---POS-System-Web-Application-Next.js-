"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";

export default function AllCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!user?.uid) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/customer/all-customers?shopId=${user.uid}`);
        const result = await response.json();

        if (result.success) {
          setCustomers(result.customers);
        } else {
          setError(result.message || "Failed to fetch customers");
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("An error occurred while fetching customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [user?.uid]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/customer/delete-customer?id=${id}&shopId=${user?.uid}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setCustomers(customers.filter((customer) => customer.id !== id));
        alert("Customer deleted successfully");
      } else {
        alert(result.message || "Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("An error occurred while deleting the customer");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-xl text-primary">Loading customers...</p>
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
          href={'/dashboard/customers/add'}
          className="bg-secondary px-4 py-2 rounded-lg text-white"
        >
          New Customer
        </Link>
      </div>

      <h2 className="text-2xl font-semibold text-primary mb-6">Customers</h2>

      {customers.length === 0 ? (
        <div className="w-full max-w-4xl text-center text-gray-500">
          No customers found. Add a new customer to get started.
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">First Name</th>
                <th className="p-3 text-left">Last Name</th>
                <th className="p-3 text-left">Mobile</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Total Credit</th>
                <th className="p-3 text-left">Balance Credit</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-300 hover:bg-gray-100"
                >
                  <td className="p-3 text-black">{index + 1}</td>
                  <td className="p-3 text-black">{customer.firstname}</td>
                  <td className="p-3 text-black">{customer.lastname}</td>
                  <td className="p-3 text-black">{customer.mobile}</td>
                  <td className="p-3 text-black">{customer.email}</td>
                  <td className="p-3 text-black">Rs. {customer.totalcredit ?? 0}</td>
                  <td className="p-3 text-black">Rs. {customer.balancecredit ?? 0}</td>
                  <td className={`p-3 font-semibold ${customer.status === "active" ? "text-green-600" : "text-red-600"}`}>
                    {customer.status}
                  </td>
                  <td className="p-3 flex space-x-2">
                    <Link
                      href={`/dashboard/customers/add?id=${customer.id}`}
                      className="bg-accent text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(customer.id!)}
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