'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PromoBanner.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Set a target date 3 days from the first render of this component
  // to keep the promotional countdown active and functional.
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(targetDate.getHours() + 6);

    const updateTimer = () => {
      const difference = +targetDate - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // GSAP ScrollTrigger Animation
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const textSide = containerRef.current?.querySelector(`.${styles.textSide}`);
      const timerBoxes = containerRef.current?.querySelectorAll(`.${styles.timeBox}`);
      const bannerBtn = containerRef.current?.querySelector('.btn-primary');

      if (textSide && timerBoxes && timerBoxes.length > 0 && bannerBtn) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        tl.fromTo(
          textSide,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
        )
          .fromTo(
            timerBoxes,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'back.out(1.5)' },
            '-=0.3'
          )
          .fromTo(
            bannerBtn,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
            '-=0.2'
          );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.banner}>
      <div className={`glow-accent ${styles.glow}`}></div>
      <div className={`container ${styles.content}`}>
        {/* Text Side */}
        <div className={styles.textSide}>
          <span className={styles.tagline}>
            <Sparkles size={12} style={{ marginRight: '6px' }} />
            Limited Capsule Offer
          </span>
          <h2 className={styles.title}>Season Clearance: Save 25%</h2>
          <p className={styles.description}>
            Elevate your collection with 25% off all gear and apparel. Applies automatically at checkout. Offers valid while stocks last.
          </p>
        </div>

        {/* Interactive Timer Side */}
        <div className={styles.timerSide}>
          <div className={styles.timerGrid}>
            <div className={styles.timeBox}>
              <span className={styles.timeVal}>
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className={styles.timeLabel}>Days</span>
            </div>
            <div className={styles.timeBox}>
              <span className={styles.timeVal}>
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className={styles.timeLabel}>Hrs</span>
            </div>
            <div className={styles.timeBox}>
              <span className={styles.timeVal}>
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className={styles.timeLabel}>Min</span>
            </div>
            <div className={styles.timeBox}>
              <span className={styles.timeVal}>
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className={styles.timeLabel}>Sec</span>
            </div>
          </div>
          
          <a href="#products" className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px' }}>
            Claim Promotion
          </a>
        </div>
      </div>
    </section>
  );
}
