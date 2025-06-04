import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { FirebaseError } from "firebase/app"; 

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
    const uid = decodedToken.uid;

    const { username, shopName, address, phoneNumber, businessType } = await req.json();

    if (!username?.trim()) {
      return NextResponse.json(
        { success: false, message: "Username is required." },
        { status: 400 }
      );
    }

    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const updateData = {
      username: username.trim(),
      shopName: shopName?.trim() || "",
      address: address?.trim() || "",
      phoneNumber: phoneNumber?.trim() || "",
      businessType: businessType?.trim() || "",
      updatedAt: new Date(),
    };

    await updateDoc(userDocRef, updateData);

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully.",
        data: updateData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error instanceof Error ? error.message : error);

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/id-token-expired':
          return NextResponse.json(
            { success: false, message: "Session expired. Please sign in again." },
            { status: 401 }
          );
        default:
          return NextResponse.json(
            { success: false, message: "Authentication error occurred." },
            { status: 400 }
          );
      }
    }

    if (error instanceof Error && 'code' in error) {
      const firestoreError = error as { code: string };
      switch (firestoreError.code) {
        case 'permission-denied':
          return NextResponse.json(
            { success: false, message: "Permission denied." },
            { status: 403 }
          );
        case 'not-found':
          return NextResponse.json(
            { success: false, message: "Document not found." },
            { status: 404 }
          );
      }
    }

    return NextResponse.json(
      { success: false, message: "Failed to update profile." },
      { status: 500 }
    );
  }
}