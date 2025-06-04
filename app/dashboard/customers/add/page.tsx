"use client";

import { useState, useEffect } from "react";
import Button from "@/app/components/button";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/app/components/input";
import { useAuthStore } from "@/app/store/authStore";

export default function AddCustomer() {
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('id');
  const isEditMode = !!customerId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customer, setCustomer] = useState<Customer>({
    id: null,
    firstname: "",
    lastname: "",
    mobile: "",
    email: "",
    totalcredit: null,
    balancecredit: null,
    updatedAt: new Date(),
    status: "active"
  });

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (isEditMode && user?.uid) {
        try {
          const response = await fetch(`/api/customer/get-customer?id=${customerId}&shopId=${user.uid}`);
          const result = await response.json();

          if (result.success) {
            setCustomer({
              id: customerId,
              firstname: result.customer.firstname,
              lastname: result.customer.lastname,
              mobile: result.customer.mobile,
              email: result.customer.email,
              totalcredit: result.customer.totalcredit,
              balancecredit: result.customer.balancecredit,
              updatedAt: new Date(),
              status: result.customer.status
            });
          } else {
            setError(result.message || "Failed to fetch customer details");
          }
        } catch (error) {
          console.error("Error fetching customer:", error);
          setError("Failed to fetch customer details");
        }
      }
    };

    fetchCustomerDetails();
  }, [customerId, user?.uid, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer(prev => ({ 
      ...prev, 
      [e.target.name]: e.target.value,
      updatedAt: new Date()
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.uid) {
      setError("You must be logged in to manage customers");
      return;
    }

    if (
      customer.firstname.trim() === "" || 
      customer.lastname.trim() === "" || 
      customer.mobile.trim() === "" || 
      customer.email.trim() === ""
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (customer.firstname.trim().length < 2 || customer.lastname.trim().length < 2) {
      setError("First and last names must be at least 2 characters long");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email.trim())) {
      setError("Invalid email format");
      return;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(customer.mobile.trim())) {
      setError("Mobile number must be 10 digits long");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/customer/add-customer", {
        method: "POST",
        body: JSON.stringify({
          firstname: customer.firstname.trim(),
          lastname: customer.lastname.trim(),
          mobile: customer.mobile.trim(),
          email: customer.email.trim(),
          totalcredit: customer.totalcredit,
          balancecredit: customer.balancecredit,
          status: customer.status,
          updatedAt: customer.updatedAt,
          shopId: user.uid,
          id: isEditMode ? customerId : undefined
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        setCustomer({ 
          id: null,
          firstname: "", 
          lastname: "", 
          mobile: "", 
          email: "", 
          totalcredit: 0, 
          balancecredit: 0, 
          updatedAt: new Date(),
          status: "active" 
        });
        
        alert(isEditMode ? "Customer updated successfully!" : "Customer added successfully!");
        router.push("/dashboard/customers/all");
      } else {
        setError(result.message || (isEditMode ? "Failed to update customer" : "Failed to add customer"));
      }
    } catch (error) {
      console.error(isEditMode ? "Error updating customer:" : "Error adding customer:", error);
      setError(isEditMode ? "Failed to update customer. Please try again." : "Failed to add customer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="w-full max-w-lg p-8 bg-primary rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-white text-center">
          {isEditMode ? "Edit Customer" : "Add Customer"}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="First Name"
            name="firstname"
            type="text"
            placeholder="Enter first name"
            value={customer.firstname}
            onChange={handleChange}
          />
          
          <Input
            label="Last Name"
            name="lastname"
            type="text"
            placeholder="Enter last name"
            value={customer.lastname}
            onChange={handleChange}
          />
          
          <Input
            label="Mobile"
            name="mobile"
            type="tel"
            placeholder="Enter mobile number"
            value={customer.mobile}
            onChange={handleChange}
          />
          
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={customer.email}
            onChange={handleChange}
          />
          
          <Button 
            text={loading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Customer" : "Add Customer")} 
            type="submit" 
            disabled={loading} 
          />
        </form>
      </div>
    </div>
  );
}