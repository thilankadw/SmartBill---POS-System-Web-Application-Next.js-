import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

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

        const suppliersRef = collection(db, 'shops', shopId, 'suppliers');
        const q = query(suppliersRef);
        const supplierSnapshot = await getDocs(q);
        
        const suppliers = supplierSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date()
        }));

        return NextResponse.json(
            { success: true, suppliers },
            { status: 200 }
        );
    } catch (error) {
        console.error("Fetch suppliers error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to retrieve suppliers' },
            { status: 500 }
        );
    }
}