import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const customerId = searchParams.get('id');
        const shopId = searchParams.get('shopId');

        if (!customerId || !shopId) {
            return NextResponse.json(
                { success: false, message: 'Customer ID and Shop ID are required' },
                { status: 400 }
            );
        }

        const customerRef = doc(db, `shops/${shopId}/customers`, customerId);

        await deleteDoc(customerRef);

        return NextResponse.json(
            { 
                success: true, 
                message: 'Customer deleted successfully.' 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete customer.' },
            { status: 500 }
        );
    }
}