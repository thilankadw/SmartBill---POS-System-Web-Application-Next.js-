"use client";

import React from 'react';
import Link from 'next/link';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-inter text-black">
      <div className="container mx-auto text-center mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          Privacy Policy, Refund Policy & Terms of Service
        </h1>
      </div>
      <div className="max-w-4xl mx-auto bg-accent bg-opacity-10 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="px-6 py-8 ">
          <div className="space-y-8 text-black">

            <section>
              <h2 className="text-2xl font-semibold text-smartbill-blue mb-4">Privacy Policy</h2>
              <p className="mb-4">At SmartBill, we are committed to protecting your privacy and ensuring the security of your information. This Privacy Policy outlines how we collect, use, and safeguard your personal data when you use our platform.</p>
              
              <h3 className="text-xl font-semibold mb-2">Information We Collect</h3>
              <div className="space-y-4">
                <InfoItem iconPath="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M8.5 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8 M17 11l2 2 4-4" text="Personal Information: Your name, email address, phone number, and billing details, collected during registration or subscription." />
                <InfoItem iconPath="M1 10h22 M1 4h22v16H1z" text="Payment Information: Securely processed by trusted third-party payment processors. We do not store any card or payment credentials." />
                <InfoItem iconPath="M20 13c0 5-3 7-7 7-4 0-7-2-7-7s3-7 7-7c4 0 7 2 7 7Z M10 13L2 7 M22 7l-8 6" text="Usage Data: We collect data such as IP addresses, browser types, device information, and user behavior using cookies and similar technologies to improve your experience and our services." />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-smartbill-blue mb-4">Use of Information</h2>
              <p className="mb-2">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Provide, operate, and maintain our services</li>
                <li>Process transactions and manage billing</li>
                <li>Respond to inquiries and provide customer support</li>
                <li>Improve our website and product offerings</li>
                <li>Prevent fraud and unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-smartbill-blue mb-4">Information Sharing</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>We do not sell or trade your information.</li>
                <li>We may share information with trusted service providers for operational purposes (e.g., payment processors, hosting).</li>
                <li>Legal authorities if required by law, subpoena, or to enforce our legal rights.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-smartbill-blue mb-4">Cookies and Tracking Technologies</h2>
              <p className="mb-2">SmartBill uses cookies to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Analyze website traffic</li>
                <li>Store preferences</li>
                <li>Enhance user experience</li>
              </ul>
              <p className="mt-2">You can disable cookies via your browser settings, though it may affect functionality.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-smartbill-blue mb-4">Data Security</h2>
              <p>We use industry-standard measures to protect your data from unauthorized access, disclosure, or loss. However, no method of internet transmission is completely secure.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-smartbill-blue mb-4">Policy Updates</h2>
              <p>We may revise this Privacy Policy from time to time. Changes will be posted on this page with the updated effective date.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-smartbill-blue mb-4">Refund Policy</h2>
              <p className="mb-4">We value your satisfaction and strive to provide high-quality services. Please review our refund policy before subscribing.</p>
              
              <div className="space-y-4">
                <div className="bg-smartbill-light-blue/30 p-4 rounded-lg border border-smartbill-blue/20">
                  <h3 className="text-lg font-semibold text-smartbill-dark-blue mb-2">Subscription Refunds</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Trial Period:</strong> You can cancel before the trial ends to avoid charges. Payments made after the trial are non-refundable.</li>
                    <li><strong>Monthly & Yearly Plans:</strong> Payments are non-refundable once processed. We do not offer refunds for unused time or partial usage.</li>
                    <li><strong>Accidental Charges:</strong> Contact us within 7 days of billing for review.</li>
                  </ul>
                </div>

                <div className="bg-smartbill-yellow/10 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-smartbill-dark-blue mb-2">Refund Eligibility</h3>
                  <p className="mb-2">You may be eligible for a refund in the following cases:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Duplicate charges due to technical error</li>
                    <li>System malfunctions preventing access to core features</li>
                    <li>Failure to deliver advertised essential services</li>
                  </ul>
                </div>

                <div className="bg-smartbill-green/10 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-smartbill-dark-blue mb-2">Refund Processing</h3>
                  <p>Approved refunds will be credited to the original payment method used at the time of purchase.</p>
                </div>

                <div className="flex items-center bg-smartbill-green/10 p-4 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-smartbill-purple mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13l-3-3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2l-3 3" />
                    <path d="M13 10l3 3v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3l3-3" />
                  </svg>
                  <div>
                    <p className="font-semibold">Request a Refund</p>
                    <p>To request a refund, please email us at:</p>
                    <Link href="mailto:info@smartbill.lk" className="text-smartbill-blue hover:underline">info@smartbill.lk</Link>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-smartbill-blue mb-4">Terms & Conditions</h2>
              <p className="mb-4">By using SmartBill, you agree to abide by the following terms and conditions:</p>
              
              <div className="space-y-4">
                <div className="bg-smartbill-light-blue/30 p-4 rounded-lg border border-smartbill-blue/20">
                  <h3 className="text-lg font-semibold text-smartbill-dark-blue mb-2">Account Usage</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Users must be at least 18 years old.</li>
                    <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                    <li>Do not misuse the platform for unlawful or unauthorized activities.</li>
                  </ul>
                </div>

                <div className="bg-smartbill-yellow/10 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-smartbill-dark-blue mb-2">Payments & Subscriptions</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>All fees are billed in advance and are non-refundable.</li>
                    <li>SmartBill reserves the right to change pricing and plans with notice.</li>
                    <li>Failure to pay may result in account suspension or termination.</li>
                  </ul>
                </div>

                <div className="bg-smartbill-green/10 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-smartbill-dark-blue mb-2">License and Use</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>SmartBill grants you a limited, non-transferable license to use the system as per your subscribed plan.</li>
                    <li>You may not copy, resell, or redistribute any part of the system without written consent.</li>
                  </ul>
                </div>

                <div className="bg-smartbill-light-blue/30 p-4 rounded-lg border border-smartbill-blue/20">
                  <h3 className="text-lg font-semibold text-smartbill-dark-blue mb-2">Limitation of Liability</h3>
                  <p>SmartBill shall not be liable for:</p>
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>Indirect, incidental, or consequential damages</li>
                    <li>Loss of data or business interruptions</li>
                    <li>Delays or failure in performance beyond our control</li>
                  </ul>
                </div>

                <div className="bg-smartbill-yellow/10 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-smartbill-dark-blue mb-2">Modifications to Terms</h3>
                  <p>We reserve the right to modify these terms at any time. Updated terms will be posted on this page. Continued use constitutes your agreement to those changes.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-smartbill-blue mb-4">Contact Information</h2>
              <div className="flex flex-col space-y-4">
                <p>For any questions regarding our Privacy Policy, Terms, or Refund Policy, please reach out to:</p>
                <div className="flex items-center bg-smartbill-green/10 p-4 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-smartbill-purple mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <div>
                    <p className="font-semibold">Email</p>
                    <Link href="mailto:info@smartbill.lk" className="text-smartbill-blue hover:underline">info@smartbill.lk</Link>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
        <div className="bg-smartbill-dark-blue text-black px-6 py-4 text-center">
          <p className="text-sm">
            Last Updated: June 2025 | © {new Date().getFullYear()} Smart Bill. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ iconPath, text }: { iconPath: string; text: string }) => (
  <div className="flex items-start">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-smartbill-purple mr-2 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {iconPath.split(" ").map((d, idx) => <path key={idx} d={d} />)}
    </svg>
    <p><strong>{text.split(":")[0]}:</strong>{text.split(":")[1]}</p>
  </div>
);

export default PrivacyPolicy;