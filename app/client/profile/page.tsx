"use client";
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/store/authStore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function ProfileScreen() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user) as UserData | null;
  const logout = useAuthStore((state) => state.logout);

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    shopName: '',
    address: '',
    phoneNumber: '',
    businessType: '',
    avatar: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        username: user?.username || '',
        email: user?.email || '',
        shopName: user?.shopName || '',
        address: user?.address || '',
        phoneNumber: user?.phoneNumber || '',
        businessType: user?.businessType || '',
        avatar: user?.avatar || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const idToken = user?.token;

      if (!idToken) {
        console.error("No token available.");
        return;
      }

      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          username: userData.username,
          shopName: userData.shopName,
          address: userData.address,
          phoneNumber: userData.phoneNumber,
          businessType: userData.businessType,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Profile update failed:", result.message);
        return;
      }

      console.log("Profile updated successfully:", result.data);

      // ✅ Update the local Zustand auth store
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().login({
          ...currentUser,
          ...result.data, // Merge updated profile data
          token: idToken, // Preserve the token
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };


  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      router.push('/client/home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="bg-background py-8 px-2">
      <div className="max-w-4xl mx-auto">
        <div className="container mx-auto text-center mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-black">
          Profile Settings
        </h1>
      </div>
        <form className="space-y-6">
          <div className="bg-soft/30 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-primary mb-4">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 text-black">
                  Username
                </label>
                <input
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-lg border border-highlight bg-background focus:ring-2 focus:ring-accent text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 text-black">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={userData.email}
                  disabled
                  className="w-full p-3 rounded-lg border border-highlight bg-gray-100 cursor-not-allowed text-black"
                />
              </div>
            </div>
          </div>

          <div className="bg-soft/30 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-primary mb-4">Business Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <InputField label="Shop Name" name="shopName" value={userData.shopName} isEditing={isEditing} onChange={handleInputChange} />
              <SelectField label="Business Type" name="businessType" value={userData.businessType} isEditing={isEditing} onChange={handleInputChange} />
              <InputField label="Address" name="address" value={userData.address} isEditing={isEditing} onChange={handleInputChange} />
              <InputField label="Phone Number" name="phoneNumber" value={userData.phoneNumber} isEditing={isEditing} onChange={handleInputChange} />
            </div>
          </div>

          <div className="flex justify-between gap-4 mt-8">
            <button
              type="button"
              onClick={handleLogout}
              className="px-6 py-2 rounded-lg border border-black text-black hover:bg-gray-100"
            >
              Logout
            </button>
            {isEditing ? (
              <>
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-lg border border-danger text-danger hover:bg-danger/10">
                  Cancel
                </button>
                <button onClick={handleSaveProfile} type="submit" className="px-6 py-2 rounded-lg bg-accent text-white hover:bg-accent/90">
                  Save Changes
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setIsEditing(true)} className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90">
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, name, value, isEditing, onChange }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2 text-black">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        disabled={!isEditing}
        className="w-full p-3 rounded-lg border border-highlight bg-background text-black"
      />
    </div>
  );
}

function SelectField({ label, name, value, isEditing, onChange }: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2 text-black">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={!isEditing}
        className="w-full p-3 rounded-lg border border-highlight bg-background text-black"
      >
        <option value="">Select Business Type</option>
        <option value="retail">Retail</option>
        <option value="wholesale">Wholesale</option>
        <option value="service">Service</option>
      </select>
    </div>
  );
}