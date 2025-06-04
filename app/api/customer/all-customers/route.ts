import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore';

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

        const customerSnapshot: QuerySnapshot<DocumentData> = await getDocs(collection(db, `shops/${shopId}/customers`));

        const customers: Customer[] = customerSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                firstname: data.firstname || '',
                lastname: data.lastname || '',
                mobile: data.mobile || '',
                email: data.email || '',
                totalcredit: data.totalcredit || null,
                balancecredit: data.balancecredit || null,
                updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
                status: data.status || 'active',
            };
        });

        return NextResponse.json(
            { success: true, message: 'Customers retrieved successfully.', customers },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to retrieve customers.' },
            { status: 500 }
        );
    }
}
