import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const shopId = searchParams.get('shopId');
        
        if (!id || !shopId) {
            return NextResponse.json(
                { success: false, message: 'Supplier ID and Shop ID are required' },
                { status: 400 }
            );
        }

        const supplierRef = doc(db, `shops/${shopId}/suppliers`, id);
        await deleteDoc(supplierRef);
        
        return NextResponse.json(
            { success: true, message: 'Supplier deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error("Delete supplier error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete supplier' },
            { status: 500 }
        );
    }
}