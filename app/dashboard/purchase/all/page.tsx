'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";

const OrdersList = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<SupplierOrder[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/purchase/all-purchases?shopId=${user?.uid}`);
        const data = await response.json();
        console.log(data);
        if (data.success) setOrders(data.orders);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };
    fetchOrders();
  }, [user]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/purchase/edit-purchase?shopId=${user?.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status })
      });
      const result = await response.json();
      if (result.success) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status } : order
        ));
      }
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  const renderStatusButton = (order: SupplierOrder) => {
    if (order.status === 'pending') return (
      <div className="flex space-x-2">
        <button
          onClick={() => handleStatusUpdate(order.id, 'completed')}
          className="bg-green-500 text-white px-3 py-1 rounded-md"
        >
          Complete
        </button>
        <button
          onClick={() => handleStatusUpdate(order.id, 'cancelled')}
          className="bg-red-500 text-white px-3 py-1 rounded-md"
        >
          Cancel
        </button>
      </div>
    );
    return <span className={`${order.status === 'completed' ? 'text-green-500' : 'text-red-500'}`}>
      {order.status}
    </span>;
  };

  return (
    <div className="w-full flex flex-col items-center bg-white p-8">
      <div className="flex justify-end w-full mb-4">
        <Link href="/dashboard/purchase/add" className="bg-secondary px-4 py-2 rounded-lg text-white">
          New Order
        </Link>
      </div>
      <h2 className="text-2xl font-semibold text-primary mb-6">Supplier Orders</h2>
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3 text-left">Supplier</th>
                <th className="p-3 text-left">Order Date</th>
                <th className="p-3 text-left">Total Amount</th>
                <th className="p-3 text-left">Due Payment</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200">
                  <td className="p-3 text-black">{order.supplierid}</td>
                  <td className="p-3 text-black">{new Date(order.purchaseDate).toLocaleDateString()}</td>
                  <td className="p-3 text-black">${order.totalamount}</td>
                  <td className="p-3 text-black">${order.duepayment}</td>
                  <td className="p-3 text-black">{order.status}</td>
                  <td className="p-3 text-black">{renderStatusButton(order)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;