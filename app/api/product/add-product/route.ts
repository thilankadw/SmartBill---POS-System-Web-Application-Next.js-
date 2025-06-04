import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, addDoc, updateDoc, collection, getDoc } from 'firebase/firestore';

export const POST = async (req: NextRequest) => {
    try {
        const { 
            name, 
            stock, 
            sellingprice, 
            purchaseprice, 
            category, 
            brand, 
            imagepath, 
            status, 
            id: productId,
            shopId
        } = await req.json();

        if (!name || !stock || !sellingprice || !purchaseprice || !category || !brand || !shopId) {
            return NextResponse.json(
                { success: false, message: 'Required fields are missing.' },
                { status: 400 }
            );
        }

        if (stock < 0 || sellingprice < 0 || purchaseprice < 0) {
            return NextResponse.json(
                { success: false, message: 'Numerical values cannot be negative.' },
                { status: 400 }
            );
        }

        if (productId) {
            const productRef = doc(db, `shops/${shopId}/products`, productId);
            const productSnap = await getDoc(productRef);
            
            if (!productSnap.exists()) {
                return NextResponse.json(
                    { success: false, message: 'Product not found.' },
                    { status: 404 }
                );
            }

            await updateDoc(productRef, {
                name: name.trim(),
                stock: Number(stock),
                sellingprice: Number(sellingprice),
                purchaseprice: Number(purchaseprice),
                category,
                brand,
                imagepath: imagepath || null,
                status: status || 'active',
                updatedAt: new Date()
            });

            return NextResponse.json(
                { success: true, message: 'Product updated successfully.', productId },
                { status: 200 }
            );
        } else {
            const productsRef = collection(db, `shops/${shopId}/products`);
            const newProductRef = await addDoc(productsRef, {
                name: name.trim(),
                stock: Number(stock),
                sellingprice: Number(sellingprice),
                purchaseprice: Number(purchaseprice),
                category,
                brand,
                imagepath: imagepath || null,
                status: status || 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            return NextResponse.json(
                { 
                    success: true, 
                    message: 'Product added successfully', 
                    productId: newProductRef.id 
                },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to process product' },
            { status: 500 }
        );
    }
};