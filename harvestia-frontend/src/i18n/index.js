/**
 * HARVESTIA — i18n Engine
 * Lightweight translation system — no external library needed
 * Supports: English, Hindi, Marathi, Punjabi, Tamil
 */

import en from './locales/en'
import hi from './locales/hi'
import mr from './locales/mr'
import pa from './locales/pa'
import ta from './locales/ta'

// ── All supported languages ──────────────────────────────────────
export const LANGUAGES = [
  { code: 'en', name: 'English',    nativeName: 'English',  flag: '🇬🇧', dir: 'ltr' },
  { code: 'hi', name: 'Hindi',      nativeName: 'हिन्दी',    flag: '🇮🇳', dir: 'ltr' },
  { code: 'mr', name: 'Marathi',    nativeName: 'मराठी',     flag: '🌿', dir: 'ltr' },
  { code: 'pa', name: 'Punjabi',    nativeName: 'ਪੰਜਾਬੀ',   flag: '🌾', dir: 'ltr' },
  { code: 'ta', name: 'Tamil',      nativeName: 'தமிழ்',    flag: '🌺', dir: 'ltr' },
]

// ── Translation bundles ──────────────────────────────────────────
const translations = { en, hi, mr, pa, ta }

// ── Get nested value by dot-path ─────────────────────────────────
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

// ── Main translate function ───────────────────────────────────────
export function translate(lang, key, fallbackLang = 'en') {
  const bundle = translations[lang] || translations[fallbackLang]
  const val = getNestedValue(bundle, key)
  if (val !== undefined) return val
  // fallback to English
  const fallback = getNestedValue(translations[fallbackLang], key)
  return fallback ?? key
}

// ── Get full translation bundle for a language ──────────────────
export function getBundle(lang) {
  return translations[lang] || translations['en']
}

export default translations
