import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    try {
      const shopId = req.nextUrl.searchParams.get('shopId');
      const orderData = await req.json();
      
      if (!shopId) return NextResponse.json({ success: false, message: 'Shop ID required' }, { status: 400 });
  
      const docRef = await addDoc(collection(db, `shops/${shopId}/orders`), {
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
  
      return NextResponse.json({ success: true, message: 'Purchase added successfully.',  orderId: docRef.id });
    } catch (error) {
      console.error("Order creation failed:", error);
      return NextResponse.json({ success: false, message: 'Order creation failed' }, { status: 500 });
    }
  }