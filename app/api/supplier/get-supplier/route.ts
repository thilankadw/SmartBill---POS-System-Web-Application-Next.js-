import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const supplierId = searchParams.get('id');
        const shopId = searchParams.get('shopId');

        if (!supplierId || !shopId) {
            return NextResponse.json(
                { success: false, message: 'Supplier ID and Shop ID are required' },
                { status: 400 }
            );
        }

        const supplierRef = doc(db, `shops/${shopId}/suppliers`, supplierId);
        const supplierSnap = await getDoc(supplierRef);

        if (!supplierSnap.exists()) {
            return NextResponse.json(
                { success: false, message: 'Supplier not found' },
                { status: 404 }
            );
        }

        const supplierData = supplierSnap.data();

        return NextResponse.json(
            { 
                success: true, 
                supplier: {
                    id: supplierSnap.id,
                    suppliername: supplierData.suppliername,
                    mobile: supplierData.mobile,
                    email: supplierData.email,
                    credit: supplierData.credit || 0,
                    status: supplierData.status || 'active',
                    updatedAt: supplierData.updatedAt?.toDate() || new Date()
                } 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching supplier:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch supplier.' },
            { status: 500 }
        );
    }
}