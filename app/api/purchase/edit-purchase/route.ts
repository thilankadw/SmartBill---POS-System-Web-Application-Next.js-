import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import {  updateDoc, doc, getDoc } from 'firebase/firestore';

export async function PUT(req: NextRequest) {
    try {
        const shopId = req.nextUrl.searchParams.get('shopId');
        const { orderId, status } = await req.json();

        console.log(orderId)
        console.log(status)

        if (!shopId || !orderId) return NextResponse.json(
            { success: false, message: 'Shop ID and Order ID required' },
            { status: 400 }
        );

        const orderRef = doc(db, 'shops', shopId, 'orders', orderId);

        if (status === 'completed') {
            const orderSnap = await getDoc(orderRef);
            const orderData = orderSnap.data();

            for (const product of orderData?.products || []) {
                const productRef = doc(db, 'shops', shopId, 'products', product.productid);
                const productSnap = await getDoc(productRef);

                if (productSnap.exists()) {
                    await updateDoc(productRef, {
                        stock: (productSnap.data().stock || 0) + product.purchaseStock,
                        purchaseprice: product.purchasePrice
                    });
                }
            }
        }

        await updateDoc(orderRef, {
            status,
            updatedAt: new Date().toISOString()
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Status update failed:", error);
        return NextResponse.json({ success: false, message: 'Status update failed' }, { status: 500 });
    }
}