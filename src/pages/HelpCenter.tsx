import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-bg dark:bg-black text-paon dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="container py-32 max-w-4xl">
        <h1 className="t-headline mb-4">Help Center</h1>
        <p className="t-body mb-12 text-paon/70 dark:text-white/70">Find answers to common questions about booking and hosting on Tizii.</p>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* For Artists */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-lemon">For Artists</h2>
            <div className="space-y-6">
              <div>
                <h3 className="t-title text-base mb-2">How do I book a studio?</h3>
                <p className="t-body text-sm">Search for a studio using the Discovery Engine, select your desired date and time slots, and complete the secure checkout process.</p>
              </div>
              <div>
                <h3 className="t-title text-base mb-2">What is the cancellation policy?</h3>
                <p className="t-body text-sm">Cancellation policies depend on the individual studio. Check the studio's profile for their specific rules before booking.</p>
              </div>
              <div>
                <h3 className="t-title text-base mb-2">Are engineers included?</h3>
                <p className="t-body text-sm">Some studios include an engineer in the hourly rate, while others offer it as an add-on. This detail is clearly marked on the studio's page.</p>
              </div>
            </div>
          </section>

          {/* For Studio Owners */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-lemon">For Studio Owners</h2>
            <div className="space-y-6">
              <div>
                <h3 className="t-title text-base mb-2">How do I list my studio?</h3>
                <p className="t-body text-sm">Click "List Studio" in the navigation bar to create an owner account and submit your studio details, gear list, and photos for review.</p>
              </div>
              <div>
                <h3 className="t-title text-base mb-2">When do I get paid?</h3>
                <p className="t-body text-sm">Payments are processed automatically and transferred to your connected bank or mobile money account 24 hours after a successful session.</p>
              </div>
              <div>
                <h3 className="t-title text-base mb-2">Can I block out specific times?</h3>
                <p className="t-body text-sm">Yes, you can manage your calendar directly from the Studio Manager Dashboard to block out maintenance periods or offline bookings.</p>
              </div>
            </div>
          </section>
        </div>
        
        <div className="mt-16 p-8 glass-morphism rounded-3xl border border-white/10 text-center">
          <h2 className="t-title mb-4">Still need help?</h2>
          <p className="t-body mb-6 text-paon/70 dark:text-white/70">Our support team is available 24/7 to assist you with any issues.</p>
          <a href="mailto:support@tizii.com" className="btn btn-paon inline-flex">Contact Support</a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
