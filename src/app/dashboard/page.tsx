'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, DollarSign, ShoppingCart, Percent, Users, TrendingUp } from 'lucide-react';
import { gsap } from 'gsap';
import styles from './dashboard.module.css';

interface Order {
  id: string;
  client: string;
  date: string;
  status: 'Completed' | 'Shipped' | 'Pending';
  total: number;
}

const MOCK_ORDERS: Order[] = [
  { id: '#FC-1082', client: 'Olivia Vance', date: 'Jun 08, 2026', status: 'Completed', total: 380.00 },
  { id: '#FC-1081', client: 'Ethan Hunt', date: 'Jun 07, 2026', status: 'Shipped', total: 245.00 },
  { id: '#FC-1080', client: 'Sarah Connor', date: 'Jun 06, 2026', status: 'Pending', total: 65.00 },
  { id: '#FC-1079', client: 'James Smith', date: 'Jun 06, 2026', status: 'Completed', total: 110.00 },
  { id: '#FC-1078', client: 'Elena Rostova', date: 'Jun 05, 2026', status: 'Completed', total: 500.00 },
  { id: '#FC-1077', client: 'Marcus Aurelius', date: 'Jun 04, 2026', status: 'Shipped', total: 180.00 },
  { id: '#FC-1076', client: 'Luna Freya', date: 'Jun 03, 2026', status: 'Completed', total: 135.00 }
];

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const salesPathRef = useRef<SVGPathElement>(null);
  const salesAreaRef = useRef<SVGPolygonElement>(null);

  const filteredOrders = MOCK_ORDERS.filter(
    (order) =>
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // GSAP animations for metrics, charts and tables entrance stagger
  useEffect(() => {
    if (!containerRef.current) return;

    const metrics = containerRef.current.querySelectorAll(`.${styles.metricCard}`);
    const charts = containerRef.current.querySelectorAll(`.${styles.chartCard}`);
    const table = containerRef.current.querySelector(`.${styles.tableCard}`);

    const tl = gsap.timeline();

    tl.fromTo(
      metrics,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' }
    )
      .fromTo(
        charts,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo(
        table,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.2'
      );

    // Animate sales SVG chart path (draw-in effect)
    if (salesPathRef.current) {
      const pathLength = salesPathRef.current.getTotalLength();
      gsap.fromTo(
        salesPathRef.current,
        { strokeDasharray: pathLength, strokeDashoffset: pathLength },
        { strokeDashoffset: 0, duration: 1.5, ease: 'power2.out', delay: 0.5 }
      );
    }

    if (salesAreaRef.current) {
      gsap.fromTo(
        salesAreaRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out', delay: 1 }
      );
    }
  }, []);

  return (
    <div className={styles.dashboard} ref={containerRef}>
      <div className="container">
        {/* Header Row */}
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
              Real-time store metrics, inventory and client activity.
            </p>
          </div>
          <Link href="/" className={styles.backBtn}>
            <ArrowLeft size={16} />
            <span>Back to Store</span>
          </Link>
        </div>

        {/* Metric Cards Grid */}
        <div className={styles.metricsGrid}>
          {/* Card 1: Revenue */}
          <div className={styles.metricCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>Total Revenue</span>
              <div className={styles.iconWrapper}>
                <DollarSign size={18} />
              </div>
            </div>
            <div className={styles.cardVal}>$45,280.00</div>
            <div className={styles.cardTrend}>
              <TrendingUp size={14} className={styles.trendUp} />
              <span className={styles.trendUp}>+12.4%</span>
              <span style={{ color: 'var(--text-muted)' }}>vs last month</span>
            </div>
          </div>

          {/* Card 2: Orders */}
          <div className={styles.metricCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>Orders Processed</span>
              <div className={styles.iconWrapper}>
                <ShoppingCart size={18} />
              </div>
            </div>
            <div className={styles.cardVal}>384</div>
            <div className={styles.cardTrend}>
              <TrendingUp size={14} className={styles.trendUp} />
              <span className={styles.trendUp}>+8.1%</span>
              <span style={{ color: 'var(--text-muted)' }}>vs last month</span>
            </div>
          </div>

          {/* Card 3: Conversion Rate */}
          <div className={styles.metricCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>Conversion Rate</span>
              <div className={styles.iconWrapper}>
                <Percent size={18} />
              </div>
            </div>
            <div className={styles.cardVal}>3.42%</div>
            <div className={styles.cardTrend}>
              <TrendingUp size={14} className={styles.trendUp} />
              <span className={styles.trendUp}>+0.5%</span>
              <span style={{ color: 'var(--text-muted)' }}>vs last month</span>
            </div>
          </div>

          {/* Card 4: Active Clients */}
          <div className={styles.metricCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>Active Clients</span>
              <div className={styles.iconWrapper}>
                <Users size={18} />
              </div>
            </div>
            <div className={styles.cardVal}>1,248</div>
            <div className={styles.cardTrend}>
              <TrendingUp size={14} className={styles.trendUp} />
              <span className={styles.trendUp}>+24.3%</span>
              <span style={{ color: 'var(--text-muted)' }}>vs last month</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className={styles.chartsGrid}>
          {/* Chart 1: Daily Revenue Area Chart */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Daily Sales Performance</h3>
            <div className={styles.chartWrapper}>
              <svg viewBox="0 0 500 200" className={styles.chartSvg}>
                {/* Grids */}
                <line x1="50" y1="40" x2="450" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="50" y1="80" x2="450" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="50" y1="120" x2="450" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="50" y1="160" x2="450" y2="160" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

                {/* Shaded Area Under Curve */}
                <polygon
                  ref={salesAreaRef}
                  points="50,160 50,140 116,110 183,130 250,90 316,70 383,30 450,50 450,160"
                  fill="url(#salesAreaGrad)"
                />

                {/* Line Path */}
                <path
                  ref={salesPathRef}
                  d="M50,140 L116,110 L183,130 L250,90 L316,70 L383,30 L450,50"
                  stroke="var(--primary-color)"
                  strokeWidth="3"
                  fill="none"
                />

                {/* Data Points */}
                <circle cx="50" cy="140" r="4" fill="var(--primary-color)" />
                <circle cx="116" cy="110" r="4" fill="var(--primary-color)" />
                <circle cx="183" cy="130" r="4" fill="var(--primary-color)" />
                <circle cx="250" cy="90" r="4" fill="var(--primary-color)" />
                <circle cx="316" cy="70" r="4" fill="var(--primary-color)" />
                <circle cx="383" cy="30" r="4" fill="var(--primary-color)" />
                <circle cx="450" cy="50" r="4" fill="var(--primary-color)" />

                {/* Y-Axis Labels */}
                <text x="40" y="44" fill="var(--text-muted)" fontSize="9" textAnchor="end">$4k</text>
                <text x="40" y="84" fill="var(--text-muted)" fontSize="9" textAnchor="end">$3k</text>
                <text x="40" y="124" fill="var(--text-muted)" fontSize="9" textAnchor="end">$2k</text>
                <text x="40" y="164" fill="var(--text-muted)" fontSize="9" textAnchor="end">$1k</text>

                {/* X-Axis Labels */}
                <text x="50" y="180" fill="var(--text-muted)" fontSize="10" textAnchor="middle">Mon</text>
                <text x="116" y="180" fill="var(--text-muted)" fontSize="10" textAnchor="middle">Tue</text>
                <text x="183" y="180" fill="var(--text-muted)" fontSize="10" textAnchor="middle">Wed</text>
                <text x="250" y="180" fill="var(--text-muted)" fontSize="10" textAnchor="middle">Thu</text>
                <text x="316" y="180" fill="var(--text-muted)" fontSize="10" textAnchor="middle">Fri</text>
                <text x="383" y="180" fill="var(--text-muted)" fontSize="10" textAnchor="middle">Sat</text>
                <text x="450" y="180" fill="var(--text-muted)" fontSize="10" textAnchor="middle">Sun</text>

                {/* Gradients */}
                <defs>
                  <linearGradient id="salesAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Chart 2: Category Distribution Donut Chart */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Sales by Category</h3>
            <div className={styles.chartWrapper}>
              <svg viewBox="0 0 200 200" style={{ width: '100%', maxWidth: '180px' }}>
                {/* Apparel: 38% (Color: gold) */}
                <circle
                  cx="100"
                  cy="100"
                  r="50"
                  fill="transparent"
                  stroke="var(--primary-color)"
                  strokeWidth="16"
                  strokeDasharray="119.38 194.78"
                  strokeDashoffset="0"
                />

                {/* Accessories: 28% (Color: indigo) */}
                <circle
                  cx="100"
                  cy="100"
                  r="50"
                  fill="transparent"
                  stroke="var(--accent-color)"
                  strokeWidth="16"
                  strokeDasharray="87.96 226.2"
                  strokeDashoffset="-119.38"
                />

                {/* Footwear: 20% (Color: #10b981) */}
                <circle
                  cx="100"
                  cy="100"
                  r="50"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="16"
                  strokeDasharray="62.83 251.33"
                  strokeDashoffset="-207.34"
                />

                {/* Gear: 14% (Color: #ef4444) */}
                <circle
                  cx="100"
                  cy="100"
                  r="50"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="16"
                  strokeDasharray="43.98 270.18"
                  strokeDashoffset="-270.17"
                />
              </svg>
            </div>

            {/* Custom Legend */}
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: 'var(--primary-color)' }}></span>
                <span>Apparel (38%)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: 'var(--accent-color)' }}></span>
                <span>Accessories (28%)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: '#10b981' }}></span>
                <span>Footwear (20%)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: '#ef4444' }}></span>
                <span>Gear (14%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3 className={styles.chartTitle}>Recent Orders</h3>

            {/* Search filter */}
            <div className={styles.searchBar}>
              <Search size={15} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search Client or Order ID"
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className={styles.orderId}>{order.id}</td>
                      <td>{order.client}</td>
                      <td>{order.date}</td>
                      <td>
                        <span
                          className={`${styles.statusPill} ${order.status === 'Completed'
                            ? styles.statusCompleted
                            : order.status === 'Shipped'
                              ? styles.statusShipped
                              : styles.statusPending
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className={styles.totalVal}>${order.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                      No matching orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
