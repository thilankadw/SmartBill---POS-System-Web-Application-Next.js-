import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, addDoc, updateDoc, collection, getDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    try {
        const { name, description, shopId, categoryId } = await req.json();

        if (!name || !description || !shopId) {
            return NextResponse.json(
                { success: false, message: 'Required fields (name, description, shopId) are missing.' },
                { status: 400 }
            );
        }

        if (name.trim().length < 3) {
            return NextResponse.json(
                { success: false, message: 'Category name must be at least 3 characters long.' },
                { status: 400 }
            );
        }

        if (categoryId) {
            const categoryRef = doc(db, `shops/${shopId}/categories`, categoryId);
            
            const categorySnap = await getDoc(categoryRef);
            if (!categorySnap.exists()) {
                return NextResponse.json(
                    { success: false, message: 'Category not found.' },
                    { status: 404 }
                );
            }

            await updateDoc(categoryRef, {
                name: name.trim(),
                description: description.trim(),
                updatedAt: new Date()
            });

            return NextResponse.json(
                { success: true, message: 'Category updated successfully.', categoryId },
                { status: 200 }
            );
        } else {
            const categoriesRef = collection(db, `shops/${shopId}/categories`);
            
            const newCategoryRef = await addDoc(categoriesRef, {
                name: name.trim(),
                description: description.trim(),
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            return NextResponse.json(
                { 
                    success: true, 
                    message: 'Category added successfully.', 
                    categoryId: newCategoryRef.id 
                },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error("Error in category operation:", error);

        return NextResponse.json(
            { success: false, message: 'Failed to process category.' },
            { status: 500 }
        );
    }
}