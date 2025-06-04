"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/button";
import Link from "next/link";
import LoginInput from "@/app/components/logininput";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      router.push("/client/home"); 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-soft px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-primary text-center mb-6">Sign Up</h2>
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <LoginInput
            label="Full Name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <LoginInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <LoginInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <LoginInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />

          {error && (
            <p className="text-danger text-sm text-center font-medium">{error}</p>
          )}

          <Button
            text={loading ? "Creating Account..." : "Sign Up"}
            type="submit"
            disabled={loading}
          />
        </form>
        <p className="mt-6 text-sm text-center text-secondary">
          Already have an account?{" "}
          <Link href="/client/sign-in" className="text-accent hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
