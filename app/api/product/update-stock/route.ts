import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export const PUT = async(req: NextRequest) => {
    try {
        const { id: productId, stock, shopId } = await req.json();

        if (!productId || stock === undefined || stock === null || !shopId) {
            return NextResponse.json(
                { success: false, message: 'Required fields are missing.' },
                { status: 400 }
            );
        }

        if (stock < 0) {
            return NextResponse.json(
                { success: false, message: 'Stock cannot be negative.' },
                { status: 400 }
            );
        }

        const productRef = doc(db, `shops/${shopId}/products`, productId);
        const productSnap = await getDoc(productRef);
        
        if (!productSnap.exists()) {
            return NextResponse.json(
                { success: false, message: 'Product not found.' },
                { status: 404 }
            );
        }

        await updateDoc(productRef, {
            stock: Number(stock),
            updatedAt: new Date()
        });

        return NextResponse.json(
            { success: true, message: 'Product stock updated successfully.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating product stock:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update product stock.' },
            { status: 500 }
        );
    }
}