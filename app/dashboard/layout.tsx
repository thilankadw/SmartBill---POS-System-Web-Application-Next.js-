'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/app/store/authStore';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const router = useRouter();

  const { logout, isAuthenticated } = useAuthStore();

  const menulist = [
    {
      menu: 'Categories',
      submenu: [
        {
          submenu: 'All Categories',
          path: '/dashboard/categories/all',
        },
        {
          submenu: 'Add Categories',
          path: '/dashboard/categories/add',
        },
      ],
    },
    {
      menu: 'Products',
      submenu: [
        {
          submenu: 'All Products',
          path: '/dashboard/products/all',
        },
        {
          submenu: 'Add Products',
          path: '/dashboard/products/add',
        },
      ],
    },
    {
      menu: 'Customers',
      submenu: [
        {
          submenu: 'All Customer',
          path: '/dashboard/customers/all',
        },
        {
          submenu: 'Add Customer',
          path: '/dashboard/customers/add',
        },
      ],
    },
    {
      menu: 'Suppliers',
      submenu: [
        {
          submenu: 'All Suppliers',
          path: '/dashboard/suppliers/all',
        },
        {
          submenu: 'Add Suppliers',
          path: '/dashboard/suppliers/add',
        },
      ],
    },
    {
      menu: 'Purchase',
      submenu: [
        {
          submenu: 'All Purchases',
          path: '/dashboard/purchase/all',
        },
        {
          submenu: 'Add Purchase',
          path: '/dashboard/purchase/add',
        },
      ],
    },
    {
      menu: 'Sales',
      path: '/dashboard/sales',
    },
  ];

  const handleMenuClick = (index: number, path: string) => {
    router.push(path);
  };

  const handleMainMenuClick = (index: number, item: MenuItem) => {
    if (item.submenu) {
      toggleMenu(index);
    } else if (item.path) {
      router.push(item.path);
    }
  };

  const toggleMenu = (index: number) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleLogout = () => {
    logout();
    router.push('/client/home');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, router, logout]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col gap-8 bg-primary justify-center items-center h-screen">
        <p className='text-2xl'>Checking authentication...</p>
        <Link href={'/sign-in'} className="bg-black w-auto px-8 py-2 rounded-lg text-2xl text-white">
          LOGIN
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-center flex justify-center items-center">
      <div className="w-full h-screen bg-black flex items-center gap-4">
        <div className="min-h-screen bg-black p-4 flex flex-col gap-4 w-64">
          <div className="flex justify-start items-end w-full">
            <Link href={'/pos'} className="bg-primary w-full px-4 py-2 rounded-lg text-white">
              POS
            </Link>
          </div>
          <div className="flex justify-start items-end w-full">
            <button
              className="bg-primary w-full text-left px-4 py-2 rounded-lg text-white"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          {menulist.map((item, index) => (
            <div key={index} className="relative mb-4">
              <button
                className={`text-lg text-left px-4 py-2 rounded-lg cursor-pointer w-full 
                  ${openMenuIndex === index ? `bg-vividBlue text-white` : `hover:text-black hover:bg-gray-200`}`}
                onClick={() => handleMainMenuClick(index, item)}
              >
                {item.menu}
                {item.submenu && (
                  <span className="float-right">
                    {openMenuIndex === index ? '▼' : '►'}
                  </span>
                )}
              </button>
              {item.submenu && openMenuIndex === index && (
                <div className="mt-2 w-full rounded-lg">
                  {item.submenu?.map((subItem, subIndex) => (
                    <button
                      key={subIndex}
                      className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 hover:text-black rounded-lg"
                      onClick={() => handleMenuClick(index, subItem.path)}
                    >
                      {subItem.submenu}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="h-screen flex-1 bg-white">{children}</div>
      </div>
    </div>
  );
}