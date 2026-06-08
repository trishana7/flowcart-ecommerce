'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Mail } from 'lucide-react';
import styles from './Footer.module.css';

// Custom Brand Icons (deprecated in recent Lucide versions)
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
    <polygon points="10 15 15 12 10 9"/>
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    setSubscribed(true);
    setEmail('');
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <div className={styles.logo} onClick={handleLogoClick} role="button" tabIndex={0} style={{ cursor: 'pointer' }}>
              FlowCart<span className={styles.logoDot}></span>
            </div>
            <p className={styles.brandDesc}>
              A modern lifestyle capsule brand engineered for utility, durability, and a clean technical design aesthetic.
            </p>
            <div className={styles.socials}>
              <button className={styles.socialBtn} aria-label="Facebook">
                <FacebookIcon />
              </button>
              <button className={styles.socialBtn} aria-label="Instagram">
                <InstagramIcon />
              </button>
              <button className={styles.socialBtn} aria-label="Twitter">
                <TwitterIcon />
              </button>
              <button className={styles.socialBtn} aria-label="YouTube">
                <YoutubeIcon />
              </button>
            </div>
          </div>

          {/* Collections Links */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Collections</h4>
            <div className={styles.linksList}>
              <Link href="/#products" className={styles.footerLink}>Apparel</Link>
              <Link href="/#products" className={styles.footerLink}>Accessories</Link>
              <Link href="/#products" className={styles.footerLink}>Footwear</Link>
              <Link href="/#products" className={styles.footerLink}>Gear Series</Link>
            </div>
          </div>

          {/* Client Support Links */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Client Support</h4>
            <div className={styles.linksList}>
              <Link href="/#faq" className={styles.footerLink}>FAQ & Shipping</Link>
              <Link href="/#faq" className={styles.footerLink}>Returns & Exchanges</Link>
              <Link href="/#faq" className={styles.footerLink}>Product Lifetime Care</Link>
              <Link href="/#faq" className={styles.footerLink}>Contact Helpline</Link>
            </div>
          </div>

          {/* Newsletter Opt-in */}
          <div className={styles.newsletterCol}>
            <h4 className={styles.colTitle}>Newsletter</h4>
            <p className={styles.newsletterDesc}>
              Subscribe to unlock early capsule access and exclusive technical releases.
            </p>

            {subscribed ? (
              <div className={styles.successArea}>
                <Check size={18} />
                <span>Subscription confirmed. Welcome.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className={styles.emailInput}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    required
                  />
                  <button type="submit" className={styles.submitBtn} aria-label="Subscribe">
                    <Mail size={16} />
                  </button>
                </div>
                {error && <span className={styles.errorMsg}>{error}</span>}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div>&copy; {new Date().getFullYear()} FlowCart Inc. All rights reserved.</div>
          <div className={styles.bottomLinks}>
            <Link href="/" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/" className={styles.footerLink}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
