import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    const shopId = searchParams.get('shopId');

    if (!customerId) {
      return NextResponse.json(
        { success: false, message: 'Customer ID is required' },
        { status: 400 }
      );
    }

    if (!shopId) {
      return NextResponse.json(
        { success: false, message: 'Shop ID is required' },
        { status: 400 }
      );
    }

    const customerRef = doc(db, `shops/${shopId}/customers`, customerId);
    const customerDoc = await getDoc(customerRef);
    
    if (!customerDoc.exists()) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }
    
    const customerData = customerDoc.data();
    
    return NextResponse.json({
      success: true,
      creditDetails: {
        name: customerData.name,
        totalCredit: customerData.totalCreditHistory || 0,
        balanceCredit: customerData.creditBalance || 0
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error getting customer credit:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get customer credit details' },
      { status: 500 }
    );
  }
}