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

        const productSnapshot = await getDocs(collection(db, `shops/${shopId}/products`));
        
        const products: Product[] = productSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || '',
                stock: data.stock || 0,
                sellingprice: data.sellingprice || 0,
                purchaseprice: data.purchaseprice || 0,
                category: data.category || '',
                brand: data.brand || '',
                imagepath: data.imagepath || null,
                status: data.status || 'active',
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date()
            };
        });

        return NextResponse.json(
            { 
                success: true, 
                message: 'Products retrieved successfully.', 
                products 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to retrieve products.' },
            { status: 500 }
        );
    }
}