'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, CheckCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useHasHydrated } from '@/hooks/useHasHydrated';
import { gsap } from 'gsap';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const hasHydrated = useHasHydrated();
  
  const cart = useStore((state) => state.cart);
  const cartOpen = useStore((state) => state.cartOpen);
  const setCartOpen = useStore((state) => state.setCartOpen);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const clearCart = useStore((state) => state.clearCart);

  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);

  // Subtotal Calculation
  const subtotal = hasHydrated ? cart.reduce((acc, item) => acc + item.price * item.quantity, 0) : 0;
  const cartItemsCount = hasHydrated ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  // Prevent background scroll when cart drawer is open
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [cartOpen]);

  // Reset checkout state when drawer is closed
  useEffect(() => {
    if (!cartOpen) {
      const timer = setTimeout(() => {
        setCheckoutSuccess(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [cartOpen]);

  // GSAP animation on checkout success
  useEffect(() => {
    if (checkoutSuccess && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [checkoutSuccess]);

  // GSAP animation for list items staggering on mount/open
  useEffect(() => {
    if (cartOpen && itemsContainerRef.current && cart.length > 0) {
      const items = itemsContainerRef.current.querySelectorAll(`.${styles.cartItem}`);
      gsap.fromTo(
        items,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [cartOpen, cart.length]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutSuccess(true);
    setTimeout(() => {
      clearCart();
    }, 2500);
  };

  return (
    <div className={`${styles.overlay} ${cartOpen ? styles.open : ''}`} onClick={() => setCartOpen(false)}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title}>
            <ShoppingBag size={20} />
            <span>Shopping Cart</span>
            {cartItemsCount > 0 && <span className={styles.itemCount}>{cartItemsCount}</span>}
          </div>
          <button className={styles.closeBtn} onClick={() => setCartOpen(false)} aria-label="Close Cart">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {checkoutSuccess ? (
          <div ref={successRef} className={styles.emptyState} style={{ padding: '40px 24px' }}>
            <CheckCircle size={56} className={styles.emptyIcon} style={{ color: 'var(--primary-color)' }} />
            <h3 className={styles.emptyTitle}>Order Placed!</h3>
            <p className={styles.emptyText}>
              Thank you for shopping with FlowCart. Your order has been registered and is processing.
            </p>
            <button className={`btn-primary ${styles.shopBtn}`} onClick={() => setCartOpen(false)}>
              Continue Shopping
            </button>
          </div>
        ) : !hasHydrated || cart.length === 0 ? (
          <div className={styles.emptyState}>
            <ShoppingBag size={48} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>Your cart is empty</h3>
            <p className={styles.emptyText}>
              Explore our premium minimalist collections and find something styled for you.
            </p>
            <button className={`btn-primary ${styles.shopBtn}`} onClick={() => setCartOpen(false)}>
              Start Browsing
            </button>
          </div>
        ) : (
          <>
            <div className={styles.content} ref={itemsContainerRef}>
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedSize || ''}-${item.selectedColor || ''}`} className={styles.cartItem}>
                  <div className={styles.imgWrapper}>
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                  </div>
                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <h4 className={styles.itemName}>{item.name}</h4>
                      <button 
                        className={styles.removeBtn} 
                        onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                        aria-label="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    {/* Meta selections (Size / Color) */}
                    {(item.selectedSize || item.selectedColor) && (
                      <div className={styles.itemMeta}>
                        {item.selectedSize && <span className={styles.metaBadge}>{item.selectedSize}</span>}
                        {item.selectedColor && <span className={styles.metaBadge}>{item.selectedColor}</span>}
                      </div>
                    )}

                    <div className={styles.itemFooter}>
                      {/* Quantity Controls */}
                      <div className={styles.qtyControl}>
                        <button 
                          className={styles.qtyBtn} 
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button 
                          className={styles.qtyBtn} 
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary & Action */}
            <div className={styles.footer}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryVal}>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Shipping</span>
                <span className={styles.summaryVal}>
                  {subtotal >= 150 ? 'Complimentary' : '$9.99'}
                </span>
              </div>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalVal}>
                  ${(subtotal + (subtotal >= 150 || subtotal === 0 ? 0 : 9.99)).toFixed(2)}
                </span>
              </div>
              <button className={`btn-primary ${styles.checkoutBtn}`} onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
