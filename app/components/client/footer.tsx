import Link from 'next/link';
import React from 'react';
import { FaCheckCircle, FaCreditCard, FaShieldAlt, FaHeadset, FaClock, FaTag } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-soft py-4 md:pt-8 lg:py-10">
            <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                        Why Choose <span className="text-accent">SmartBill</span>?
                    </h2>
                    <p className="text-lg text-secondary mb-6">Empower your business with seamless billing.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                    <div className="flex items-center space-x-4">
                        <FaCheckCircle className="text-accent text-xl" />
                        <span className="font-medium text-secondary">Easy to Use</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <FaClock className="text-accent text-xl" />
                        <span className="font-medium text-secondary">Fast Setup</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <FaTag className="text-accent text-xl" />
                        <span className="font-medium text-secondary">Affordable Plans</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <FaShieldAlt className="text-accent text-xl" />
                        <span className="font-medium text-secondary">Secure Cloud Backup</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <FaHeadset className="text-accent text-xl" />
                        <span className="font-medium text-secondary">Dedicated Support</span>
                    </div>
                    <div></div>
                </div>

                <div className="py-8 border-t border-soft">
                    <div className="text-center">
                        <p className="text-lg font-medium text-primary mb-3">
                            <FaCreditCard className="inline-block mr-2 text-blue-500" /> Integrated with{' '}
                            <span className="text-blue-600 font-semibold">PayHere</span> for Secure Payments
                        </p>
                        <p className="text-secondary mb-6">Accept all major cards and online transfers securely.</p>

                        <div className="bg-highlight/10 rounded-xl py-8 px-6 md:px-12">
                            <h3 className="text-xl font-semibold text-accent mb-3">🎁 Try SmartBill <span className="text-primary">FREE for 7 Days</span></h3>
                            <p className="text-secondary font-bold mb-4">Explore all features. No credit card required.</p>
                            <div className="flex flex-col justify-center items-center gap-4">
                                <div className='flex  gap-4'>
                                    <div className="text-primary font-medium transition-colors">
                                        Contact Us
                                    </div>
                                    <span className="text-primary font-medium">📞 070 224 5243</span>
                                </div>
                                <Link href="/client/packages" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-accent-dark transition-colors">
                                    Get Started Free
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-secondary text-sm">
                    <p>&copy; {new Date().getFullYear()} SmartBill. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;