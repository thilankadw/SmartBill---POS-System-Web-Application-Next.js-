import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const shopId = searchParams.get('shopId');
        const searchType = searchParams.get('searchType');
        const searchValue = searchParams.get('searchValue');

        if (!shopId) {
            return NextResponse.json({ success: false, message: 'Shop ID is required' }, { status: 400 });
        }

        if (!searchType || !searchValue) {
            return NextResponse.json({ success: false, message: 'Search type and value are required' }, { status: 400 });
        }

        const customersRef = collection(db, `shops/${shopId}/customers`);
        let q;

        if (searchType === 'mobile') {
            q = query(customersRef, where('mobile', '==', searchValue));
        } else if (searchType === 'email') {
            q = query(customersRef, where('email', '==', searchValue));
        } else {
            return NextResponse.json({ success: false, message: 'Invalid search type' }, { status: 400 });
        }

        const querySnapshot = await getDocs(q);
        const customers: Customer[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            customers.push({
                id: doc.id,
                firstname: data.firstname || '',
                lastname: data.lastname || '',
                mobile: data.mobile || '',
                email: data.email || '',
                totalcredit: data.totalcredit ?? null,
                balancecredit: data.balancecredit ?? null,
                updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
                status: data.status || 'inactive'
            });
        });

        return NextResponse.json({ success: true, customers }, { status: 200 });

    } catch (error) {
        console.error('Error searching customers:', error);
        return NextResponse.json({ success: false, message: 'Failed to search customers' }, { status: 500 });
    }
}
