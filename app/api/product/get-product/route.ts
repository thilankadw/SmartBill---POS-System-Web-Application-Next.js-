import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(req: NextRequest) {
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
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        const productData = productSnap.data();
        
        return NextResponse.json(
            { 
                success: true,
                product: {
                    id: productSnap.id,
                    name: productData.name || '',
                    stock: productData.stock || 0,
                    sellingprice: productData.sellingprice || 0,
                    purchaseprice: productData.purchaseprice || 0,
                    category: productData.category || '',
                    brand: productData.brand || '',
                    imagepath: productData.imagepath || null,
                    status: productData.status || 'active',
                    createdAt: productData.createdAt?.toDate() || new Date(),
                    updatedAt: productData.updatedAt?.toDate() || new Date()
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch product.' },
            { status: 500 }
        );
    }
}