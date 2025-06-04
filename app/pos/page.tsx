"use client";

import { useState, useEffect } from "react";
import Button from "@/app/components/button";
import Input from "@/app/components/input";
import Link from "next/link";
import NumericKeyboardModal from "@/app/components/keyboard/keyboard";
import { useAuthStore } from "../store/authStore";

const POSSystem = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("1");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [discountType, setDiscountType] = useState<"amount" | "percentage">("amount");
  const [discountValue, setDiscountValue] = useState<number | string>(0);
  const [paymentMethods, setPaymentMethods] = useState<{ method: string; amount: number }[]>([]);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<string | null>(null);
  const [currentPaymentAmount, setCurrentPaymentAmount] = useState<number | string>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isBillModalVisible, setIsBillModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"discount" | "payment">("discount");
  const [selectedProducts, setSelectedProducts] = useState<{ product: Product, quantity: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [searchType, setSearchType] = useState<"mobile" | "email">("mobile");
  const [searchValue, setSearchValue] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearchResults, setCustomerSearchResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [customerSearchError, setCustomerSearchError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const handleConfirmOrder = () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    if (paymentMethods.length === 0) {
      alert("Please select at least one payment method");
      return;
    }

    const hasCreditPayment = paymentMethods.some(method => method.method === "credit");

    if (hasCreditPayment && !selectedCustomer) {
      alert("Please select a customer for credit payment");
      return;
    }

    const totalPaid = paymentMethods.reduce((sum, method) => sum + method.amount, 0);
    if (totalPaid !== finalAmount) {
      alert(`Total payment amount (${totalPaid.toFixed(2)}) does not match the final amount (${finalAmount.toFixed(2)})`);
      return;
    }

    setIsBillModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setIsPaymentModalVisible(false);
  };

  const handleKeyPress = (key: string) => {
    if (modalMode === "discount") {
      if (key === "backspace") {
        setDiscountValue((prev) => {
          const prevStr = prev.toString();
          return prevStr.slice(0, -1) || 0;
        });
      } else {
        setDiscountValue((prev) => {
          const newValue = prev.toString() + key;
          return newValue.replace(/^0+/, '') || 0;
        });
      }
    } else if (modalMode === "payment") {
      if (key === "backspace") {
        setCurrentPaymentAmount((prev) => {
          const prevStr = prev.toString();
          return prevStr.slice(0, -1) || 0;
        });
      } else {
        setCurrentPaymentAmount((prev) => {
          const newValue = prev.toString() + key;
          return newValue.replace(/^0+/, '') || 0;
        });
      }
    }
  };

  const filteredProducts = products
    .filter((product) => product.category === categories.find(c => c.id === selectedCategory)?.name);

  const subtotal = selectedProducts.reduce((acc, item) => acc + item.product.sellingprice * item.quantity, 0);
  const discountAmount = discountType === "amount"
    ? Number(discountValue)
    : (subtotal * Number(discountValue)) / 100;
  const finalAmount = subtotal - discountAmount;

  const handleAddProduct = (product: Product) => {
    const existingItem = selectedProducts.find(item => item.product.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;

    if (currentQuantity + 1 > product.stock) {
      alert(`Not enough stock for ${product.name}. Available: ${product.stock}`);
      return;
    }

    const existingProductIndex = selectedProducts.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingProductIndex > -1) {
      const updatedSelectedProducts = [...selectedProducts];
      updatedSelectedProducts[existingProductIndex].quantity += 1;
      setSelectedProducts(updatedSelectedProducts);
    } else {
      setSelectedProducts([...selectedProducts, { product, quantity: 1 }]);
    }
  };

  const handleProductQuantityChange = (productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId);

    if (product && newQuantity > product.stock) {
      alert(`Not enough stock for ${product.name}. Available: ${product.stock}`);
      return;
    }

    if (newQuantity === 0) {
      setSelectedProducts(
        selectedProducts.filter((item) => item.product.id !== productId)
      );
    } else {
      const updatedProducts = selectedProducts.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      setSelectedProducts(updatedProducts);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(
      selectedProducts.filter((item) => item.product.id !== productId)
    );
  };

  const handleOpenDiscountModal = () => {
    setModalMode("discount");
    setIsModalVisible(true);
  };

  const handleSelectPaymentMethod = (method: string) => {
    if (method === "credit" && !selectedCustomer) {
      setShowCustomerSearch(true);
      return;
    }
    setCurrentPaymentMethod(method);
    setCurrentPaymentAmount(0);
    setModalMode("payment");
    setIsPaymentModalVisible(true);
  };

  const handleAddPaymentMethod = () => {
    const amount = Number(currentPaymentAmount);
    if (amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const existingTotal = paymentMethods.reduce((sum, method) => sum + method.amount, 0);
    const remainingAmount = finalAmount - existingTotal;

    if (amount > remainingAmount) {
      alert(`Amount exceeds remaining total (${remainingAmount.toFixed(2)})`);
      return;
    }

    const existingMethodIndex = paymentMethods.findIndex(p => p.method === currentPaymentMethod);
    if (existingMethodIndex >= 0) {
      const updatedMethods = [...paymentMethods];
      updatedMethods[existingMethodIndex].amount += amount;
      setPaymentMethods(updatedMethods);
    } else {
      setPaymentMethods([...paymentMethods, { method: currentPaymentMethod!, amount }]);
    }

    setIsPaymentModalVisible(false);
    setCurrentPaymentMethod(null);
    setCurrentPaymentAmount(0);
  };

  const handleRemovePaymentMethod = (method: string) => {
    setPaymentMethods(paymentMethods.filter(p => p.method !== method));

    if (method === "credit" && !paymentMethods.some(p => p.method === "credit" && p.method !== method)) {
      setSelectedCustomer(null);
    }
  };

  const handleSubmit = () => {
    if (modalMode === "discount") {
      setIsModalVisible(false);
    } else if (modalMode === "payment") {
      handleAddPaymentMethod();
    }
  };

  const handleCloseBillModal = () => {
    setIsBillModalVisible(false);
  };

  const updateProductStock = async (productId: string, newStock: number) => {
    if (!user?.uid) return false;

    try {
      const response = await fetch(`/api/product/update-stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: productId,
          stock: newStock,
          shopId: user.uid
        }),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Error updating product stock:", error);
      return false;
    }
  };

  const handleCompletePurchase = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    const hasCreditPayment = paymentMethods.some(payment => payment.method === 'credit');
    if (hasCreditPayment && !selectedCustomer) {
      alert("Customer selection is required for credit payments");
      setIsProcessing(false);
      return;
    }

    const orderDetails = {
      userId: user?.uid,
      shopId: user?.uid,
      customerId: selectedCustomer?.id || null,
      products: selectedProducts,
      subtotal,
      discountType,
      discountValue,
      discountAmount,
      totalAmount: finalAmount,
      paymentMethods,
      date: new Date(),
    };

    try {
      let allStockUpdatesSuccessful = true;

      for (const item of selectedProducts) {
        const newStock = item.product.stock - item.quantity;
        const updateSuccess = await updateProductStock(item.product.id, newStock);

        if (!updateSuccess) {
          allStockUpdatesSuccessful = false;
          break;
        }

        setProducts(products.map(p =>
          p.id === item.product.id ? { ...p, stock: newStock } : p
        ));
      }

      if (!allStockUpdatesSuccessful) {
        setIsProcessing(false);
        alert("Error updating product stock. Please try again.");
        return;
      }

      const response = await fetch('/api/sale/new-sale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Order Completed Successfully! Total: Rs ${finalAmount.toFixed(2)}`);

        setSelectedProducts([]);
        setDiscountValue(0);
        setDiscountType("amount");
        setPaymentMethods([]);
        setSelectedCustomer(null);
        setIsBillModalVisible(false);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error completing purchase:", error);
      alert("An error occurred while processing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearchCustomer = async () => {
    if (!searchValue.trim()) {
      setCustomerSearchError("Please enter a search value");
      return;
    }

    setIsSearching(true);
    setCustomerSearchError(null);
    setCustomerSearchResults([]);

    try {
      const response = await fetch(`/api/customer/search-customer?shopId=${user?.uid}&searchType=${searchType}&searchValue=${searchValue}`);
      const result = await response.json();

      if (result.success) {
        setCustomerSearchResults(result.customers);
        if (result.customers.length === 0) {
          setCustomerSearchError("No customers found");
        }
      } else {
        setCustomerSearchError(result.message || "Failed to search customers");
      }
    } catch (error) {
      console.error("Error searching customers:", error);
      setCustomerSearchError("An error occurred while searching for customers");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerSearch(false);
    setCurrentPaymentMethod("credit");
    setCurrentPaymentAmount(0);
    setModalMode("payment");
    setIsPaymentModalVisible(true);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user?.uid) {
        setError("User not authenticated.")
        setLoading(false)
        return false;
      }
      try {
        const response = await fetch(`/api/product/all-products?shopId=${user?.uid}`);
        const result = await response.json()

        if (result.success) {
          setProducts(result.products)
          console.log(result.success)
        } else {
          setError(result.message || "Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("An error occurred while fetching products");
      } finally {
        setLoading(false);
      }
    }

    const fetchCategories = async () => {
      if (!user?.uid) {
        setError("User not authenticated.")
        setLoading(false)
        return false;
      }
      try {
        const response = await fetch(`/api/category/all-categories?shopId=${user?.uid}`);
        const result = await response.json()

        if (result.success) {
          setCategories(result.categories)
          console.log(result.success)
        } else {
          setError(result.message || "Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("An error occurred while fetching categories.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts()
    fetchCategories()
  }, [user?.uid]);

  useEffect(() => {
    const fetchCustomerCreditDetails = async (customerId: string) => {
    if (!customerId) return;
  
    try {
      const response = await fetch(`/api/customer/get-credits?customerId=${customerId}&shopId=${user?.uid}`);
      const result = await response.json();
  
      if (result.success) {
        setSelectedCustomer(prev => ({
          ...prev!,
          totalcredit: result.creditDetails.totalCredit,
          balancecredit: result.creditDetails.balanceCredit
        }));
      }
    } catch (error) {
      console.error("Error fetching customer credit details:", error);
    }
  };
    if (selectedCustomer?.id) {
      fetchCustomerCreditDetails(selectedCustomer.id);
    }
  }, [selectedCustomer?.id, user?.uid]);  

  const paidAmount = paymentMethods.reduce((sum, method) => sum + method.amount, 0);
  const remainingAmount = finalAmount - paidAmount;

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-xl text-primary">Loading products...</p>
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
    <>
      <div className="min-h-screen flex items-start justify-center bg-gray-50 p-6">
        <div className="w-full max-w-7xl flex space-x-6">
          <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
            
            <h3 className="text-xl font-semibold text-secondary mb-4">Select Category</h3>
            <div className="space-y-4 mb-6 max-h-40 overflow-y-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`w-full text-left text-black px-4 py-2 border ${selectedCategory === category.id ? "bg-soft" : "bg-white"}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <h3 className="text-xl font-semibold text-secondary mb-4">Select Products</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border-b">
                  <div>
                    <span className="text-lg text-black">{product.name}</span>
                    <span className="block text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>
                  <button
                    onClick={() => handleAddProduct(product)}
                    className={`px-4 py-2 rounded ${product.stock > 0 ? "bg-accent text-white" : "bg-gray-300 text-gray-500"}`}
                    disabled={product.stock <= 0}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg">
            <div className="space-y-4 mb-6">
              <h3 className="text-xl text-secondary">Selected Products</h3>
              <div className="h-[200px] overflow-y-auto border border-gray-200 rounded">
                {selectedProducts.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No products selected
                  </div>
                ) : (
                  selectedProducts.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <span className="text-lg text-black flex-grow">{item.product.name}</span>
                      <div className="flex items-center mr-4">
                        <button
                          onClick={() => handleProductQuantityChange(item.product.id, item.quantity - 1)}
                          className="bg-soft px-2 py-1 text-lg text-black rounded-full disabled:bg-gray-200"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="mx-2 text-black">{item.quantity}</span>
                        <button
                          onClick={() => handleProductQuantityChange(item.product.id, item.quantity + 1)}
                          className="bg-accent px-2 py-1 text-lg text-black rounded-full"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-lg text-black mr-4">Rs {item.product.sellingprice * item.quantity}</span>
                      <button
                        onClick={() => handleRemoveProduct(item.product.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="text-xl text-secondary">Discount</h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center text-sm text-black">
                  <input
                    type="radio"
                    name="discountType"
                    value="amount"
                    checked={discountType === "amount"}
                    onChange={() => setDiscountType("amount")}
                    className="mr-2 text-black"
                  />
                  Discount Amount
                </label>
                <label className="flex items-center text-sm text-black">
                  <input
                    type="radio"
                    name="discountType"
                    value="percentage"
                    checked={discountType === "percentage"}
                    onChange={() => setDiscountType("percentage")}
                    className="mr-2"
                  />
                  Discount Percentage
                </label>
              </div>
              <Input
                label={`Discount ${discountType === "amount" ? "Amount" : "Percentage"}`}
                type="number"
                value={discountValue}
                onClick={handleOpenDiscountModal}
                readOnly
                placeholder={`Enter discount ${discountType === "amount" ? "amount" : "percentage"}`}
              />
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="text-xl text-secondary">Payment Methods</h3>
              <div className="flex space-x-4 mb-4">
                <button
                  className="px-4 py-2 rounded-lg bg-soft text-black"
                  onClick={() => handleSelectPaymentMethod("cash")}
                >
                  Add Cash
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-soft text-black"
                  onClick={() => handleSelectPaymentMethod("card")}
                >
                  Add Card
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-soft text-black"
                  onClick={() => handleSelectPaymentMethod("credit")}
                >
                  Add Credit
                </button>
              </div>

              <div className="border rounded-lg p-4 mb-4">
                <h4 className="font-medium mb-2 text-black">Selected Payment Methods</h4>
                {paymentMethods.length === 0 ? (
                  <p className="text-gray-500">No payment methods selected</p>
                ) : (
                  <div className="space-y-2">
                    {paymentMethods.map((payment, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="capitalize text-black">{payment.method}</span>
                        <div className="flex items-center">
                          <span className="mr-2 text-black">Rs {payment.amount.toFixed(2)}</span>
                          <button
                            onClick={() => handleRemovePaymentMethod(payment.method)}
                            className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>


            {selectedCustomer && (
              <div className="mb-6 p-4 bg-soft rounded-lg">
                <h3 className="text-lg font-semibold text-secondary mb-2">Selected Customer</h3>
                <div className="text-black">
                  <p><strong>Name:</strong> {selectedCustomer.firstname} {selectedCustomer.lastname}</p>
                  <p><strong>Mobile:</strong> {selectedCustomer.mobile}</p>
                  <p><strong>Email:</strong> {selectedCustomer.email}</p>
                  <p><strong>Total Credit History:</strong> Rs {selectedCustomer.totalcredit || 0}</p>
                  <p><strong>Balance Credit:</strong> Rs {selectedCustomer.balancecredit || 0}</p>
                </div>
                <button
                  className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => setSelectedCustomer(null)}
                >
                  Clear Customer
                </button>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-lg text-black">Subtotal</span>
                <span className="text-lg text-black">Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg text-black">Discount</span>
                <span className="text-lg text-black">- Rs {discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-xl text-black">Total</span>
                <span className="text-xl text-black">Rs {finalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg text-black">Paid Amount</span>
                <span className="text-lg text-black">Rs {paidAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-xl text-black">Remaining</span>
                <span className="text-xl text-black">Rs {remainingAmount.toFixed(2)}</span>
              </div>
            </div>

            <Button text="Confirm Order" type="button" onClick={handleConfirmOrder} />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-black text-white px-4 py-4 rounded-lg shadow-md hover:bg-accent-dark transition-colors duration-300">
        <Link
          href={"/dashboard/products/all"}
          className="flex items-start"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Go To Dashboard
        </Link>
      </div>

      {
        showCustomerSearch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-center text-black">Search Customer</h2>
              <div className="mb-4">
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center text-sm text-black">
                    <input
                      type="radio"
                      name="searchType"
                      value="mobile"
                      checked={searchType === "mobile"}
                      onChange={() => setSearchType("mobile")}
                      className="mr-2"
                    />
                    Mobile
                  </label>
                  <label className="flex items-center text-sm text-black">
                    <input
                      type="radio"
                      name="searchType"
                      value="email"
                      checked={searchType === "email"}
                      onChange={() => setSearchType("email")}
                      className="mr-2"
                    />
                    Email
                  </label>
                </div>
                <Input
                  label={`Search by ${searchType}`}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={`Enter customer ${searchType}`}
                />
                <div className="flex justify-end mt-2">
                  <button
                    className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-dark"
                    onClick={handleSearchCustomer}
                    disabled={isSearching}
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>
              {customerSearchError && (
                <div className="text-red-500 mb-4">{customerSearchError}</div>
              )}
              {customerSearchResults.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 text-black">Search Results</h3>
                  <div className="max-h-64 overflow-y-auto">
                    {customerSearchResults.map((customer) => (
                      <div
                        key={customer.id}
                        className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectCustomer(customer)}
                      >
                        <p className="font-medium text-black">{customer.firstname} {customer.lastname}</p>
                        <p className="text-sm text-gray-600">Mobile: {customer.mobile}</p>
                        <p className="text-sm text-gray-600">Email: {customer.email}</p>
                        {customer.balancecredit !== null && (
                          <p className="text-sm text-gray-600">Balance Credit: Rs {customer.balancecredit}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      }

      <NumericKeyboardModal
        value={modalMode === "discount" ? discountValue : currentPaymentAmount}
        isVisible={isModalVisible || isPaymentModalVisible}
        onClose={handleCloseModal}
        onKeyPress={handleKeyPress}
        onSubmit={handleSubmit}
        title={modalMode === "discount"
          ? `Enter ${discountType === "amount" ? "Discount Amount" : "Discount Percentage"}`
          : `Enter ${currentPaymentMethod} Amount`
        }
      />

      {isBillModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">Order Summary</h2>
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-black">Products:</h3>
              {selectedProducts.map((item, index) => (
                <div key={index} className="flex justify-between mb-1">
                  <span className="text-black">{item.product.name} x{item.quantity}</span>
                  <span className="text-black">Rs {(item.product.sellingprice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <div className="flex justify-between">
                <span className="text-black">Subtotal</span>
                <span className="text-black">Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Discount ({discountType === "percentage" ? `${discountValue}%` : `Rs ${discountValue}`})</span>
                <span className="text-black">- Rs {discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-black">Total</span>
                <span className="text-black">Rs {finalAmount.toFixed(2)}</span>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-black">Payment Methods:</h3>
              {paymentMethods.map((payment, index) => (
                <div key={index} className="flex justify-between mb-1">
                  <span className="capitalize text-black">{payment.method}</span>
                  <span className="text-black">Rs {payment.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between space-x-4">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 w-1/2"
                onClick={handleCloseBillModal}
              >
                Close
              </button>
              <button
                className={`${isProcessing ? 'bg-gray-400' : 'bg-accent hover:bg-accent-dark'} text-white px-4 py-2 rounded-lg w-1/2`}
                onClick={handleCompletePurchase}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Complete Purchase'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default POSSystem;