import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function PUT(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const shopId = searchParams.get('shopId');
        const customerId = searchParams.get('customerId');
        const { credit } = await req.json();

        if (!shopId || !customerId) {
            return NextResponse.json(
                { success: false, message: 'Shop ID and Customer ID are required' },
                { status: 400 }
            );
        }

        if (typeof credit !== 'number' || credit < 0) {
            return NextResponse.json(
                { success: false, message: 'Valid total credit value is required' },
                { status: 400 }
            );
        }

        const customerRef = doc(db, `shops/${shopId}/customers`, customerId);
        const customerDoc = await getDoc(customerRef);

        if (!customerDoc.exists()) {
            return NextResponse.json(
                { success: false, message: 'Customer not found' },
                { status: 404 }
            );
        }

        const customerData = customerDoc.data();
        const currentBalance = customerData.balancecredit || 0;
        const currentTotal = customerData.totalcredit || 0;

        const newBalance = currentBalance + credit;
        const newTotal = currentTotal + credit;

        await updateDoc(customerRef, {
            balancecredit: newBalance,
            totalcredit: newTotal,
            updatedAt: serverTimestamp()
        });

        const updatedDoc = await getDoc(customerRef);
        const updatedData = updatedDoc.data();

        return NextResponse.json(
            {
                success: true,
                message: 'Credit score updated successfully',
                customer: {
                    ...updatedData,
                    id: updatedDoc.id,
                    updatedAt: updatedData?.updatedAt?.toDate()
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error updating credit score:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update credit score' },
            { status: 500 }
        );
    }
}