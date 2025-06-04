import { NextRequest, NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { auth } from "@/firebase";

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

export async function PUT(req: NextRequest) {
    try {
        const authorization = req.headers.get('authorization');

        if (!authorization || !authorization.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: "No token provided." },
                { status: 401 }
            );
        }

        const idToken = authorization.split('Bearer ')[1];
        const adminAuth = getAuth();
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const { uid, email } = decodedToken;

        if (!email) {
            return NextResponse.json(
                { success: false, message: "User email is missing from the token." },
                { status: 400 }
            );
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { success: false, message: "Current password and new password are required." },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { success: false, message: "New password must be at least 6 characters long." },
                { status: 400 }
            );
        }

        try {
            await signInWithEmailAndPassword(auth, email, currentPassword);

            await adminAuth.updateUser(uid, { password: newPassword });

            return NextResponse.json(
                { success: true, message: "Password changed successfully." },
                { status: 200 }
            );
        } catch (authError) {
            console.error("Authentication error:", authError);

            if (authError instanceof FirebaseError) {
                switch (authError.code) {
                    case 'auth/wrong-password':
                    case 'auth/invalid-credential':
                        return NextResponse.json(
                            { success: false, message: "Current password is incorrect." },
                            { status: 400 }
                        );
                    default:
                        return NextResponse.json(
                            { success: false, message: "Authentication failed." },
                            { status: 400 }
                        );
                }
            }

            if (authError instanceof Error && 'code' in authError) {
                const code = (authError as { code: string }).code;
                if (code === 'auth/invalid-password') {
                    return NextResponse.json(
                        { success: false, message: "New password doesn't meet requirements." },
                        { status: 400 }
                    );
                }
            }

            throw authError;
        }
    } catch (error) {
        console.error("Error changing password:", error);

        if (error instanceof Error && 'code' in error) {
            const code = (error as { code: string }).code;
            if (code === 'auth/id-token-expired') {
                return NextResponse.json(
                    { success: false, message: "Session expired. Please sign in again." },
                    { status: 401 }
                );
            }
        }

        return NextResponse.json(
            { success: false, message: "Failed to change password." },
            { status: 500 }
        );
    }
}