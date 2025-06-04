import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('id');
        const shopId = searchParams.get('shopId');

        if (!productId || !shopId) {
            return NextResponse.json(
                { success: false, message: 'Product ID and Shop ID are required' },
                { status: 400 }
            );
        }

        const productRef = doc(db, `shops/${shopId}/products`, productId);

        await deleteDoc(productRef);

        return NextResponse.json(
            { 
                success: true, 
                message: 'Product deleted successfully.' 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete product.' },
            { status: 500 }
        );
    }
}