'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, Menu, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useHasHydrated } from '@/hooks/useHasHydrated';
import { gsap } from 'gsap';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const hasHydrated = useHasHydrated();
  
  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);
  const setCartOpen = useStore((state) => state.setCartOpen);
  const mobileMenuOpen = useStore((state) => state.mobileMenuOpen);
  const setMobileMenuOpen = useStore((state) => state.setMobileMenuOpen);

  const [scrolled, setScrolled] = useState(false);
  const linksRef = useRef<HTMLDivElement>(null);

  // Cart item total quantity count
  const cartItemsCount = hasHydrated ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const wishlistCount = hasHydrated ? wishlist.length : 0;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP animation for mobile drawer links stagger on open
  useEffect(() => {
    if (mobileMenuOpen && linksRef.current) {
      const links = linksRef.current.querySelectorAll(`.${styles.drawerLink}`);
      gsap.fromTo(
        links,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out', delay: 0.1 }
      );
    }
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.nav}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo} onClick={() => setMobileMenuOpen(false)}>
            FlowCart<span className={styles.logoDot}></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.menu}>
            <Link href="/" className={`${styles.menuLink} ${pathname === '/' ? styles.activeLink : ''}`}>
              Shop
            </Link>
            <Link href="/#products" className={styles.menuLink}>
              Products
            </Link>
            <Link href="/#faq" className={styles.menuLink}>
              FAQ
            </Link>
          </nav>

          {/* Actions: Wishlist, Cart, Mobile Hamburger */}
          <div className={styles.actions}>
            {/* Wishlist */}
            <Link href="/#products" className={styles.iconBtn} aria-label="Wishlist">
              <Heart className={wishlistCount > 0 ? styles.wishlistActive : ''} fill={wishlistCount > 0 ? '#ef4444' : 'none'} size={22} />
              {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
            </Link>

            {/* Shopping Cart */}
            <button className={styles.iconBtn} onClick={() => setCartOpen(true)} aria-label="Open Cart">
              <ShoppingBag size={22} />
              {cartItemsCount > 0 && <span className={styles.badge}>{cartItemsCount}</span>}
            </button>

            {/* Mobile Burger Button */}
            <button className={`${styles.iconBtn} ${styles.hamburger}`} onClick={toggleMobileMenu} aria-label="Toggle Menu">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`${styles.drawerOverlay} ${mobileMenuOpen ? styles.drawerOpen : ''}`} 
        onClick={() => setMobileMenuOpen(false)}
      >
        {/* Drawer Container */}
        <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
          <button className={styles.drawerCloseBtn} onClick={() => setMobileMenuOpen(false)} aria-label="Close Menu">
            <X size={24} />
          </button>
          
          <div className={styles.drawerLinks} ref={linksRef}>
            <Link href="/" className={styles.drawerLink} onClick={() => setMobileMenuOpen(false)}>
              Shop
            </Link>
            <Link href="/#products" className={styles.drawerLink} onClick={() => setMobileMenuOpen(false)}>
              Featured Products
            </Link>
            <Link href="/#faq" className={styles.drawerLink} onClick={() => setMobileMenuOpen(false)}>
              Frequently Asked
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
