import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-bg dark:bg-black text-paon dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="container py-32 max-w-4xl">
        <h1 className="t-headline mb-4">Terms of Service</h1>
        <p className="t-body mb-12 text-paon/70 dark:text-white/70">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-8">
          <div>
            <h2 className="t-title mb-4">1. Acceptance of Terms</h2>
            <p className="t-body">By accessing or using the Tizii platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
          </div>
          <div>
            <h2 className="t-title mb-4">2. Booking Policies</h2>
            <p className="t-body">All studio bookings made through Tizii are subject to confirmation by the Studio Owner. Cancellations must adhere to the specific studio's stated cancellation policy to be eligible for a refund.</p>
          </div>
          <div>
            <h2 className="t-title mb-4">3. User Conduct</h2>
            <p className="t-body">Artists are expected to treat studio facilities with respect. Studio Owners hold the right to terminate sessions if equipment is mishandled or facility rules are broken.</p>
          </div>
          <div>
            <h2 className="t-title mb-4">4. Payments and Fees</h2>
            <p className="t-body">Tizii charges a service fee on all confirmed bookings. Payments are processed securely via our payment partners and are held until the session is completed successfully.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
