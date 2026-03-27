import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-bg dark:bg-black text-paon dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="container py-32 max-w-4xl">
        <h1 className="t-headline mb-4">Privacy Policy</h1>
        <p className="t-body mb-12 text-paon/70 dark:text-white/70">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-8">
          <div>
            <h2 className="t-title mb-4">1. Information We Collect</h2>
            <p className="t-body">We collect information you provide directly to us when you create an account, list a studio, or make a booking. This includes your name, email, phone number, and payment details.</p>
          </div>
          <div>
            <h2 className="t-title mb-4">2. How We Use Your Information</h2>
            <p className="t-body">We use the information we collect to facilitate studio bookings, process payments, provide customer support, and improve our services across the Tizii platform.</p>
          </div>
          <div>
            <h2 className="t-title mb-4">3. Information Sharing</h2>
            <p className="t-body">We share necessary information between Artists and Studio Owners to facilitate bookings. We do not sell your personal data to third parties.</p>
          </div>
          <div>
            <h2 className="t-title mb-4">4. Data Security</h2>
            <p className="t-body">We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
