"use client";

import Button from "@/app/components/button";
import Input from "@/app/components/input";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";

export default function AddSupplier() {
    const { user } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const supplierId = searchParams.get('id');
    const isEditMode = !!supplierId;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [supplier, setSupplier] = useState<Supplier>({
        id: supplierId || "",
        suppliername: "",
        mobile: "",
        email: "",
        credit: null,
        updatedAt: new Date(),
        status: "active",
    });

    useEffect(() => {
        const fetchSupplier = async () => {
            if (isEditMode && user?.uid) {
                try {
                    const response = await fetch(`/api/supplier/get-supplier?id=${supplierId}&shopId=${user.uid}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch supplier');
                    }
                    const result = await response.json();
                    
                    if (result.success) {
                        setSupplier({
                            id: supplierId,
                            suppliername: result.supplier.suppliername,
                            mobile: result.supplier.mobile,
                            email: result.supplier.email,
                            credit: result.supplier.credit,
                            updatedAt: new Date(result.supplier.updatedAt),
                            status: result.supplier.status
                        });
                    }
                } catch (error) {
                    console.error("Error fetching supplier:", error);
                    setError("Failed to load supplier data");
                }
            }
        };

        fetchSupplier();
    }, [supplierId, isEditMode, user?.uid]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSupplier(prev => ({ 
            ...prev, 
            [name]: name === 'credit' ? (value ? Number(value) : null) : value 
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSupplier(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                suppliername: supplier.suppliername,
                mobile: supplier.mobile,
                email: supplier.email,
                credit: supplier.credit,
                status: supplier.status,
                shopId: user?.uid,
                supplierId: supplierId
            };

            const response = await fetch("/api/supplier/add-supplier", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                router.push("/dashboard/suppliers/all");
                alert(isEditMode ? "Supplier updated successfully!" : "Supplier added successfully!");
            } else {
                setError(result.message || "Operation failed");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white">
            <div className="w-full max-w-lg p-8 bg-primary rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-white text-center">
                    {isEditMode ? "Edit Supplier" : "Add Supplier"}
                </h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <Input 
                        label="Supplier Name" 
                        name="suppliername" 
                        type="text" 
                        placeholder="Enter supplier name" 
                        value={supplier.suppliername} 
                        onChange={handleInputChange} 
                    />
                    <Input 
                        label="Mobile" 
                        name="mobile" 
                        type="text" 
                        placeholder="Enter mobile number" 
                        value={supplier.mobile} 
                        onChange={handleInputChange} 
                    />
                    <Input 
                        label="Email" 
                        name="email" 
                        type="email" 
                        placeholder="Enter email" 
                        value={supplier.email} 
                        onChange={handleInputChange} 
                    />
                    <Input 
                        label="Credit" 
                        name="credit" 
                        type="number" 
                        placeholder="Enter credit amount" 
                        value={supplier.credit || ""} 
                        onChange={handleInputChange} 
                    />
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                        <select
                            name="status"
                            className="w-full px-4 py-2 bg-background border border-soft rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-accent"
                            value={supplier.status}
                            onChange={handleSelectChange}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <Button 
                        text={loading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Supplier" : "Add Supplier")} 
                        type="submit" 
                        disabled={loading} 
                    />
                </form>
            </div>
        </div>
    );
}