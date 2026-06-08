'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import PromoBanner from '@/components/PromoBanner';
import FAQSection from '@/components/FAQSection';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import QuickViewModal from '@/components/QuickViewModal';

export default function Home() {
  return (
    <>
      {/* Sticky Header */}
      <Navbar />

      {/* Main Landing Sections */}
      <main>
        <Hero />
        <FeaturedProducts />
        <PromoBanner />
        <FAQSection />
        <Testimonials />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Interactive States Drawers/Modals */}
      <CartDrawer />
      <QuickViewModal />
    </>
  );
}
