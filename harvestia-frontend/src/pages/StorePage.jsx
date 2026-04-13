/**
 * HARVESTIA — Online Equipment & Supplies Store
 * Buy tractors, harvesters, seeds, tippers and more
 * Inspired by Farming Simulator shop UI
 */

import { useState, useMemo, useEffect } from 'react'
import { ShoppingCart, X, Star, Zap, Gauge, Package, Leaf, Search, SlidersHorizontal, Check, Truck, Shield, RefreshCw } from 'lucide-react'

// ── Optional imports — replace with your actual paths ────────────
// import { useTranslation } from '@store/langStore'
// import { marketplaceAPI } from '@api/client'

// ── Categories ──────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',                    label: 'All Products',          emoji: '🏪' },
  { id: 'tractor',                label: 'Tractors',              emoji: '🚜' },
  { id: 'harvester',              label: 'Harvesters',            emoji: '🌾' },
  { id: 'tipper',                 label: 'Tippers',               emoji: '🚛' },
  { id: 'seed',                   label: 'Seeds',                 emoji: '🌱' },
  { id: 'Plough',                 label: 'Plough',                emoji: '🔧' },
  { id: 'Headers',                label: 'Headers',               emoji: '⚙️' },
  { id: 'cultivators',            label: 'Cultivators',           emoji: '🔧' },
  { id: 'sowing machines',        label: 'Sowing Machines',       emoji: '🔧' },
  { id: 'fertilizer Technology',  label: 'Fertilizer Technology', emoji: '🔧' },
  { id: 'Bale tools',             label: 'Bale Tools',            emoji: '🌀' },
  { id: 'Transports',             label: 'Transports',            emoji: '🚗' },
]

// ── Static fallback products ─────────────────────────────────────
const PRODUCTS = [
  // ── TRACTORS ──
  {
    id: 1, category: 'tractor', brand: 'Lindner', name: 'Lintrac 90',
    price: 75000, salePrice: 56250, image: '/lintrac90.jpg',
    hp: 102, speed: 40, capacity: null,
    rating: 4.7, reviews: 128,
    badge: 'BESTSELLER',
    color: '#e63946',
    desc: 'All-terrain 4-wheel drive tractor. Perfect for hilly farmlands and medium-scale operations.',
    specs: { 'Engine': '4-cyl Diesel', 'Drive': '4WD', 'PTO': '540/1000 RPM', 'Lift': '4,200 kg' },
  },
  {
    id: 2, category: 'tractor', brand: 'Mahindra', name: 'Arjun 605 DI',
    price: 820000, salePrice: null, image: '/Arjun 605 DI.jpg',
    hp: 57, speed: 32, capacity: null,
    rating: 4.8, reviews: 342,
    badge: 'POPULAR',
    color: '#e63946',
    desc: "India's most trusted tractor. Robust engine, low maintenance, ideal for diverse Indian soil.",
    specs: { 'Engine': '3-cyl Diesel', 'Drive': '2WD/4WD', 'PTO': '540 RPM', 'Lift': '1,800 kg' },
  },
  {
    id: 3, category: 'tractor', brand: 'John Deere', name: '5050D',
    price: 1100000, salePrice: 890000, image: '/5050D.jpg',
    hp: 290, speed: 60, capacity: null,
    rating: 4.6, reviews: 215,
    badge: 'SALE',
    color: '#22c55e',
    desc: 'Reliable and fuel-efficient. Comes with Power Reverser transmission for easy headland turns.',
    specs: { 'Engine': '3-cyl Diesel', 'Drive': '4WD', 'PTO': '540/1000 RPM', 'Lift': '1,800 kg' },
  },
  {
    id: 4, category: 'tractor', brand: 'Massey Ferguson', name: 'MF 5610',
    price: 5000000, salePrice: null, image: '/Mf5610.jpg',
    hp: 105, speed: 42, capacity: null,
    rating: 4.5, reviews: 89,
    badge: 'NEW',
    color: '#f97316',
    desc: 'The front loader on this tractor allows you to attach bale and log forks.',
    specs: { 'Engine': '4-cyl Turbo', 'Drive': '4WD', 'PTO': '540/1000 RPM', 'Lift': '5,500 kg' },
  },
  {
    id: 5, category: 'tractor', brand: 'Hurlimann', name: 'XM T4I130',
    price: 5676400, salePrice: null, image: '/XM T4I130.jpg',
    hp: 130, speed: 42, capacity: null,
    rating: 4.5, reviews: 89,
    badge: 'NEW',
    color: '#f97316',
    desc: 'The front loader on this tractor allows you to attach bale and log forks.',
    specs: { 'Engine': '4-cyl Turbo', 'Drive': '4WD', 'PTO': '540/1000 RPM', 'Lift': '5,500 kg' },
  },
  {
    id: 6, category: 'tractor', brand: 'JCB', name: 'Fastrac 3230Xtra',
    price: 8276400, salePrice: null, image: '/fastrac 3230 xtra.jpg',
    hp: 230, speed: 60, capacity: null,
    rating: 4.5, reviews: 120,
    badge: 'NEW',
    color: '#f97316',
    desc: 'The front loader on this tractor allows you to attach bale and log forks.',
    specs: { 'Engine': '4-cyl Turbo', 'Drive': '4WD', 'PTO': '540/1000 RPM', 'Lift': '5,500 kg' },
  },

  // ── HARVESTERS ──
  {
    id: 7, category: 'harvester', brand: 'Claas', name: 'Lexion 770',
    price: 16804480, salePrice: 14800000, image: '/Lexion 770.jpg',
    hp: 580, speed: 20, capacity: 17000,
    rating: 4.9, reviews: 167,
    badge: 'PREMIUM',
    color: '#eab308',
    desc: "World's most efficient combine harvester. CEMOS auto-optimization reduces grain losses by 10%.",
    specs: { 'Threshing': 'APS Synflow', 'Tank': '17,000 L', 'Header': '9.2 m', 'GPS': 'CLAAS GPS Pilot' },
  },
  {
    id: 8, category: 'harvester', brand: 'PREET', name: '987 Combine',
    price: 2350000, salePrice: 2120000, image: '/987 Combine.png',
    hp: 101, speed: 25, capacity: 2500,
    rating: 4.4, reviews: 183,
    badge: 'SALE',
    color: '#f97316',
    desc: 'Made in India combine harvester. Excellent for wheat, paddy and soybean harvesting.',
    specs: { 'Threshing': 'Axial Flow', 'Tank': '2,500 L', 'Header': '3.6 m', 'Feed': 'Chain + Drum' },
  },
  {
    id: 9, category: 'harvester', brand: 'New Holland', name: 'TC 5.90',
    price: 4000000, salePrice: null, image: '/tc 9.png',
    hp: 259, speed: 25, capacity: 7600,
    rating: 4.7, reviews: 94,
    badge: 'NEW',
    color: '#3b82f6',
    desc: 'Automated settings and IntelliSense technology for perfect grain quality every harvest.',
    specs: { 'Threshing': 'Twin Rotors', 'Tank': '7,600 L', 'Header': '6.1 m', 'AutoLube': 'Yes' },
  },

  // ── TIPPERS ──
  {
    id: 10, category: 'tipper', brand: 'Metaltech', name: 'DB8000',
    price: 3200000, salePrice: 2950000, image: '/Metaltech.png',
    hp: 280, speed: 85, capacity: 25000,
    rating: 4.6, reviews: 156,
    badge: 'SALE',
    color: '#3b82f6',
    desc: 'Heavy-duty tipper for farm-to-mandi transport. 25-ton payload, air-suspension for smooth hauls.',
    specs: { 'Payload': '25,000 kg', 'Body': 'Steel', 'Axles': 'Tri-axle', 'GVW': '38,000 kg' },
  },
  {
    id: 11, category: 'tipper', brand: 'Mahindra', name: 'Blazo 37 Tipper',
    price: 2800000, salePrice: null, image: '/Blazo 37 Tipper.png',
    hp: 370, speed: 90, capacity: 20000,
    rating: 4.5, reviews: 78,
    badge: 'POPULAR',
    color: '#e63946',
    desc: 'Heavy haulage tipper with mFalcon engine. Best-in-class fuel efficiency for long hauls.',
    specs: { 'Payload': '20,000 kg', 'Body': 'AR Steel', 'Axles': 'Bi-axle', 'GVW': '31,000 kg' },
  },
  {
    id: 12, category: 'tipper', brand: 'Landforce', name: 'Landforce Tipping',
    price: 55000, salePrice: null, image: '/Traveller Trax.png',
    hp: 140, speed: 75, capacity: 5000,
    rating: 4.3, reviews: 212,
    badge: 'SALE',
    color: '#8b5cf6',
    desc: 'Compact farm tipper. Easy to maneuver in fields. Perfect for small-to-medium farms.',
    specs: { 'Payload': '5,000 kg', 'Body': 'MS Steel', 'Axles': 'Single', 'GVW': '7,500 kg' },
  },

  // ── SEEDS ──
  {
    id: 13, category: 'seed', brand: 'Kaveri', name: 'Hybrid Wheat KW-317',
    price: 1200, salePrice: null, emoji: '🌾',
    hp: null, speed: null, capacity: null,
    rating: 4.8, reviews: 892,
    badge: 'BESTSELLER',
    color: '#eab308',
    desc: 'High-yield semi-dwarf wheat variety. Resistant to rust and powdery mildew. 25% more yield.',
    specs: { 'Yield': '6.5 t/ha', 'Maturity': '110 days', 'Bag': '40 kg', 'Season': 'Rabi' },
  },
  {
    id: 14, category: 'seed', brand: 'Syngenta', name: 'NK-6240 Maize',
    price: 3500, salePrice: 3150, emoji: '🌽',
    hp: null, speed: null, capacity: null,
    rating: 4.7, reviews: 567,
    badge: 'SALE',
    color: '#eab308',
    desc: 'Top hybrid maize seed with excellent standability and disease resistance. Kharif season.',
    specs: { 'Yield': '9.2 t/ha', 'Maturity': '95 days', 'Bag': '20 kg', 'Season': 'Kharif' },
  },
  {
    id: 15, category: 'seed', brand: 'Bayer', name: 'Arize 6444 Gold Rice',
    price: 2800, salePrice: null, emoji: '🍚',
    hp: null, speed: null, capacity: null,
    rating: 4.9, reviews: 1240,
    badge: 'TOP RATED',
    color: '#22c55e',
    desc: 'Premium hybrid rice with excellent blast resistance. Superior grain quality for premium markets.',
    specs: { 'Yield': '8.5 t/ha', 'Maturity': '125 days', 'Bag': '6 kg', 'Season': 'Kharif' },
  },
  {
    id: 16, category: 'seed', brand: 'Rasi', name: 'Soybean RS-11',
    price: 1800, salePrice: 1620, emoji: '🫘',
    hp: null, speed: null, capacity: null,
    rating: 4.5, reviews: 334,
    badge: 'SALE',
    color: '#84cc16',
    desc: 'High-protein soybean variety with excellent pod retention and lodging resistance.',
    specs: { 'Yield': '3.2 t/ha', 'Maturity': '95 days', 'Bag': '30 kg', 'Season': 'Kharif' },
  },

  // ── PLOUGH ──
  {
    id: 17, category: 'Plough', brand: 'Landforce', name: 'Reversible Mould Board',
    price: 25000, salePrice: null, image: '/Reversible Mould Board.png',
    hp: 70, speed: null, capacity: null,
    rating: 4.6, reviews: 289,
    badge: 'SALE',
    color: '#6b7280',
    desc: '6-ft heavy-duty rotavator for deep tillage. Works with 45-60 HP tractors. Side gear drive.',
    specs: { 'Width': '6 ft', 'Blades': '48 L-type', 'Depth': '15 cm', 'PTO': '540 RPM' },
  },
  {
    id: 18, category: 'Plough', brand: 'Soil Master', name: 'Chisel Plough',
    price: 65000, salePrice: null, image: '/chisel.png',
    hp: null, speed: null, capacity: null,
    rating: 4.4, reviews: 167,
    badge: 'NEW',
    color: '#f97316',
    desc: 'Soil Master Chisel Plough is one of the best and most powerful ploughs in the Indian agriculture market. Made with finest quality materials and latest technology.',
    specs: { 'Output': '800 kg/hr', 'Crops': '4 types', 'Power': '7.5 HP', 'Drive': 'Belt' },
  },

  // ── HEADERS ──
  {
    id: 19, category: 'Headers', brand: 'New Holland', name: 'Varifeed 18ft',
    price: 3000000, salePrice: null, image: '/varifeed 18 ft.png',
    hp: null, speed: null, capacity: null,
    rating: 4.4, reviews: 167,
    badge: 'NEW',
    color: '#f97316',
    desc: 'A high-performance header specially designed for maize harvesting.',
    specs: { 'Output': '800 kg/hr', 'Crops': '4 types', 'Power': '7.5 HP', 'Drive': 'Belt' },
  },
  {
    id: 20, category: 'Headers', brand: 'PREET', name: '987 Corn Header',
    price: 4000000, salePrice: null, image: '/987 corn.png',
    hp: null, speed: null, capacity: null,
    rating: 4.4, reviews: 167,
    badge: 'NEW',
    color: '#f97316',
    desc: 'A high-performance header specially designed for maize and corn harvesting.',
    specs: { 'Output': '800 kg/hr', 'Crops': '4 types', 'Power': '7.5 HP', 'Drive': 'Belt' },
  },
  {
    id: 21, category: 'Headers', brand: 'Claas', name: 'Lexion Header',
    price: 5000000, salePrice: null, image: '/headers Lexion.png',
    hp: null, speed: null, capacity: null,
    rating: 4.4, reviews: 167,
    badge: 'NEW',
    color: '#f97316',
    desc: 'Premium Claas header for Lexion combine harvesters. Maximum efficiency and grain retention.',
    specs: { 'Output': '800 kg/hr', 'Crops': '4 types', 'Power': '7.5 HP', 'Drive': 'Belt' },
  },

  // ── CULTIVATORS ──
  {
    id: 22, category: 'cultivators', brand: 'Fieldking', name: 'Rigid Cultivator',
    price: 65000, salePrice: null, image: '/Rigid.png',
    hp: null, speed: null, capacity: null,
    rating: 4.4, reviews: 167,
    badge: 'NEW',
    color: '#f97316',
    desc: 'Heavy-duty rigid cultivator for primary and secondary tillage. Built for tough Indian fields.',
    specs: { 'Output': '800 kg/hr', 'Crops': '4 types', 'Power': '7.5 HP', 'Drive': 'Belt' },
  },
  {
    id: 23, category: 'cultivators', brand: 'Sonalika', name: '11 Tyne Cultivator',
    price: 65000, salePrice: null, image: '/11Tyne.png',
    hp: null, speed: null, capacity: null,
    rating: 4.4, reviews: 167,
    badge: 'NEW',
    color: '#f97316',
    desc: '11-tyne heavy-duty cultivator for efficient soil preparation and weed control.',
    specs: { 'Output': '800 kg/hr', 'Crops': '4 types', 'Power': '7.5 HP', 'Drive': 'Belt' },
  },
  {
    id: 24, category: 'cultivators', brand: 'Landforce', name: 'Chisel Cultivator',
    price: 65000, salePrice: null, image: '/chisel.png',
    hp: null, speed: null, capacity: null,
    rating: 4.4, reviews: 167,
    badge: 'NEW',
    color: '#f97316',
    desc: 'Chisel-type cultivator for deep soil loosening without inverting. Conserves moisture.',
    specs: { 'Output': '800 kg/hr', 'Crops': '4 types', 'Power': '7.5 HP', 'Drive': 'Belt' },
  },
  {
    id: 25, category: 'cultivators', brand: 'John Deere', name: 'Spring Type Cultivator',
    price: 65000, salePrice: null, image: '/Spring Type.png',
    hp: null, speed: null, capacity: null,
    rating: 4.4, reviews: 167,
    badge: 'NEW',
    color: '#f97316',
    desc: 'Spring-loaded tyne cultivator. Absorbs shocks in rocky terrain. Ideal for light tillage.',
    specs: { 'Output': '800 kg/hr', 'Crops': '4 types', 'Power': '7.5 HP', 'Drive': 'Belt' },
  },

  // ── SOWING MACHINES ──
  {
    id: 26, category: 'sowing machines', brand: 'John Deere', name: 'Seed Drill 7000',
    price: 65000, salePrice: null, image: '/Spring Type.png',
    hp: null, speed: null, capacity: null,
    rating: 4.4, reviews: 167,
    badge: 'NEW',
    color: '#f97316',
    desc: 'Precision seed drill for accurate row spacing and seed depth. Suitable for all major crops.',
    specs: { 'Output': '800 kg/hr', 'Crops': '4 types', 'Power': '7.5 HP', 'Drive': 'Belt' },
  },
  {
    id: 27, category: 'sowing machines', brand: 'John Deere', name: 'No-Till Drill Pro',
    price: 65000, salePrice: null, image: '/Spring Type.png',
    hp: null, speed: null, capacity: null,
    rating: 4.4, reviews: 167,
    badge: 'NEW',
    color: '#f97316',
    desc: 'No-till sowing machine for minimum soil disturbance. Saves fuel and preserves soil structure.',
    specs: { 'Output': '800 kg/hr', 'Crops': '4 types', 'Power': '7.5 HP', 'Drive': 'Belt' },
  },
  {
    id: 28, category: 'sowing machines', brand: 'John Deere', name: 'Multi Crop Planter',
    price: 65000, salePrice: null, image: '/Spring Type.png',
    hp: null, speed: null, capacity: null,
    rating: 4.4, reviews: 167,
    badge: 'NEW',
    color: '#f97316',
    desc: 'Versatile planter suitable for maize, sunflower, soybean and other row crops.',
    specs: { 'Output': '800 kg/hr', 'Crops': '4 types', 'Power': '7.5 HP', 'Drive': 'Belt' },
  },

  // ── TRANSPORTS ──
  {
    id: 29, category: 'Transports', brand: 'Lizard', name: 'Pickup TT',
    price: 1000000, salePrice: null, image: '/pickup.png',
    hp: 210, speed: 150, capacity: null,
    rating: 4.9, reviews: 167,
    badge: 'NEW',
    color: '#f97316',
    desc: 'Fast farm pickup truck. Ideal for quick transport across large farm estates.',
    specs: { 'Payload': '200 kg', 'Power': '210 HP', 'Drive': '4WD' },
  },
  {
    id: 30, category: 'Transports', brand: 'Joskin', name: 'Betimax RDS 7500',
    price: 3700000, salePrice: null, image: '/betimax rds 7500.png',
    hp: 210, speed: 150, capacity: null,
    rating: 4.9, reviews: 167,
    badge: 'NEW',
    color: '#f97316',
    desc: 'Livestock transport trailer. Comfortable and safe transport for cattle and goats.',
    specs: { 'Animals': '🐄 🐐', 'Power': '210 HP', 'Drive': 'Belt' },
  },
  {
    id: 31, category: 'Transports', brand: 'Tata', name: 'Tata Prima',
    price: 5500000, salePrice: null, image: '/Tata Prima.png',
    hp: 410, speed: 90, capacity: null,
    rating: 4.9, reviews: 167,
    badge: 'NEW',
    color: '#f97316',
    desc: 'Heavy-duty prime mover for bulk agricultural goods. Powerful and reliable on highways.',
    specs: { 'Payload': '800 kg/hr', 'Power': '410 HP', 'Drive': 'Belt' },
  },

  // ── BALE TOOLS ──
  {
    id: 32, category: 'Bale tools', brand: 'Sonalika', name: 'SLRB 9',
    price: 500000, salePrice: null, image: '/SLRB 9.png',
    hp: null, speed: null, capacity: null,
    rating: 4.9, reviews: 167,
    badge: 'NEW',
    color: '#f97316',
    desc: 'Round baler for efficient baling of straw, hay and silage. Compact and reliable design.',
    specs: { 'Output': '800 kg/hr', 'Crops': '3 types', 'Drive': 'Belt' },
  },
]

// ── Badge Styles ─────────────────────────────────────────────────
const BADGE_STYLES = {
  BESTSELLER: { bg: '#16a34a', color: '#fff' },
  POPULAR:    { bg: '#2563eb', color: '#fff' },
  SALE:       { bg: '#dc2626', color: '#fff' },
  NEW:        { bg: '#7c3aed', color: '#fff' },
  PREMIUM:    { bg: '#b45309', color: '#fff' },
  'TOP RATED':{ bg: '#0891b2', color: '#fff' },
}

function fmtPrice(n) {
  if (!n && n !== 0) return '—'
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000)   return `₹${(n / 1000).toFixed(0)}K`
  return `₹${n.toLocaleString()}`
}

// ── Product Image / Emoji Display ───────────────────────────────
function ProductMedia({ product, height = 130 }) {
  const [imgError, setImgError] = useState(false)

  const showImage = product.image && !imgError

  return (
    <div style={{
      height,
      background: `radial-gradient(ellipse at center,${product.color}18 0%,transparent 70%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderBottom: '1px solid rgba(74,222,128,.06)',
      overflow: 'hidden',
    }}>
      {showImage ? (
        <img
          src={product.image}
          alt={product.name}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{ fontSize: 60 }}>{product.emoji || '📦'}</span>
      )}
    </div>
  )
}

// ── Product Card ─────────────────────────────────────────────────
function ProductCard({ product, onAdd, inCart }) {
  const discount = product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : null

  return (
    <div
      style={{
        background: 'linear-gradient(160deg,#071409 0%,#0c1f10 100%)',
        border: `1px solid ${inCart ? 'rgba(74,222,128,.4)' : 'rgba(74,222,128,.1)'}`,
        borderRadius: 16, overflow: 'hidden', position: 'relative',
        transition: 'transform .2s,box-shadow .2s',
        boxShadow: inCart ? '0 0 20px rgba(74,222,128,.1)' : 'none',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = inCart ? '0 0 20px rgba(74,222,128,.1)' : 'none' }}
    >
      {product.badge && BADGE_STYLES[product.badge] && (
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, ...BADGE_STYLES[product.badge], padding: '3px 9px', borderRadius: 6, fontSize: 9, fontWeight: 800, letterSpacing: '.08em', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          {product.badge}
        </div>
      )}
      {discount && (
        <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, background: '#dc2626', color: '#fff', padding: '3px 8px', borderRadius: 20, fontSize: 10, fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          -{discount}%
        </div>
      )}

      {/* Image or Emoji */}
      <ProductMedia product={product} />

      <div style={{ padding: '14px 14px 16px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: '#3a5e46', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 4 }}>
          {product.brand}
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#e2f5e8', fontFamily: "'Familjen Grotesk',sans-serif", marginBottom: 6, lineHeight: 1.2 }}>
          {product.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} size={10} fill={s <= Math.round(product.rating) ? '#eab308' : 'none'} color='#eab308' />
          ))}
          <span style={{ fontSize: 10, color: '#4a7a58', marginLeft: 2 }}>{product.rating} ({product.reviews})</span>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {product.hp       && <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#5a8a6a', fontWeight: 600 }}><Zap size={11} color='#4ade80' />{product.hp} HP</div>}
          {product.speed    && <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#5a8a6a', fontWeight: 600 }}><Gauge size={11} color='#4ade80' />{product.speed} km/h</div>}
          {product.capacity && <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#5a8a6a', fontWeight: 600 }}><Package size={11} color='#4ade80' />{(product.capacity / 1000).toFixed(0)}T</div>}
          {product.specs && Object.entries(product.specs).slice(0, 2).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#4a7a58' }}><Leaf size={9} color='#4ade80' />{v}</div>
          ))}
        </div>
        <div style={{ marginBottom: 12 }}>
          {product.salePrice ? (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#4ade80', fontFamily: "'Familjen Grotesk',sans-serif" }}>{fmtPrice(product.salePrice)}</span>
              <span style={{ fontSize: 13, color: '#2a4a35', textDecoration: 'line-through' }}>{fmtPrice(product.price)}</span>
            </div>
          ) : (
            <span style={{ fontSize: 20, fontWeight: 900, color: '#4ade80', fontFamily: "'Familjen Grotesk',sans-serif" }}>{fmtPrice(product.price)}</span>
          )}
        </div>
        <button
          onClick={() => onAdd(product)}
          style={{ width: '100%', padding: '9px 0', borderRadius: 10, border: 'none', background: inCart ? 'linear-gradient(135deg,#166534,#16a34a)' : 'linear-gradient(135deg,#14532d,#15803d)', color: inCart ? '#bbf7d0' : '#4ade80', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all .2s', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
        >
          {inCart ? <><Check size={14} /> Added to Cart</> : <><ShoppingCart size={14} /> Add to Cart</>}
        </button>
      </div>
    </div>
  )
}

// ── Cart Item Media (image or emoji) ─────────────────────────────
function CartItemMedia({ item }) {
  const [imgError, setImgError] = useState(false)
  if (item.image && !imgError) {
    return (
      <img
        src={item.image}
        alt={item.name}
        onError={() => setImgError(true)}
        style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
      />
    )
  }
  return <div style={{ fontSize: 32, flexShrink: 0, width: 48, textAlign: 'center' }}>{item.emoji || '📦'}</div>
}

// ── Cart Drawer ───────────────────────────────────────────────────
function CartDrawer({ items, onRemove, onClose, onCheckout }) {
  const total = items.reduce((s, i) => s + (i.salePrice || i.price), 0)
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex' }}>
      <div style={{ flex: 1, background: 'rgba(0,0,0,.6)' }} onClick={onClose} />
      <div style={{ width: 380, background: 'linear-gradient(180deg,#050e07,#071409)', borderLeft: '1px solid rgba(74,222,128,.15)', display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(0,0,0,.5)' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(74,222,128,.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#e2f5e8', fontFamily: "'Familjen Grotesk',sans-serif" }}>🛒 Your Cart</div>
            <div style={{ fontSize: 11, color: '#3a5e46', marginTop: 2 }}>{items.length} item{items.length !== 1 ? 's' : ''}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a7a58', padding: 4 }}><X size={20} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#2a4a35' }}>
              <div style={{ fontSize: 48 }}>🛒</div>
              <div style={{ marginTop: 12, fontSize: 14 }}>Cart is empty</div>
            </div>
          ) : items.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', marginBottom: 8, background: 'rgba(74,222,128,.04)', border: '1px solid rgba(74,222,128,.08)', borderRadius: 12 }}>
              <CartItemMedia item={item} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: '#3a5e46', fontWeight: 600 }}>{item.brand}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#c8e6cc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#4ade80', marginTop: 2 }}>{fmtPrice(item.salePrice || item.price)}</div>
              </div>
              <button onClick={() => onRemove(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: 6, borderRadius: 8, flexShrink: 0 }}><X size={14} /></button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div style={{ padding: '16px 24px 24px', borderTop: '1px solid rgba(74,222,128,.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 16 }}>
              {[[Truck, 'Free Delivery'], [Shield, 'Warranty'], [RefreshCw, 'Easy Return']].map(([Icon, label]) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <Icon size={16} color='#4ade80' />
                  <span style={{ fontSize: 9, color: '#3a5e46', fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ color: '#5a8a6a', fontSize: 14, fontWeight: 600 }}>Total</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#4ade80', fontFamily: "'Familjen Grotesk',sans-serif" }}>{fmtPrice(total)}</span>
            </div>
            <button
              onClick={onCheckout}
              style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#16a34a,#4ade80)', color: '#04100a', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: "'Familjen Grotesk',sans-serif" }}>
              Proceed to Checkout →
            </button>
            <button style={{ width: '100%', padding: '10px 0', borderRadius: 12, border: '1px solid rgba(74,222,128,.15)', background: 'transparent', color: '#4a7a58', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginTop: 8 }} onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Payment Page ─────────────────────────────────────────────────
function PaymentPage({ items, onBack, onClose }) {
  const total = items.reduce((s, i) => s + (i.salePrice || i.price), 0)
  const [step, setStep] = useState('address') // 'address' | 'payment' | 'success'
  const [selectedMethod, setSelectedMethod] = useState('')
  const [address, setAddress] = useState({
    name: '', phone: '', pincode: '', city: '', state: '', address: '',
  })
  const [cardNum, setCardNum] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCVV, setCardCVV] = useState('')
  const [upiId, setUpiId] = useState('')
  const [emiMonths, setEmiMonths] = useState(3)
  const [bank, setBank] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [showPromo, setShowPromo] = useState(false)
  const promoDiscount = promoApplied ? Math.round(total * 0.05) : 0
  const finalTotal = total - promoDiscount

  const s = {
    overlay: { position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
    modal: { width: '100%', maxWidth: 480, maxHeight: '92vh', overflowY: 'auto', background: 'linear-gradient(160deg,#050e07,#071409)', border: '1px solid rgba(74,222,128,.18)', borderRadius: 20, boxShadow: '0 24px 80px rgba(0,0,0,.6)', display: 'flex', flexDirection: 'column' },
    header: { padding: '18px 20px 14px', borderBottom: '1px solid rgba(74,222,128,.1)', display: 'flex', alignItems: 'center', gap: 12 },
    section: { background: 'rgba(74,222,128,.03)', border: '1px solid rgba(74,222,128,.08)', borderRadius: 12, padding: '14px 16px', marginBottom: 12 },
    label: { fontSize: 11, fontWeight: 700, color: '#3a5e46', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 },
    input: { width: '100%', padding: '10px 12px', background: 'rgba(74,222,128,.06)', border: '1px solid rgba(74,222,128,.15)', borderRadius: 9, color: '#c8e6cc', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 8 },
    radioRow: (active) => ({ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: `1px solid ${active ? '#22c55e' : 'rgba(74,222,128,.1)'}`, background: active ? 'rgba(34,197,94,.07)' : 'rgba(74,222,128,.02)', cursor: 'pointer', marginBottom: 8, transition: 'all .15s' }),
    dot: (active) => ({ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${active ? '#22c55e' : '#3a5e46'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }),
    innerDot: { width: 9, height: 9, borderRadius: '50%', background: '#22c55e' },
    btnGreen: { width: '100%', padding: '13px 0', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#16a34a,#4ade80)', color: '#04100a', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: "'Familjen Grotesk',sans-serif" },
    sectionTitle: { fontSize: 12, fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 },
  }

  // ── Step: Address ─────────────────────────────────────────────
  if (step === 'address') return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.header}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a7a58', padding: 2 }}><X size={20} /></button>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#e2f5e8', fontFamily: "'Familjen Grotesk',sans-serif" }}>Delivery Address</div>
            <div style={{ fontSize: 11, color: '#3a5e46', marginTop: 1 }}>Where should we deliver?</div>
          </div>
        </div>
        <div style={{ padding: '16px 20px 20px', overflowY: 'auto' }}>
          {/* Order summary mini */}
          <div style={{ ...s.section, marginBottom: 16 }}>
            <div style={s.sectionTitle}>📦 Order Summary</div>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#a8d5b0' }}>{item.brand} {item.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#4ade80' }}>{fmtPrice(item.salePrice || item.price)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(74,222,128,.1)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#c8e6cc' }}>Total</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#4ade80' }}>{fmtPrice(total)}</span>
            </div>
          </div>

          <div style={s.sectionTitle}>👤 Contact Details</div>
          <input style={s.input} placeholder="Full Name" value={address.name} onChange={e => setAddress(a => ({ ...a, name: e.target.value }))} />
          <input style={s.input} placeholder="Phone Number" type="tel" maxLength={10} value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} />

          <div style={{ ...s.sectionTitle, marginTop: 4 }}>📍 Delivery Address</div>
          <input style={s.input} placeholder="House / Flat / Street" value={address.address} onChange={e => setAddress(a => ({ ...a, address: e.target.value }))} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input style={{ ...s.input, marginBottom: 0 }} placeholder="City" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
            <input style={{ ...s.input, marginBottom: 0 }} placeholder="State" value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} />
          </div>
          <input style={{ ...s.input, marginTop: 8 }} placeholder="PIN Code" maxLength={6} value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} />

          <button
            style={{ ...s.btnGreen, marginTop: 8, opacity: (address.name && address.phone && address.address && address.city && address.pincode) ? 1 : 0.5 }}
            onClick={() => { if (address.name && address.phone && address.address && address.city && address.pincode) setStep('payment') }}
          >
            Continue to Payment →
          </button>
        </div>
      </div>
    </div>
  )

  // ── Step: Success ─────────────────────────────────────────────
  if (step === 'success') return (
    <div style={s.overlay}>
      <div style={{ ...s.modal, alignItems: 'center', padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#4ade80', fontFamily: "'Familjen Grotesk',sans-serif", marginBottom: 8 }}>Order Placed!</div>
        <div style={{ fontSize: 14, color: '#5a8a6a', marginBottom: 4 }}>Thank you, {address.name}!</div>
        <div style={{ fontSize: 13, color: '#3a5e46', marginBottom: 24 }}>
          Delivering to {address.address}, {address.city} — {address.pincode}
        </div>
        <div style={{ background: 'rgba(74,222,128,.06)', border: '1px solid rgba(74,222,128,.15)', borderRadius: 12, padding: '14px 20px', marginBottom: 24, width: '100%' }}>
          <div style={{ fontSize: 13, color: '#5a8a6a' }}>Amount Paid</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#4ade80', fontFamily: "'Familjen Grotesk',sans-serif" }}>{fmtPrice(finalTotal)}</div>
          <div style={{ fontSize: 11, color: '#3a5e46', marginTop: 4 }}>via {selectedMethod === 'gpay' ? 'Google Pay' : selectedMethod === 'upi' ? 'UPI' : selectedMethod === 'card' ? 'Card' : selectedMethod === 'emi' ? 'EMI' : selectedMethod === 'netbanking' ? 'Net Banking' : 'Cash on Delivery'}</div>
        </div>
        <div style={{ fontSize: 12, color: '#3a5e46', marginBottom: 20 }}>🚚 Estimated delivery: 3–5 business days</div>
        <button style={s.btnGreen} onClick={onClose}>Back to Store</button>
      </div>
    </div>
  )

  // ── Step: Payment ─────────────────────────────────────────────
  const METHODS = [
    { id: 'gpay',       label: 'Google Pay',              icon: '🟢', sub: 'UPI' },
    { id: 'upi',        label: 'Pay by any UPI App',       icon: '📱', sub: 'PhonePe, Paytm & more' },
    { id: 'card',       label: 'Credit / Debit Card',      icon: '💳', sub: 'Visa, Mastercard, RuPay' },
    { id: 'emi',        label: 'EMI',                      icon: '📅', sub: 'Easy monthly installments' },
    { id: 'netbanking', label: 'Net Banking',              icon: '🏦', sub: 'All major banks' },
    { id: 'cod',        label: 'Cash on Delivery',         icon: '💵', sub: 'Pay when you receive' },
  ]

  const canPay = () => {
    if (!selectedMethod) return false
    if (selectedMethod === 'upi' && upiId.length < 5) return false
    if (selectedMethod === 'card' && (cardNum.length < 16 || cardExpiry.length < 5 || cardCVV.length < 3)) return false
    if (selectedMethod === 'netbanking' && !bank) return false
    return true
  }

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.header}>
          <button onClick={() => setStep('address')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a7a58', padding: 2 }}><X size={20} /></button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#e2f5e8', fontFamily: "'Familjen Grotesk',sans-serif" }}>Payment</div>
            <div style={{ fontSize: 11, color: '#3a5e46', marginTop: 1 }}>Choose how you'd like to pay</div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#4ade80', fontFamily: "'Familjen Grotesk',sans-serif" }}>{fmtPrice(finalTotal)}</div>
        </div>

        <div style={{ padding: '14px 20px 20px', overflowY: 'auto' }}>

          {/* Delivery Address strip */}
          <div style={{ ...s.section, display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>📍</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#4ade80', marginBottom: 2 }}>Delivering to {address.name}</div>
              <div style={{ fontSize: 12, color: '#5a8a6a', lineHeight: 1.5 }}>{address.address}, {address.city}, {address.state} — {address.pincode}</div>
              <span style={{ fontSize: 11, color: '#22c55e', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setStep('address')}>Change address</span>
            </div>
          </div>

          {/* Promo Code */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '10px 14px', background: 'rgba(74,222,128,.04)', border: '1px solid rgba(74,222,128,.1)', borderRadius: 10 }} onClick={() => setShowPromo(p => !p)}>
              <span style={{ fontSize: 13, color: '#a8d5b0', fontWeight: 600 }}>🎟️ Add Promo Code</span>
              <span style={{ fontSize: 12, color: '#3a5e46' }}>{showPromo ? '▲' : '▼'}</span>
            </div>
            {showPromo && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input style={{ ...s.input, marginBottom: 0, flex: 1 }} placeholder="Enter code (try HARVESTIA5)" value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} />
                <button style={{ padding: '10px 14px', background: 'rgba(74,222,128,.12)', border: '1px solid rgba(74,222,128,.2)', borderRadius: 9, color: '#4ade80', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => { if (promoCode === 'HARVESTIA5') setPromoApplied(true) }}>
                  Apply
                </button>
              </div>
            )}
            {promoApplied && (
              <div style={{ fontSize: 12, color: '#22c55e', marginTop: 6, fontWeight: 600 }}>✅ HARVESTIA5 applied — ₹{promoDiscount.toLocaleString()} off!</div>
            )}
          </div>

          {/* UPI section */}
          <div style={s.sectionTitle}>UPI</div>
          {METHODS.filter(m => ['gpay', 'upi'].includes(m.id)).map(m => (
            <div key={m.id} style={s.radioRow(selectedMethod === m.id)} onClick={() => setSelectedMethod(m.id)}>
              <div style={s.dot(selectedMethod === m.id)}>{selectedMethod === m.id && <div style={s.innerDot} />}</div>
              <span style={{ fontSize: 18 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#c8e6cc' }}>{m.label}</div>
                <div style={{ fontSize: 11, color: '#4a7a58' }}>{m.sub}</div>
              </div>
            </div>
          ))}
          {selectedMethod === 'upi' && (
            <input style={{ ...s.input, marginTop: 2 }} placeholder="Enter UPI ID (e.g. name@upi)" value={upiId} onChange={e => setUpiId(e.target.value)} />
          )}

          {/* Card */}
          <div style={{ ...s.sectionTitle, marginTop: 8 }}>CREDIT & DEBIT CARDS</div>
          {METHODS.filter(m => m.id === 'card').map(m => (
            <div key={m.id} style={s.radioRow(selectedMethod === m.id)} onClick={() => setSelectedMethod(m.id)}>
              <div style={s.dot(selectedMethod === m.id)}>{selectedMethod === m.id && <div style={s.innerDot} />}</div>
              <span style={{ fontSize: 18 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#c8e6cc' }}>{m.label}</div>
                <div style={{ fontSize: 11, color: '#4a7a58' }}>{m.sub}</div>
              </div>
            </div>
          ))}
          {selectedMethod === 'card' && (
            <div style={{ marginTop: 4 }}>
              <input style={s.input} placeholder="Card Number (16 digits)" maxLength={16} value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g, ''))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input style={{ ...s.input, marginBottom: 0 }} placeholder="MM/YY" maxLength={5} value={cardExpiry} onChange={e => { let v = e.target.value.replace(/\D/g, ''); if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4); setCardExpiry(v) }} />
                <input style={{ ...s.input, marginBottom: 0 }} placeholder="CVV" maxLength={3} type="password" value={cardCVV} onChange={e => setCardCVV(e.target.value.replace(/\D/g, ''))} />
              </div>
            </div>
          )}

          {/* More ways */}
          <div style={{ ...s.sectionTitle, marginTop: 12 }}>MORE WAYS TO PAY</div>
          {METHODS.filter(m => ['emi', 'netbanking', 'cod'].includes(m.id)).map(m => (
            <div key={m.id} style={s.radioRow(selectedMethod === m.id)} onClick={() => setSelectedMethod(m.id)}>
              <div style={s.dot(selectedMethod === m.id)}>{selectedMethod === m.id && <div style={s.innerDot} />}</div>
              <span style={{ fontSize: 18 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#c8e6cc' }}>{m.label}</div>
                <div style={{ fontSize: 11, color: '#4a7a58' }}>{m.sub}</div>
              </div>
            </div>
          ))}
          {selectedMethod === 'emi' && (
            <div style={{ marginTop: 4 }}>
              <div style={s.label}>Select EMI Duration</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[3, 6, 9, 12, 18, 24].map(m => (
                  <button key={m} onClick={() => setEmiMonths(m)}
                    style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${emiMonths === m ? '#22c55e' : 'rgba(74,222,128,.15)'}`, background: emiMonths === m ? 'rgba(34,197,94,.12)' : 'transparent', color: emiMonths === m ? '#4ade80' : '#5a8a6a', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    {m}m
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 12, color: '#5a8a6a', marginTop: 8 }}>
                ≈ {fmtPrice(Math.round(finalTotal / emiMonths))} / month for {emiMonths} months
              </div>
            </div>
          )}
          {selectedMethod === 'netbanking' && (
            <select style={{ ...s.input, marginTop: 4 }} value={bank} onChange={e => setBank(e.target.value)}>
              <option value=''>Select Bank</option>
              {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'PNB', 'Bank of Baroda', 'Canara Bank', 'Union Bank'].map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          )}

          {/* Price breakdown */}
          <div style={{ ...s.section, marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: '#5a8a6a' }}>Subtotal ({items.length} items)</span>
              <span style={{ fontSize: 13, color: '#a8d5b0' }}>{fmtPrice(total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: '#5a8a6a' }}>Delivery</span>
              <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 700 }}>FREE</span>
            </div>
            {promoApplied && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#22c55e' }}>Promo (HARVESTIA5)</span>
                <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 700 }}>-{fmtPrice(promoDiscount)}</span>
              </div>
            )}
            <div style={{ borderTop: '1px solid rgba(74,222,128,.1)', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#e2f5e8' }}>Total</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#4ade80', fontFamily: "'Familjen Grotesk',sans-serif" }}>{fmtPrice(finalTotal)}</span>
            </div>
          </div>

          <button
            style={{ ...s.btnGreen, opacity: canPay() ? 1 : 0.45, marginTop: 4 }}
            onClick={() => { if (canPay()) setStep('success') }}
          >
            {selectedMethod === 'cod' ? '✅ Place Order (COD)' : `Pay ${fmtPrice(finalTotal)} →`}
          </button>
          <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: '#2a4a35' }}>🔒 Secured payment · 100% safe</div>
        </div>
      </div>
    </div>
  )
}

// ── Main Store Page ───────────────────────────────────────────────
export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search,   setSearch]   = useState('')
  const [sortBy,   setSortBy]   = useState('popular')
  const [cart,         setCart]         = useState([])
  const [cartOpen,     setCartOpen]     = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [apiProducts,  setApiProducts]  = useState(null)
  const [loading,      setLoading]      = useState(false)

  // ── Try loading from backend — silent fallback to static PRODUCTS
  useEffect(() => {
    // Uncomment below when backend is ready:
    // setLoading(true)
    // marketplaceAPI.products()
    //   .then(res => {
    //     const list = res.data?.results || res.data
    //     if (Array.isArray(list) && list.length > 0) {
    //       const mapped = list.map(p => ({
    //         id:       p.id,
    //         category: (p.category_name || 'tool').toLowerCase(),
    //         brand:    p.brand,
    //         name:     p.name,
    //         price:    parseFloat(p.price),
    //         salePrice:p.sale_price ? parseFloat(p.sale_price) : null,
    //         image:    p.image || null,
    //         emoji:    p.emoji || '📦',
    //         hp:       p.hp || null,
    //         speed:    p.max_speed || null,
    //         capacity: p.capacity_kg || null,
    //         rating:   p.rating || 4.5,
    //         reviews:  p.review_count || 0,
    //         badge:    p.badge || '',
    //         color:    '#4ade80',
    //         desc:     p.description || '',
    //         specs:    p.specs || {},
    //       }))
    //       setApiProducts(mapped)
    //     }
    //   })
    //   .catch(() => {})
    //   .finally(() => setLoading(false))
  }, [])

  const displayProducts = apiProducts || PRODUCTS

  const filtered = useMemo(() => {
    let items = displayProducts
    if (activeCategory !== 'all') items = items.filter(p => p.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(p =>
        (p.name  || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.desc  || '').toLowerCase().includes(q)
      )
    }
    if (sortBy === 'price-low')  items = [...items].sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
    if (sortBy === 'price-high') items = [...items].sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
    if (sortBy === 'rating')     items = [...items].sort((a, b) => b.rating - a.rating)
    return items
  }, [activeCategory, search, sortBy, displayProducts])

  const addToCart      = (p)  => { if (!cart.find(i => i.id === p.id)) setCart(prev => [...prev, p]) }
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))
  const totalSavings   = PRODUCTS.reduce((s, p) => p.salePrice ? s + (p.price - p.salePrice) : s, 0)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.2)', borderRadius: 20, padding: '4px 12px', marginBottom: 10, fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '.08em', textTransform: 'uppercase' }}>
              🏪 HARVESTIA STORE · {displayProducts.length} PRODUCTS
            </div>
            <h1 style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontSize: 30, fontWeight: 900, color: '#e2f5e8', margin: 0, lineHeight: 1.1 }}>
              Equipment & Supplies
            </h1>
            <p style={{ color: '#4a7a58', marginTop: 6, fontSize: 14 }}>Buy tractors, harvesters, tippers, seeds & tools directly for your farm</p>
          </div>
          <button onClick={() => setCartOpen(true)} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', background: cart.length > 0 ? 'linear-gradient(135deg,#14532d,#16a34a)' : 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.3)', borderRadius: 14, color: '#4ade80', cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            <ShoppingCart size={18} />
            <span>Cart</span>
            {cart.length > 0 && <span style={{ background: '#dc2626', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{cart.length}</span>}
          </button>
        </div>
        <div style={{ marginTop: 16, padding: '10px 16px', background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.2)', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#fca5a5', display: 'flex', alignItems: 'center', gap: 8 }}>
          🎉 <strong>Season Sale!</strong> Save up to 25% — Total savings up to {fmtPrice(totalSavings)}
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ padding: '8px 16px', borderRadius: 10, border: `1px solid ${activeCategory === cat.id ? '#16a34a' : 'rgba(74,222,128,.12)'}`, background: activeCategory === cat.id ? 'linear-gradient(135deg,#14532d,#166534)' : 'rgba(74,222,128,.04)', color: activeCategory === cat.id ? '#4ade80' : '#4a7a58', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: "'Plus Jakarta Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
            <span style={{ fontSize: 10, fontWeight: 800, background: activeCategory === cat.id ? 'rgba(0,0,0,.2)' : 'rgba(74,222,128,.1)', borderRadius: 10, padding: '1px 6px' }}>
              {cat.id === 'all' ? displayProducts.length : displayProducts.filter(p => p.category === cat.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Sort */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#3a5e46' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tractors, seeds, tools..." style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'rgba(74,222,128,.04)', border: '1px solid rgba(74,222,128,.12)', borderRadius: 10, color: '#c8e6cc', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans',sans-serif" }} />
        </div>
        <div style={{ position: 'relative' }}>
          <SlidersHorizontal size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#3a5e46', pointerEvents: 'none' }} />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '10px 12px 10px 34px', background: 'rgba(74,222,128,.04)', border: '1px solid rgba(74,222,128,.12)', borderRadius: 10, color: '#c8e6cc', fontSize: 13, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif", outline: 'none' }}>
            <option value="popular">Sort: Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
        <div style={{ padding: '10px 14px', background: 'rgba(74,222,128,.04)', border: '1px solid rgba(74,222,128,.08)', borderRadius: 10, fontSize: 13, color: '#3a5e46', fontWeight: 600, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
          {filtered.length} products
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#4a7a58', fontSize: 14 }}>
          Loading products...
        </div>
      )}

      {/* Grid */}
      {!loading && (filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#2a4a35', fontSize: 14 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div>No products found for "{search}"</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} inCart={cart.some(i => i.id === product.id)} />
          ))}
        </div>
      ))}

      {/* Cart Drawer */}
      {cartOpen && <CartDrawer items={cart} onRemove={removeFromCart} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }} />}
      {checkoutOpen && <PaymentPage items={cart} onBack={() => { setCheckoutOpen(false); setCartOpen(true) }} onClose={() => { setCheckoutOpen(false); setCart([]) }} />}
    </div>
  )
}