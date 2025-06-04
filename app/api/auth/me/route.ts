import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function GET(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: "No token provided." },
        { status: 401 }
      );
    }

    const idToken = authorization.split('Bearer ')[1];

    // Verify the Firebase ID token
    const adminAuth = getAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Get user data from Firestore
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { success: false, message: "User data not found." },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    return NextResponse.json(
      {
        success: true,
        email: userData.email,
        username: userData.username,
        uid: uid,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting user data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get user data." },
      { status: 500 }
    );
  }
}