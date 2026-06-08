'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import styles from './Testimonials.module.css';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Marcus Vance',
    role: 'Creative Director',
    quote: "FlowCart's watch is a masterclass in minimalism. The build quality exceeds expectations and the design language fits perfectly into my minimalist wardrobe.",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 'test-2',
    name: 'Helena Rose',
    role: 'Architect',
    quote: 'The Obsidian backpack has survived rainy commutes and flights with ease. It stands upright, holds my 16" laptop securely, and looks like architectural art.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 'test-3',
    name: 'Devon Carter',
    role: 'Software Engineer',
    quote: 'Absolutely love the Stealth sneakers. They feel like walking on clouds while maintaining a clean, structured appearance. Highly recommended for daily wear.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop'
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const slide = (direction: 'next' | 'prev') => {
    // Determine new index
    let nextIndex = currentIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % TESTIMONIALS.length;
    } else {
      nextIndex = (currentIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
    }

    // GSAP Transition
    if (cardRef.current) {
      const exitX = direction === 'next' ? -30 : 30;
      const enterX = direction === 'next' ? 30 : -30;

      // Animate out
      gsap.to(cardRef.current, {
        opacity: 0,
        x: exitX,
        duration: 0.2,
        onComplete: () => {
          setCurrentIndex(nextIndex);
          // Animate back in
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, x: enterX },
            { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
          );
        }
      });
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  // Reset autoplay timer when index changes
  const resetAutoplay = () => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
    }
    autoPlayTimer.current = setInterval(() => {
      slide('next');
    }, 6000);
  };

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [currentIndex]);

  const activeTestimonial = TESTIMONIALS[currentIndex];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.titleWrapper}>
          <span className={styles.subtitle}>Testimonials</span>
          <h2 className={styles.title}>Client Endorsements</h2>
        </div>

        <div className={styles.sliderContainer}>
          <div ref={cardRef} className={`${styles.card} glass-panel`}>
            {/* Stars */}
            <div className={styles.stars}>
              {[...Array(activeTestimonial.rating)].map((_, i) => (
                <Star key={i} size={16} fill="var(--primary-color)" stroke="none" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className={styles.quote}>
              &ldquo;{activeTestimonial.quote}&rdquo;
            </blockquote>

            {/* Author */}
            <div className={styles.authorWrapper}>
              <img 
                src={activeTestimonial.avatar} 
                alt={activeTestimonial.name} 
                className={styles.avatar} 
              />
              <div className={styles.authorInfo}>
                <div className={styles.name}>{activeTestimonial.name}</div>
                <div className={styles.role}>{activeTestimonial.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button 
            className={styles.controlBtn} 
            onClick={() => slide('prev')} 
            aria-label="Previous Testimonial"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            className={styles.controlBtn} 
            onClick={() => slide('next')} 
            aria-label="Next Testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
