import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get('id');
        const shopId = searchParams.get('shopId');

        if (!categoryId || !shopId) {
            return NextResponse.json(
                { success: false, message: 'Category ID and Shop ID are required' },
                { status: 400 }
            );
        }

        const categoryRef = doc(db, `shops/${shopId}/categories`, categoryId);

        await deleteDoc(categoryRef);

        return NextResponse.json(
            { 
                success: true, 
                message: 'Category deleted successfully.' 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete category.' },
            { status: 500 }
        );
    }
}