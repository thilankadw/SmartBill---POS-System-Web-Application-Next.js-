'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/store/authStore';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';


interface ProductSale {
    name: string;
    totalSales: number;
    quantity: number;
}

interface PaymentMethodSummary {
    method: string;
    amount: number;
}

interface DailySaleSummary {
    date: string;
    total: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const Sales = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuthStore();

    const [productSales, setProductSales] = useState<ProductSale[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodSummary[]>([]);
    const [dailySales, setDailySales] = useState<DailySaleSummary[]>([]);
    const [paymentStatus, setPaymentStatus] = useState({
        paid: 0,
        pending: 0
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                if (!user?.uid) {
                    setError('Shop ID not found');
                    return;
                }

                const response = await fetch(`/api/sale/all-sales?shopId=${user.uid}`);
                if (!response.ok) throw new Error('Failed to fetch sales');

                const data = await response.json();
                if (data.success) {
                    setSales(data.sales);
                    processChartData(data.sales);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load sales');
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, [user?.uid]);

    const processChartData = (salesData: Sale[]) => {
        const productMap = new Map<string, ProductSale>();
        const paymentMap = new Map<string, number>();
        const dailyMap = new Map<string, number>();
        let paidTotal = 0;
        let pendingTotal = 0;

        salesData.forEach(sale => {
            sale.products.forEach(product => {
                const existing = productMap.get(product.name);
                if (existing) {
                    existing.totalSales += product.purchasePrice * product.quantity;
                    existing.quantity += product.quantity;
                } else {
                    productMap.set(product.name, {
                        name: product.name,
                        totalSales: product.purchasePrice * product.quantity,
                        quantity: product.quantity
                    });
                }
            });

            sale.paymentMethods.forEach(payment => {
                const existingAmount = paymentMap.get(payment.method) || 0;
                paymentMap.set(payment.method, existingAmount + payment.amount);
            });

            const dateStr = new Date(sale.purchaseDate).toLocaleDateString();
            const existingAmount = dailyMap.get(dateStr) || 0;
            dailyMap.set(dateStr, existingAmount + sale.totalAmount);

            if (sale.status === 'paid') {
                paidTotal += sale.totalAmount;
            } else {
                pendingTotal += sale.totalAmount;
            }
        });

        setProductSales(Array.from(productMap.values())
            .sort((a, b) => b.totalSales - a.totalSales)
            .slice(0, 10)); 

        setPaymentMethods(Array.from(paymentMap.entries())
            .map(([method, amount]) => ({ method, amount })));

        setDailySales(Array.from(dailyMap.entries())
            .map(([date, total]) => ({ date, total }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));

        setPaymentStatus({
            paid: paidTotal,
            pending: pendingTotal
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen p-8 flex justify-center items-center">
                <p className="text-lg text-gray-600">Loading sales data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen p-8 flex justify-center items-center">
                <p className="text-lg text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gray-50">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Sales Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Total Sales</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        ${sales.reduce((sum, sale) => sum + sale.totalAmount, 0).toFixed(2)}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Total Orders</h3>
                    <p className="text-2xl font-bold text-gray-800">{sales.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Total Paid</h3>
                    <p className="text-2xl font-bold text-green-600">${paymentStatus.paid.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Total Pending</h3>
                    <p className="text-2xl font-bold text-yellow-600">${paymentStatus.pending.toFixed(2)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Sales Trend</h2>
                    <div className="h-64 text-black">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={dailySales}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                                <Legend />
                                <Line type="monotone" dataKey="total" stroke="#8884d8" name="Daily Sales" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Payment Methods</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={paymentMethods}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="amount"
                                    nameKey="method"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {paymentMethods.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `$${value}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Top Products by Sales</h2>
                    <div className="h-64 text-black">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={productSales}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" />
                                <Tooltip formatter={(value) => `$${value}`} />
                                <Legend />
                                <Bar dataKey="totalSales" fill="#82ca9d" name="Sales Amount" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Payment Status</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Paid', value: paymentStatus.paid },
                                        { name: 'Pending', value: paymentStatus.pending }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    <Cell fill="#4ade80" />
                                    <Cell fill="#fbbf24" />
                                </Pie>
                                <Tooltip formatter={(value) => `$${value}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 mb-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Products by Quantity Sold</h2>
                <div className="h-64 text-black">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={productSales}
                            margin={{ top: 5, right: 20, left: 20, bottom: 50 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={70}
                                interval={0}
                            />
                            <YAxis label={{ value: 'Quantity', angle: -90, position: 'insideLeft' }} />
                            <Tooltip formatter={(value) => `${value} units`} />
                            <Legend />
                            <Bar dataKey="quantity" fill="#8884d8" name="Quantity Sold" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <h2 className="text-lg font-semibold p-4 border-b border-gray-200 text-gray-700">Sales History</h2>

                {sales.length === 0 ? (
                    <p className="p-4 text-gray-600">No sales records found</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Methods</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sales
                                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                        .map((sale) => (
                                            <tr key={sale.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.id.substring(0, 8)}...</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(sale.purchaseDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    ${sale.totalAmount.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${sale.status === 'paid'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {sale.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {sale.paymentMethods.map((pm) => (
                                                        <div key={pm.method} className="mb-1 last:mb-0">
                                                            {pm.method}: ${pm.amount.toFixed(2)}
                                                        </div>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex items-center justify-between">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev =>
                                        Math.min(prev + 1, Math.ceil(sales.length / itemsPerPage))
                                    )}
                                    disabled={currentPage >= Math.ceil(sales.length / itemsPerPage)}
                                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage >= Math.ceil(sales.length / itemsPerPage)
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, sales.length)}</span> to{' '}
                                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, sales.length)}</span> of{' '}
                                        <span className="font-medium">{sales.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setCurrentPage(1)}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">First</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                        {Array.from({ length: Math.min(5, Math.ceil(sales.length / itemsPerPage)) }, (_, i) => {
                                            let pageNum;
                                            const totalPages = Math.ceil(sales.length / itemsPerPage);

                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else {
                                                if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`relative inline-flex items-center px-4 py-2 border ${currentPage === pageNum
                                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-600 z-10'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        } text-sm font-medium`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}

                                        <button
                                            onClick={() => setCurrentPage(prev =>
                                                Math.min(prev + 1, Math.ceil(sales.length / itemsPerPage))
                                            )}
                                            disabled={currentPage >= Math.ceil(sales.length / itemsPerPage)}
                                            className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage >= Math.ceil(sales.length / itemsPerPage)
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(Math.ceil(sales.length / itemsPerPage))}
                                            disabled={currentPage >= Math.ceil(sales.length / itemsPerPage)}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage >= Math.ceil(sales.length / itemsPerPage)
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">Last</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>

                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
                            <div className="flex items-center">
                                <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600">
                                    Items per page:
                                </label>
                                <select
                                    id="itemsPerPage"
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="text-black text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sales;