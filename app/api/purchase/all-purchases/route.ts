import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

interface SupplierOrder {
    id: string;
    supplierid: string;
    purchaseDate: Date;
    products: Array<{
        productid: string;
        purchasePrice: number;
        purchaseStock: number;
    }>;
    paymentmethod: string;
    advancedpayment: number;
    totalamount: number;
    duepayment: number;
    status: string;
}

export async function GET(req: NextRequest) {
    try {
        const shopId = req.nextUrl.searchParams.get('shopId');
        if (!shopId) return NextResponse.json({ success: false, message: 'Shop ID required' }, { status: 400 });

        const ordersQuery = query(collection(db, `shops/${shopId}/orders`));
        const ordersSnapshot = await getDocs(ordersQuery);

        const orders: SupplierOrder[] = ordersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                supplierid: data.supplierid,
                purchaseDate: data.purchaseDate,
                products: data.products,
                paymentmethod: data.paymentmethod,
                advancedpayment: data.advancedpayment,
                totalamount: data.totalamount,
                duepayment: data.duepayment,
                status: data.status
            };
        });

        console.log(orders);

        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: 500 });
    }
}