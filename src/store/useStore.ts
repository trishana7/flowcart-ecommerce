import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviewsCount: number;
  sizes?: string[];
  colors?: string[];
  features?: string[];
  inStock: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  selectedSize?: string;
  selectedColor?: string;
}

interface StoreState {
  // Cart State
  cart: CartItem[];
  cartOpen: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string, selectedSize?: string, selectedColor?: string) => void;
  updateQuantity: (id: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;

  // Wishlist State
  wishlist: string[]; // Product IDs
  toggleWishlist: (productId: string) => void;

  // Quick View State
  quickViewProduct: Product | null;
  quickViewOpen: boolean;
  setQuickViewProduct: (product: Product | null) => void;
  setQuickViewOpen: (open: boolean) => void;

  // Mobile Menu State
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Cart Initial State
      cart: [],
      cartOpen: false,
      setCartOpen: (open) => set({ cartOpen: open }),
      
      addToCart: (newItem, quantity = 1) =>
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (item) =>
              item.id === newItem.id &&
              item.selectedSize === newItem.selectedSize &&
              item.selectedColor === newItem.selectedColor
          );

          let updatedCart = [...state.cart];

          if (existingItemIndex > -1) {
            updatedCart[existingItemIndex] = {
              ...updatedCart[existingItemIndex],
              quantity: updatedCart[existingItemIndex].quantity + quantity,
            };
          } else {
            updatedCart.push({ ...newItem, quantity });
          }

          return { cart: updatedCart, cartOpen: true }; // Open cart drawer on add
        }),

      removeFromCart: (id, selectedSize, selectedColor) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(
                item.id === id &&
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor
              )
          ),
        })),

      updateQuantity: (id, quantity, selectedSize, selectedColor) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),

      clearCart: () => set({ cart: [] }),

      // Wishlist Initial State
      wishlist: [],
      toggleWishlist: (productId) =>
        set((state) => {
          const isFavorited = state.wishlist.includes(productId);
          return {
            wishlist: isFavorited
              ? state.wishlist.filter((id) => id !== productId)
              : [...state.wishlist, productId],
          };
        }),

      // Quick View Initial State
      quickViewProduct: null,
      quickViewOpen: false,
      setQuickViewProduct: (product) => set({ quickViewProduct: product }),
      setQuickViewOpen: (open) => set({ quickViewOpen: open }),

      // Mobile Menu Initial State
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
    }),
    {
      name: 'flowcart-storage',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
      }), // only persist cart and wishlist, not UI toggles
    }
  )
);
