import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(req: NextRequest) {
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
        const categorySnap = await getDoc(categoryRef);

        if (!categorySnap.exists()) {
            return NextResponse.json(
                { success: false, message: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { 
                success: true, 
                category: {
                    id: categorySnap.id,
                    ...categorySnap.data()
                } 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch category.' },
            { status: 500 }
        );
    }
}