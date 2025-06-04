import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app"; 
import { auth, db } from "@/firebase";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Required fields are missing." },
        { status: 400 }
      );
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = doc(db, "users", user.uid);
    await setDoc(userDoc, {
      username,
      email,
      createdAt: new Date(),
      uid: user.uid, 
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "User registered successfully.",
        uid: user.uid 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error:", error instanceof Error ? error.message : error);

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          return NextResponse.json(
            { success: false, message: "Email is already registered." },
            { status: 400 }
          );
        case 'auth/weak-password':
          return NextResponse.json(
            { success: false, message: "Password should be at least 6 characters." },
            { status: 400 }
          );
        case 'auth/invalid-email':
          return NextResponse.json(
            { success: false, message: "Invalid email address." },
            { status: 400 }
          );
        default:
          return NextResponse.json(
            { success: false, message: "Authentication failed." },
            { status: 400 }
          );
      }
    }

    return NextResponse.json(
      { success: false, message: "Failed to register user." },
      { status: 500 }
    );
  }
}