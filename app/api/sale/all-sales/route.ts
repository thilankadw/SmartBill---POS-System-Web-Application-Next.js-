import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const shopId = searchParams.get('shopId');

        if (!shopId) {
            return NextResponse.json(
                { success: false, message: 'Shop ID is required' },
                { status: 400 }
            );
        }

        const salesSnapshot = await getDocs(collection(db, `shops/${shopId}/sales`));
        
        const sales: Sale[] = salesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                shopId: data.shopId,
                customerId: data.customerId || null,
                purchaseDate: data.purchaseDate?.toDate() || new Date(),
                products: data.products || [],
                paymentMethods: data.paymentMethods || [],
                subtotal: data.subtotal,
                discountType: data.discountType,
                discountValue: data.discountValue,
                discountAmount: data.discountAmount,
                totalAmount: data.totalAmount,
                status: data.status || 'completed',
                createdAt: data.createdAt?.toDate() || new Date()
            };
        });

        return NextResponse.json(
            { 
                success: true, 
                message: 'Sales retrieved successfully.', 
                sales 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to retrieve sales.' },
            { status: 500 }
        );
    }
}