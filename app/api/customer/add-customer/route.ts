import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, addDoc, updateDoc, collection, getDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    try {
        const { 
            firstname, 
            lastname, 
            mobile, 
            email, 
            totalcredit, 
            balancecredit, 
            status,
            id,
            shopId 
        } = await req.json();

        if (!firstname || !lastname || !mobile || !email) {
            return NextResponse.json(
                { success: false, message: 'Required fields are missing.' },
                { status: 400 }
            );
        }

        if (firstname.trim().length < 2 || lastname.trim().length < 2) {
            return NextResponse.json(
                { success: false, message: 'Names must be at least 2 characters.' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return NextResponse.json(
                { success: false, message: 'Invalid email format.' },
                { status: 400 }
            );
        }

        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile.trim())) {
            return NextResponse.json(
                { success: false, message: 'Invalid mobile number.' },
                { status: 400 }
            );
        }

        if (id) {
            const customerRef = doc(db, `shops/${shopId}/customers`, id);
            const customerSnap = await getDoc(customerRef);
            if (!customerSnap.exists()) {
                return NextResponse.json(
                    { success: false, message: 'Customer not found.' },
                    { status: 404 }
                );
            }

            await updateDoc(customerRef, {
                firstname: firstname.trim(),
                lastname: lastname.trim(),
                mobile: mobile.trim(),
                email: email.trim(),
                totalcredit: typeof totalcredit === 'number' ? totalcredit : null,
                balancecredit: typeof balancecredit === 'number' ? balancecredit : null,
                status: status || 'active',
                updatedAt: new Date()
            });

            return NextResponse.json(
                { success: true, message: 'Customer updated successfully.', customerId: id },
                { status: 200 }
            );
        } else {
            const customersRef = collection(db, `shops/${shopId}/customers`);
            const newCustomerRef = await addDoc(customersRef, {
                firstname: firstname.trim(),
                lastname: lastname.trim(),
                mobile: mobile.trim(),
                email: email.trim(),
                totalcredit: typeof totalcredit === 'number' ? totalcredit : null,
                balancecredit: typeof balancecredit === 'number' ? balancecredit : null,
                status: status || 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            return NextResponse.json(
                { 
                    success: true, 
                    message: 'Customer added successfully.', 
                    customerId: newCustomerRef.id 
                },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error("Error in customer operation:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to process customer.' },
            { status: 500 }
        );
    }
}