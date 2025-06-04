import React from 'react';

const packages: Package[] = [
  {
    title: 'Starter Plan',
    price: 'LKR 990/month',
    description: 'Ideal for small businesses and startups',
    features: [
      '1 User Account',
      'Mobile POS Access',
      'Sales & Invoice Management',
      'Basic Inventory Tracking',
      'Daily Backup',
      'Email Support',
    ],
    borderColor: 'border-smartbill-green',
    highlightText: '✅ Best for: Micro businesses, kiosks, food stalls',
    bestFor: 'text-smartbill-green',
    buttonColor: 'bg-smartbill-green',
  },
  {
    title: 'Standard Plan',
    price: 'LKR 1,990/month',
    description: 'Perfect for retail shops and service providers',
    features: [
      'Everything in Starter, plus:',
      '3 User Accounts',
      'Web POS Access',
      'Customer Management',
      'Sales & Expense Reports',
      'Discount & Return Handling',
      'Priority Support',
    ],
    borderColor: 'border-smartbill-blue',
    highlightText: '✅ Best for: Retail stores, salons, cafes',
    bestFor: 'text-smartbill-blue',
    buttonColor: 'bg-smartbill-blue',
  },
  {
    title: 'Business Plan',
    price: 'LKR 3,990/month',
    description: 'For growing businesses with more advanced needs',
    features: [
      'Everything in Standard, plus:',
      '5 User Accounts',
      'Multi-Device Sync',
      'Purchase Order Management',
      'Barcode Scanner Integration',
      'Product Variant Support',
    ],
    borderColor: 'border-smartbill-purple',
    highlightText: '✅ Best for: Boutiques, franchises, services',
    bestFor: 'text-smartbill-purple',
    buttonColor: 'bg-smartbill-purple',
  },
  {
    title: 'Enterprise Plan',
    price: 'Custom Pricing',
    description: 'Tailored solutions for large enterprises',
    features: [
      'Everything in Business, plus:',
      'Unlimited User Accounts',
      'Custom Integrations',
      'Dedicated Account Manager',
      'Priority Onboarding & Training',
      'Premium Support',
    ],
    borderColor: 'border-smartbill-yellow',
    highlightText: '✅ Best for: Large chains, enterprises',
    bestFor: 'text-smartbill-yellow',
    buttonColor: 'bg-smartbill-yellow',
    
  },
];

const PackagesDisplay: React.FC = () => {
  return (
    <section className="font-inter bg-smartbill-dark-blue text-black min-h-screen flex flex-col justify-between px-4 py-8 sm:py-12">
      <div className="container mx-auto text-center mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          SmartBill Pricing Plans
        </h1>
        <p className="text-lg sm:text-xl text-smartbill-light-blue max-w-3xl mx-auto">
          Flexible and Transparent Pricing to Suit Every Business
        </p>
        <p className="mt-4 text-base sm:text-lg text-smartbill-light-blue max-w-4xl mx-auto">
          Whether you&apos;re just starting out or managing a growing enterprise, SmartBill has a package that fits your needs.
          All plans include access to both the Web and Mobile POS, real-time sync, cloud backup, and dedicated support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className={`bg-accent bg-opacity-10 backdrop-blur-sm rounded-xl shadow-lg p-6 flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-t-4`}
          >
            <h2 className={`text-2xl font-semibold mb-2 ${pkg.bestFor}`}>{pkg.title}</h2>
            <p className="text-2xl font-bold mb-4 text-primary">{pkg.price}</p>
            <p className="text-smartbill-light-blue mb-6">{pkg.description}</p>
            <ul className="text-black text-base space-y-3 flex-grow">
              {pkg.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <span className={`${pkg.bestFor} mr-2`}>✔</span> {feature}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-smartbill-light-blue border-opacity-30">
              <p className="text-primary text-lg mb-4">{pkg.highlightText}</p>
              <button
                className={`w-full py-3 px-6 rounded-lg text-white font-semibold bg-secondary hover:bg-opacity-90 transition-colors duration-200 shadow-md`}
              >
                Get Started
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PackagesDisplay;
