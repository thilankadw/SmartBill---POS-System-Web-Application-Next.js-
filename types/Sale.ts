interface Sale {
  id: string;
  shopId: string;
  customerId?: string; 
  customerName?: string;
  purchaseDate: Date;
  products: Array<{
    productId: string;
    name: string;
    purchasePrice: number;
    quantity: number;
  }>;
  paymentMethods: Array<{
    method: string; 
    amount: number;
  }>;
  subtotal: number;
  discountType: "amount" | "percentage";
  discountValue: number;
  discountAmount: number;
  totalAmount: number;
  status: "paid" | "ongoing_payment";
  createdAt: Date;
}