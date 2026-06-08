# FlowCart E-Commerce Landing Page & Dashboard

FlowCart is a modern premium lifestyle e-commerce web application featuring high-end design aesthetics, fluid scroll-triggered and stagger animations, local state persistence, and mock server-side endpoints.

- 🌐 Live Demo: https://flowcart-ecommerce.vercel.app/ 
- 📊 Dashboard: https://flowcart-ecommerce.vercel.app/dashboard

---

## 🛠️ Technology Stack
- **Framework**: Next.js 14+ (App Router) & TypeScript
- **Animations**: GSAP (GreenSock Animation Platform) & GSAP ScrollTrigger
- **Query Management**: TanStack Query (`@tanstack/react-query`)
- **State Management**: Zustand
- **Styling**: Vanilla CSS Modules (custom HSL color palette, dark mode defaults, premium glassmorphism)
- **Icons**: Lucide React

---

## 🚀 Setup & Installation

Follow these steps to run the application locally on your machine:

### 1. Prerequisites
Ensure you have **Node.js 20+** installed (required for modern Next.js environments).

### 2. Install Dependencies
Navigate to the project directory and install the packages:
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

### 4. Build for Production
To build and verify the static compilation of the application:
```bash
npm run build
npm run start
```

---

## 🎭 Animations & Interactions (GSAP)
We use GreenSock (GSAP) to provide fluid, responsive transitions across the site:

1. **Hero Entrance (`src/components/Hero.tsx`)**
   - Staggered entry timeline on initial page load. Title text blocks, subtitles, CTAs, the floating trust badge, and the central hero image fade and slide into place sequentially using a GSAP timeline.
2. **Scroll-Triggered Reveals (`src/components/FeaturedProducts.tsx` & `src/components/PromoBanner.tsx`)**
   - Incorporates `ScrollTrigger` to animate featured product cards and promotional content as they scroll into the viewport. Card elements slide upward with a staggered delay for a clean reveal.
3. **FAQ Collapsible Accordion (`src/components/FAQSection.tsx`)**
   - Expanding FAQ elements animate their height dynamically from `0` to `scrollHeight` using GSAP, providing smooth transition curves instead of jarring layout shifts.
4. **Modal / Drawer Transitions (`src/components/QuickViewModal.tsx` & `src/components/CartDrawer.tsx`)**
   - The Quick-View Modal uses a back-elastic zoom-in transition on trigger. The Cart Drawer utilizes staggered entry transitions for individual cart items when the panel opens.

---

## 🔄 Data Fetching (TanStack Query)
TanStack Query is used to fetch and cache dynamic e-commerce data with simulated latency to show skeleton loaders:

- **Products Query (`src/components/FeaturedProducts.tsx`)**: Fetches items from the local API route `/api/products` with an 800ms synthetic delay. Renders CSS shimmer skeleton cards while loading.
- **FAQ Support Query (`src/components/FAQSection.tsx`)**: Fetches customer FAQs from `/api/faqs` with a 500ms delay. Renders loading skeletons and manages errors with retry flags.

---

## 💾 State Management (Zustand)
Global states are maintained in a Zustand store at `src/store/useStore.ts` with local storage persistence:

- **Shopping Cart**: Stores arrays of selected items, handles quantity incrementing/decrementing, item deletions, totals calculation, and clears the cart on successful checkout.
- **Wishlist**: Toggles favorite product IDs, updating the red heart badges globally.
- **Quick-View Modal**: Stores the currently selected product details and manages the open/close state of the floating preview modal.
- **Slide-out Menus**: Handles global toggles for the Cart Drawer and mobile hamburger menus.

---

## 🎨 Architecture & Design Decisions

### Custom SVG Chart Engines
Instead of adding heavy chart library bundles (like Recharts or ChartJS) which can impact page load speeds, we engineered **custom responsive SVG charts** inside `/dashboard`. We drew line-graphs and radial donut-charts dynamically using SVG math and styled them with HSL theme color tokens. We then animated their paths using GSAP stroke offsets for a lightweight, premium administration dashboard.

### Local Persistence & Safe Hydration
By using Zustand's `persist` middleware, a client's cart and wishlist remain active across sessions. To prevent Next.js SSR hydration warnings (where the server's empty state conflicts with the client's cached cart), we introduced a custom `useHasHydrated` hook that delays client-only UI rendering until the component mounts.

---

## 🔮 Future Improvements

1. Integrate a real backend and payment gateway
2. Add user authentication and order history
3. Implement advanced filtering and search
4. Add product reviews and ratings
5. Expand the dashboard with real-time analytics
6. Improve accessibility and performance optimization
