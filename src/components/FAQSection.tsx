'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { gsap } from 'gsap';
import styles from './FAQSection.module.css';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { data: faqs, isLoading, isError, refetch } = useQuery<FAQ[]>({
    queryKey: ['faqs'],
    queryFn: async () => {
      const res = await fetch('/api/faqs');
      if (!res.ok) throw new Error('Failed to fetch FAQs');
      return res.json();
    },
  });

  const toggleAccordion = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  // GSAP Accordion Height Animation
  useEffect(() => {
    if (!faqs) return;

    faqs.forEach((faq) => {
      const contentEl = contentRefs.current[faq.id];
      if (!contentEl) return;

      const isOpen = activeId === faq.id;

      gsap.to(contentEl, {
        height: isOpen ? contentEl.scrollHeight : 0,
        duration: 0.35,
        ease: 'power2.out',
      });
    });
  }, [activeId, faqs]);

  if (isLoading) {
    return (
      <section className={styles.section} id="faq">
        <div className="container">
          <div className={styles.titleWrapper}>
            <span className={styles.subtitle}>Frequently Asked</span>
            <h2 className={styles.title}>Client Support</h2>
          </div>
          <div className={styles.accordion}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={styles.section} id="faq">
        <div className="container">
          <div className={styles.titleWrapper}>
            <span className={styles.subtitle}>FAQ</span>
            <h2 className={styles.title}>Something went wrong</h2>
          </div>
          <div className={styles.errorWrapper}>
            <AlertCircle size={40} color="#ef4444" />
            <p>We encountered an issue loading FAQs. Please try again.</p>
            <button className="btn-secondary" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} id="faq">
      <div className="container">
        <div className={styles.titleWrapper}>
          <span className={styles.subtitle}>Frequently Asked</span>
          <h2 className={styles.title}>Client Support</h2>
        </div>

        <div className={styles.accordion}>
          {faqs?.map((faq) => {
            const isOpen = activeId === faq.id;
            return (
              <div 
                key={faq.id} 
                className={`${styles.faqItem} ${isOpen ? styles.faqItemActive : ''}`}
              >
                <button
                  className={styles.header}
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.question}>{faq.question}</span>
                  <span className={styles.iconWrapper}>
                    <ChevronDown size={18} />
                  </span>
                </button>

                {/* Collapsible Content */}
                <div
                  ref={(el) => {
                    contentRefs.current[faq.id] = el;
                  }}
                  className={styles.contentWrapper}
                >
                  <div className={styles.content}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
