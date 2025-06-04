import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const customerId = searchParams.get('id');
        const shopId = searchParams.get('shopId');

        if (!customerId || !shopId) {
            return NextResponse.json(
                { success: false, message: 'Missing required parameters' },
                { status: 400 }
            );
        }

        const customerRef = doc(db, `shops/${shopId}/customers`, customerId);
        const customerSnap = await getDoc(customerRef);

        if (!customerSnap.exists()) {
            return NextResponse.json(
                { success: false, message: 'Customer not found.' },
                { status: 404 }
            );
        }

        const customerData = customerSnap.data();

        const result = {
            id: customerSnap.id,
            firstname: customerData.firstname || '',
            lastname: customerData.lastname || '',
            mobile: customerData.mobile || '',
            email: customerData.email || '',
            totalcredit: customerData.totalcredit || null,
            balancecredit: customerData.balancecredit || null,
            updatedAt: customerData.updatedAt?.toDate() || null,
            status: customerData.status || 'active',
        };

        return NextResponse.json(
            { success: true, message: 'Customer data retrieved successfully', customer: result },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to retrieve customer data.' },
            { status: 500 }
        );
    }
}