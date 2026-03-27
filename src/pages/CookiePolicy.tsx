import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-bg dark:bg-black text-paon dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="container py-32 max-w-4xl">
        <h1 className="t-headline mb-4">Cookie Policy</h1>
        <p className="t-body mb-12 text-paon/70 dark:text-white/70">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-8">
          <div>
            <h2 className="t-title mb-4">1. What Are Cookies</h2>
            <p className="t-body">Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, keep you logged in, and understand how you interact with our platform.</p>
          </div>
          <div>
            <h2 className="t-title mb-4">2. How We Use Cookies</h2>
            <ul className="t-body list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the platform to function, such as authentication and session management.</li>
              <li><strong>Analytical Cookies:</strong> Help us understand how visitors interact with the site so we can improve the user experience.</li>
              <li><strong>Preference Cookies:</strong> Remember your settings like dark mode preferences and language choices.</li>
            </ul>
          </div>
          <div>
            <h2 className="t-title mb-4">3. Managing Your Cookies</h2>
            <p className="t-body">You can control and/or delete cookies as you wish via your browser settings. However, disabling essential cookies may prevent you from using key features of Tizii.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
