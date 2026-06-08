'use client';

import React, { useEffect, useState, useRef } from 'react';
import { X, Heart, ShoppingBag, Star } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useHasHydrated } from '@/hooks/useHasHydrated';
import { gsap } from 'gsap';
import styles from './QuickViewModal.module.css';

export default function QuickViewModal() {
  const hasHydrated = useHasHydrated();
  
  const product = useStore((state) => state.quickViewProduct);
  const open = useStore((state) => state.quickViewOpen);
  const setOpen = useStore((state) => state.setQuickViewOpen);
  
  const addToCart = useStore((state) => state.addToCart);
  const wishlist = useStore((state) => state.wishlist);
  const toggleWishlist = useStore((state) => state.toggleWishlist);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Sync state when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : '');
    }
  }, [product]);

  // Lock background scrolling
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // GSAP Entrance Animation
  useEffect(() => {
    if (open && modalRef.current && overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, y: 30, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.2)', delay: 0.05 }
      );
    }
  }, [open]);

  const handleClose = () => {
    if (overlayRef.current && modalRef.current) {
      gsap.to(modalRef.current, { scale: 0.9, y: 20, opacity: 0, duration: 0.25, ease: 'power2.in' });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => setOpen(false),
      });
    } else {
      setOpen(false);
    }
  };

  if (!open || !product) return null;

  const isFavorited = hasHydrated ? wishlist.includes(product.id) : false;

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        selectedSize: selectedSize || undefined,
        selectedColor: selectedColor || undefined,
      },
      1
    );
    handleClose();
  };

  return (
    <div 
      ref={overlayRef} 
      className={`${styles.overlay} ${styles.open}`} 
      onClick={handleClose}
    >
      <div 
        ref={modalRef} 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Product Image Section */}
        <div className={styles.imageSection}>
          {!product.inStock && <span className={styles.stockBadge}>Out of Stock</span>}
          <img src={product.image} alt={product.name} className={styles.productImage} />
        </div>

        {/* Product Info Section */}
        <div className={styles.infoSection}>
          <div>
            <span className={styles.category}>{product.category}</span>
            <h2 className={styles.title}>{product.name}</h2>
          </div>

          {/* Rating */}
          <div className={styles.ratingRow}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  fill={i < Math.floor(product.rating) ? 'var(--primary-color)' : 'none'} 
                  stroke="var(--primary-color)" 
                />
              ))}
            </div>
            <span>{product.rating} ({product.reviewsCount} reviews)</span>
          </div>

          {/* Price */}
          <div className={styles.price}>${product.price.toFixed(2)}</div>

          {/* Description */}
          <p className={styles.description}>{product.description}</p>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className={styles.optionsGroup}>
              <span className={styles.optionLabel}>Color: {selectedColor}</span>
              <div className={styles.optionsList}>
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`${styles.colorBtn} ${selectedColor === color ? styles.colorActive : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className={styles.optionsGroup}>
              <span className={styles.optionLabel}>Size: {selectedSize}</span>
              <div className={styles.optionsList}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeActive : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Specifications / Features */}
          {product.features && product.features.length > 0 && (
            <div className={styles.optionsGroup}>
              <span className={styles.optionLabel}>Specifications:</span>
              <ul className={styles.specsList}>
                {product.features.map((feature, i) => (
                  <li key={i} className={styles.specItem}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className={styles.purchaseRow}>
            <button 
              className={`btn-primary ${styles.addToCartBtn}`} 
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingBag size={18} />
              <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>

            <button 
              className={`${styles.wishlistBtn} ${isFavorited ? styles.wishlistActive : ''}`}
              onClick={() => toggleWishlist(product.id)}
              aria-label="Toggle Wishlist"
            >
              <Heart size={20} fill={isFavorited ? '#ef4444' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
