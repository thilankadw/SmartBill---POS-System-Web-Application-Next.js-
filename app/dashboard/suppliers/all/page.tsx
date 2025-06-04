"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";

export default function AllSuppliers() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                if (!user?.uid) {
                    setError("User not authenticated");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`/api/supplier/all-suppliers?shopId=${user.uid}`);
                const result = await response.json();

                if (result.success) {
                    setSuppliers(result.suppliers.map((supplier: Supplier) => ({
                        ...supplier,
                        updatedAt: new Date(supplier.updatedAt)
                    })));
                } else {
                    setError(result.message || "Failed to fetch suppliers");
                }
            } catch (err) {
                console.error("Error fetching suppliers:", err);
                setError("An error occurred while fetching suppliers");
            } finally {
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, [user?.uid]);

    const handleEdit = (id: string) => {
        router.push(`/dashboard/suppliers/add?id=${id}`);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this supplier?")) return;
        if (!user?.uid) {
            alert("User not authenticated");
            return;
        }

        try {
            const response = await fetch(`/api/supplier/delete-suppliers?id=${id}&shopId=${user.uid}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
                alert("Supplier deleted successfully");
            } else {
                alert(result.message || "Failed to delete supplier");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred while deleting the supplier");
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading suppliers...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-8">{error}</div>;
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-white p-8">
            <div className="flex justify-end items-end w-full">
                <Link href={'/dashboard/suppliers/add'} className="bg-secondary px-4 py-2 rounded-lg text-white">New Supplier</Link>
            </div>
            <h2 className="text-2xl font-semibold text-primary mb-6">Suppliers</h2>
            {suppliers.length === 0 ? (
                <div className="text-center text-gray-500">No suppliers found</div>
            ) : (
                <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-primary text-white">
                                <th className="p-3 text-left">#</th>
                                <th className="p-3 text-left">Supplier Name</th>
                                <th className="p-3 text-left">Mobile</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Credit</th>
                                <th className="p-3 text-left">Updated At</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((supplier, index) => (
                                <tr key={supplier.id} className="border-b border-gray-300 hover:bg-gray-100">
                                    <td className="p-3 text-black">{index + 1}</td>
                                    <td className="p-3 text-black">{supplier.suppliername}</td>
                                    <td className="p-3 text-black">{supplier.mobile}</td>
                                    <td className="p-3 text-black">{supplier.email}</td>
                                    <td className="p-3 text-black">Rs. {supplier.credit}</td>
                                    <td className="p-3 text-black">{supplier.updatedAt?.toLocaleString()}</td>
                                    <td className={`p-3 font-semibold ${supplier.status === "active" ? "text-green-600" : "text-red-600"}`}>
                                        {supplier.status}
                                    </td>
                                    <td className="p-3 flex space-x-2">
                                        <button 
                                            onClick={() => handleEdit(supplier.id)} 
                                            className="bg-accent text-white px-3 py-1 rounded-md"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(supplier.id)} 
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