import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, addDoc, updateDoc, collection, getDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    try {
        const requestBody = await req.json();
        const { suppliername, mobile, email, credit, status, supplierId, shopId } = requestBody;

        if (!suppliername || !mobile || !email || !shopId) {
            return NextResponse.json(
                { success: false, message: 'Required fields are missing.' },
                { status: 400 }
            );
        }

        if (supplierId) {
            const supplierRef = doc(db, `shops/${shopId}/suppliers`, supplierId);
            const supplierSnap = await getDoc(supplierRef);
            
            if (!supplierSnap.exists()) {
                return NextResponse.json(
                    { success: false, message: 'Supplier not found.' },
                    { status: 404 }
                );
            }

            await updateDoc(supplierRef, {
                suppliername,
                mobile,
                email,
                credit: credit || 0,
                status: status || 'active',
                updatedAt: new Date(),
            });

            return NextResponse.json(
                { success: true, message: 'Supplier updated successfully', id: supplierId },
                { status: 200 }
            );
        } else {
            const supplierRef = await addDoc(collection(db, `shops/${shopId}/suppliers`), {
                suppliername,
                mobile,
                email,
                credit: credit || 0,
                status: status || 'active',
                updatedAt: new Date(),
            });

            return NextResponse.json(
                { 
                    success: true, 
                    message: 'Supplier added successfully', 
                    id: supplierRef.id 
                },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to process supplier' },
            { status: 500 }
        );
    }
}