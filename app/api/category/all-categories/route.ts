import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

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

        const categorySnapshot = await getDocs(collection(db, `shops/${shopId}/categories`));
        
        const categories: Category[] = categorySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                description: data.description,
                imagepath: data.imagepath || null,
                status: data.status || 'active',
                createdAt: data.createdAt?.toDate() || new Date()
            };
        });

        return NextResponse.json(
            { 
                success: true, 
                message: 'Categories retrieved successfully.', 
                categories 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to retrieve categories.' },
            { status: 500 }
        );
    }
}