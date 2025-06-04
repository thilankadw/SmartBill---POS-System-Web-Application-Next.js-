import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, addDoc, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, message: 'Method not allowed' }, { status: 405 });
  }

  try {
    const {
      shopId,
      customerId,
      products,
      subtotal,
      discountType,
      discountValue,
      discountAmount,
      totalAmount,
      paymentMethods,
    } = await req.json();

    if (!shopId) {
      return NextResponse.json({ success: false, message: 'Shop ID is required' }, { status: 400 });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ success: false, message: 'Valid products are required' }, { status: 400 });
    }

    if (!paymentMethods || !Array.isArray(paymentMethods) || paymentMethods.length === 0) {
      return NextResponse.json({ success: false, message: 'Valid payment methods are required' }, { status: 400 });
    }

    const creditPayment = paymentMethods.find(method => method.method === 'credit');
    const hasCreditPayment = !!creditPayment && creditPayment.amount > 0;

    if (hasCreditPayment && !customerId) {
      return NextResponse.json({ success: false, message: 'Customer ID is required for credit payments' }, { status: 400 });
    }

    const status = hasCreditPayment ? 'ongoing_payment' : 'paid';

    const formattedProducts = products.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      purchasePrice: item.product.sellingprice,
      quantity: item.quantity
    }));

    const saleData = {
      shopId,
      customerId: customerId || null,
      purchaseDate: Timestamp.now(),
      products: formattedProducts,
      paymentMethods: paymentMethods.map(pm => ({ method: pm.method, amount: pm.amount })),
      subtotal,
      discountType,
      discountValue,
      discountAmount,
      totalAmount,
      status,
      createdAt: Timestamp.now()
    };

    const saleRef = await addDoc(collection(db, `shops/${shopId}/sales`), saleData);

    if (hasCreditPayment && customerId) {
      const customerRef = doc(db, 'customers', customerId);
      const customerDoc = await getDoc(customerRef);

      if (customerDoc.exists()) {
        const customerData = customerDoc.data();
        const currentCredit = customerData.creditBalance || 0;
        const creditAmount = creditPayment.amount;

        await updateDoc(customerRef, {
          creditBalance: currentCredit + creditAmount,
          totalCreditHistory: (customerData.totalCreditHistory || 0) + creditAmount
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Sale created successfully', saleId: saleRef.id }, { status: 200 });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json({ success: false, message: 'Failed to create sale' }, { status: 500 });
  }
}
