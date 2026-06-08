'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart, ShoppingBag, Eye, Star, AlertCircle } from 'lucide-react';
import { useStore, Product } from '@/store/useStore';
import { useHasHydrated } from '@/hooks/useHasHydrated';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './FeaturedProducts.module.css';

// Register GSAP ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CATEGORIES = ['All', 'Apparel', 'Accessories', 'Footwear', 'Gear'];

export default function FeaturedProducts() {
  const hasHydrated = useHasHydrated();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const gridRef = useRef<HTMLDivElement>(null);

  // Zustand Store selectors
  const addToCart = useStore((state) => state.addToCart);
  const wishlist = useStore((state) => state.wishlist);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const setQuickViewProduct = useStore((state) => state.setQuickViewProduct);
  const setQuickViewOpen = useStore((state) => state.setQuickViewOpen);

  // TanStack Query for Products
  const { data: products, isLoading, isError, refetch } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
  });

  // Filter products based on selected tab
  const filteredProducts = products?.filter((prod) => {
    if (selectedCategory === 'All') return true;
    return prod.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Trigger GSAP ScrollTrigger animation when products load
  useEffect(() => {
    if (isLoading || isError || !filteredProducts || filteredProducts.length === 0) return;

    // Wait a brief tick for render
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(`.${styles.card}`);
      if (!cards || cards.length === 0) return;

      // Kill any previous ScrollTriggers for these elements
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === gridRef.current) {
          trigger.kill();
        }
      });

      // Stagger reveal on scroll
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, gridRef);

    return () => ctx.revert(); // cleanup
  }, [isLoading, isError, selectedCategory, products]);

  const handleQuickView = (prod: Product) => {
    setQuickViewProduct(prod);
    setQuickViewOpen(true);
  };

  const handleAddToCart = (prod: Product) => {
    addToCart({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      category: prod.category,
      selectedSize: prod.sizes && prod.sizes.length > 0 ? prod.sizes[0] : undefined,
      selectedColor: prod.colors && prod.colors.length > 0 ? prod.colors[0] : undefined,
    });
  };

  return (
    <section className={styles.section} id="products">
      <div className="container">
        {/* Header */}
        <div className={styles.titleWrapper}>
          <span className={styles.subtitle}>Curated Collections</span>
          <h2 className={styles.title}>Featured Products</h2>
        </div>

        {/* Category Filters */}
        <div className={styles.filterTabs}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.tab} ${selectedCategory === cat ? styles.tabActive : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className={styles.grid}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonImage} />
                <div className={styles.skeletonInfo}>
                  <div className={styles.skeletonText} style={{ width: '40%' }} />
                  <div className={styles.skeletonText} style={{ width: '80%', height: '16px' }} />
                  <div className={styles.skeletonText} style={{ width: '30%', marginTop: 'auto' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className={styles.errorArea}>
            <AlertCircle size={40} color="#ef4444" />
            <p>Failed to retrieve products. Please check your connection and try again.</p>
            <button className="btn-secondary" onClick={() => refetch()}>
              Try Again
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !isError && (
          <div ref={gridRef} className={styles.grid}>
            {filteredProducts?.map((prod) => {
              const isFavorited = hasHydrated ? wishlist.includes(prod.id) : false;
              return (
                <article key={prod.id} className={styles.card}>
                  {/* Image & Badges */}
                  <div className={styles.imageArea}>
                    {!prod.inStock && <span className={styles.stockBadge}>Out of Stock</span>}
                    
                    <button 
                      className={`${styles.wishlistBtn} ${isFavorited ? styles.wishlistActive : ''}`}
                      onClick={() => toggleWishlist(prod.id)}
                      aria-label="Add to Wishlist"
                    >
                      <Heart size={16} fill={isFavorited ? '#ef4444' : 'none'} />
                    </button>

                    <img src={prod.image} alt={prod.name} className={styles.image} />

                    {/* Actions Hover Overlay */}
                    {prod.inStock && (
                      <div className={styles.overlay}>
                        <button className={styles.overlayBtn} onClick={() => handleAddToCart(prod)}>
                          <ShoppingBag size={14} />
                          <span>Add to Cart</span>
                        </button>
                        <button 
                          className={styles.overlayIconBtn} 
                          onClick={() => handleQuickView(prod)}
                          aria-label="Quick View"
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Info Area */}
                  <div className={styles.infoArea}>
                    <div>
                      <span className={styles.category}>{prod.category}</span>
                      <h3 className={styles.productName}>{prod.name}</h3>
                    </div>

                    <div className={styles.priceRow}>
                      <span className={styles.price}>${prod.price.toFixed(2)}</span>
                      <div className={styles.rating}>
                        <Star size={12} fill="var(--primary-color)" stroke="none" className={styles.star} />
                        <span>{prod.rating}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
