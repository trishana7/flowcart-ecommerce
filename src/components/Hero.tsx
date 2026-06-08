'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { gsap } from 'gsap';
import styles from './Hero.module.css';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tagline = containerRef.current.querySelector(`.${styles.tagline}`);
    const headline = containerRef.current.querySelector(`.${styles.headline}`);
    const subtext = containerRef.current.querySelector(`.${styles.subtext}`);
    const ctas = containerRef.current.querySelectorAll(`.${styles.ctaGroup} > *`);
    const imgContainer = containerRef.current.querySelector(`.${styles.imageContainer}`);
    const floatingCard = containerRef.current.querySelector(`.${styles.floatingCard}`);
    const scrollInd = containerRef.current.querySelector(`.${styles.scrollIndicator}`);

    // GSAP Timeline
    const tl = gsap.timeline();

    tl.fromTo(
      [tagline, headline, subtext],
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    )
      .fromTo(
        ctas,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        imgContainer,
        { opacity: 0, scale: 0.95, x: 40 },
        { opacity: 1, scale: 1, x: 0, duration: 0.9, ease: 'power3.out' },
        '-=0.8'
      )
      .fromTo(
        floatingCard,
        { opacity: 0, scale: 0.8, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.5)' },
        '-=0.3'
      )
      .fromTo(
        scrollInd,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.2'
      );
  }, []);

  return (
    <section ref={containerRef} className={styles.hero}>
      {/* Decorative Glows */}
      <div className={`glow-accent ${styles.glow1}`}></div>
      <div className={`glow-accent ${styles.glow2}`}></div>

      <div className="container">
        <div className={styles.grid}>
          {/* Text Content */}
          <div className={styles.textContent}>
            <span className={styles.tagline}>
              <Sparkles size={14} />
              Introducing FlowCart
            </span>
            <h1 className={styles.headline}>
              Engineered for the <br />
              <span className={styles.gradientText}>Modern Pioneer.</span>
            </h1>
            <p className={styles.subtext}>
              Explore our curated capsule collections. Crafted with surgical precision, sustainable organic fabrics, and a timeless technical silhouette.
            </p>
            <div className={styles.ctaGroup}>
              <Link href="#products" className="btn-primary">
                <span>Shop Collection</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="#faq" className="btn-secondary">
                <span>Explore Tech Specs</span>
              </Link>
            </div>
          </div>

          {/* Image Section */}
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <img 
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop" 
                alt="FlowCart Modern Lifestyle" 
                className={styles.heroImage}
              />
            </div>
            
            {/* Floating Trust Card */}
            <div className={`${styles.floatingCard} glass-panel`}>
              <ShieldCheck size={24} color="var(--primary-color)" />
              <div className={styles.floatingText}>
                <div className={styles.floatingTitle}>Lifetime Guarantee</div>
                <div className={styles.floatingSub}>2-Year Full Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <span>Scroll</span>
        <div className={styles.mouse}>
          <div className={styles.wheel}></div>
        </div>
      </div>
    </section>
  );
}
