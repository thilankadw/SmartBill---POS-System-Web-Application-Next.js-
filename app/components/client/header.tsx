import { useAuthStore } from "@/app/store/authStore";
import Link from "next/link";

const Header = () => {
  const { user } = useAuthStore();
  return (
    <header className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">SMART BILL</h1>
        <nav className="space-x-6">
          <Link href="home" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="packages" className="hover:text-gray-300">
            Packages
          </Link>
          <Link href="privacy-policy" className="hover:text-gray-300">
            Privacy Policy
          </Link>
          {!user ? (
            <Link href="sign-in" className="hover:text-gray-300">
              Sign in
            </Link>
          ) : (
            <Link href="profile" className="hover:text-gray-300">
              Profile
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
