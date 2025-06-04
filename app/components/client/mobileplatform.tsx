'use client'
import React, { useState, useEffect } from 'react';

const MobilePOSSection = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const phoneImages = [
    {
      id: 1,
      bgColor: 'bg-gradient-to-br from-blue-400 to-blue-600',
      title: 'Smart Bill',
      subtitle: 'Empower Your Potential',
      screen: (
        <div className="w-full h-full bg-white rounded-lg p-4 flex flex-col">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Quick Billing</h3>
            <p className="text-gray-600 text-sm">Process payments instantly</p>
          </div>
          <div className="space-y-3 flex-1">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Amount</span>
                <span className="text-lg font-bold text-blue-600">$127.50</span>
              </div>
            </div>
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium">
              Process Payment
            </button>
          </div>
        </div>
      )
    },
    {
      id: 2,
      bgColor: 'bg-gradient-to-br from-purple-400 to-purple-600',
      title: 'Inventory',
      subtitle: 'Manage Stock',
      screen: (
        <div className="w-full h-full bg-white rounded-lg p-4 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Inventory</h3>
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
          <div className="space-y-3 flex-1">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Coffee Beans</span>
                <span className="text-green-600 font-bold">156</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '78%'}}></div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Pastries</span>
                <span className="text-yellow-600 font-bold">23</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '35%'}}></div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Milk</span>
                <span className="text-red-600 font-bold">5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{width: '12%'}}></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      bgColor: 'bg-gradient-to-br from-green-400 to-green-600',
      title: 'Analytics',
      subtitle: 'Track Performance',
      screen: (
        <div className="w-full h-full bg-white rounded-lg p-4 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Today&apos;s Sales</h3>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">$1,247</div>
              <div className="text-sm text-gray-600">Revenue</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">89</div>
              <div className="text-sm text-gray-600">Orders</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="h-24 flex items-end justify-between space-x-2">
              <div className="bg-green-200 rounded-t w-8" style={{height: '60%'}}></div>
              <div className="bg-green-300 rounded-t w-8" style={{height: '80%'}}></div>
              <div className="bg-green-400 rounded-t w-8" style={{height: '90%'}}></div>
              <div className="bg-green-500 rounded-t w-8" style={{height: '100%'}}></div>
              <div className="bg-green-400 rounded-t w-8" style={{height: '75%'}}></div>
              <div className="bg-green-300 rounded-t w-8" style={{height: '65%'}}></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      bgColor: 'bg-gradient-to-br from-orange-400 to-orange-600',
      title: 'Customer',
      subtitle: 'Manage Relations',
      screen: (
        <div className="w-full h-full bg-white rounded-lg p-4 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Customers</h3>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-semibold">JD</span>
              </div>
              <div className="flex-1">
                <div className="font-medium">John Doe</div>
                <div className="text-sm text-gray-600">Regular Customer</div>
              </div>
              <div className="text-green-600 font-semibold">$234</div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-semibold">SM</span>
              </div>
              <div className="flex-1">
                <div className="font-medium">Sarah Miller</div>
                <div className="text-sm text-gray-600">VIP Customer</div>
              </div>
              <div className="text-green-600 font-semibold">$567</div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-semibold">MW</span>
              </div>
              <div className="flex-1">
                <div className="font-medium">Mike Wilson</div>
                <div className="text-sm text-gray-600">New Customer</div>
              </div>
              <div className="text-green-600 font-semibold">$89</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % phoneImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [phoneImages.length]);

  const currentPhone = phoneImages[currentImage];

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Mobile POS App
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Super quick to setup, easy to use mobile app for SME businesses 
                with a hassle free invoicing experience to empower you on the 
                go. Keep on running the business like a pro with just your 
                smartphone and portable mobile printer. PCs are no longer a must!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Business management that fits in your pocket</h3>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Super quick billing on the go</h3>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Portable and easy to use</h3>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Simple and affordable</h3>
                </div>
              </div>
            </div>

            {/* <div>
              <button className="bg-transparent border-2 border-blue-400 text-blue-500 px-8 py-3 rounded-full font-medium hover:bg-blue-50 transition-colors duration-300">
                More features
              </button>
            </div> */}
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="relative w-72 h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl">
                <div className={`w-full h-full rounded-[2.5rem] ${currentPhone.bgColor} p-6 transition-all duration-1000 ease-in-out transform`}>
                  <div className="flex justify-between items-center text-white text-sm mb-6">
                    <span>9:41</span>
                    <div className="flex space-x-1">
                      <div className="w-4 h-2 bg-white rounded-sm opacity-60"></div>
                      <div className="w-4 h-2 bg-white rounded-sm opacity-80"></div>
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                    </div>
                  </div>

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{currentPhone.title}</h3>
                    <p className="text-white opacity-90">{currentPhone.subtitle}</p>
                  </div>

                  <div className="flex-1 h-96">
                    {currentPhone.screen}
                  </div>
                </div>

                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-30"></div>
              </div>

              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 rounded-full animate-bounce opacity-60"></div>
              <div className="absolute -bottom-8 -left-8 w-6 h-6 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
              <div className="absolute top-1/2 -left-6 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-50"></div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12 space-x-3">
          {phoneImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImage 
                  ? 'bg-blue-500 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobilePOSSection;