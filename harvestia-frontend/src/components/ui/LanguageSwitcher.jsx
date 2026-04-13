/**
 * HARVESTIA — Language Switcher Component
 * Floating dropdown with all supported Indian languages
 */

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '@store/langStore'
import { LANGUAGES } from '@i18n'

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang, currentLang } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (code) => {
    setLang(code)
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative', userSelect: 'none' }}>
      {/* ── Trigger Button ── */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: compact ? '5px 10px' : '7px 14px',
          borderRadius: 10,
          border: '1px solid rgba(74,222,128,.2)',
          background: open ? 'rgba(74,222,128,.1)' : 'rgba(74,222,128,.05)',
          color: '#4ade80',
          cursor: 'pointer',
          fontSize: compact ? 12 : 13,
          fontWeight: 600,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          transition: 'all .2s',
          whiteSpace: 'nowrap',
        }}
        title="Change Language"
      >
        <span style={{ fontSize: compact ? 14 : 16 }}>{currentLang.flag}</span>
        {!compact && (
          <span style={{ maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentLang.nativeName}
          </span>
        )}
        <svg
          width={10} height={10}
          viewBox="0 0 10 10"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }}
        >
          <path d="M1 3L5 7L9 3" stroke="#4ade80" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
        </svg>
      </button>

      {/* ── Dropdown Menu ── */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          zIndex: 999,
          background: 'linear-gradient(135deg, #071409, #0a1f0e)',
          border: '1px solid rgba(74,222,128,.2)',
          borderRadius: 14,
          boxShadow: '0 20px 60px rgba(0,0,0,.5), 0 0 0 1px rgba(74,222,128,.05)',
          minWidth: 200,
          overflow: 'hidden',
          animation: 'fadeIn .15s ease',
        }}>
          {/* Header */}
          <div style={{
            padding: '10px 14px 8px',
            borderBottom: '1px solid rgba(74,222,128,.08)',
            fontSize: 10,
            fontWeight: 700,
            color: '#3a5e46',
            letterSpacing: '.08em',
            textTransform: 'uppercase',
          }}>
            🌍 Select Language
          </div>

          {/* Language Options */}
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => handleSelect(l.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '10px 14px',
                border: 'none',
                background: lang === l.code ? 'rgba(74,222,128,.12)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background .15s',
                borderLeft: lang === l.code ? '3px solid #4ade80' : '3px solid transparent',
              }}
              onMouseOver={e  => { if (lang !== l.code) e.currentTarget.style.background = 'rgba(74,222,128,.06)' }}
              onMouseOut={e => { if (lang !== l.code) e.currentTarget.style.background = 'transparent' }}
            >
              {/* Flag */}
              <span style={{ fontSize: 18, flexShrink: 0 }}>{l.flag}</span>

              {/* Names */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: lang === l.code ? '#4ade80' : '#c8e6cc' }}>
                  {l.nativeName}
                </div>
                <div style={{ fontSize: 10, color: '#3a5e46', marginTop: 1 }}>
                  {l.name}
                </div>
              </div>

              {/* Active checkmark */}
              {lang === l.code && (
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#16a34a,#4ade80)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 900, color: '#04100a',
                  flexShrink: 0,
                }}>
                  ✓
                </div>
              )}
            </button>
          ))}

          {/* Footer */}
          <div style={{
            padding: '8px 14px',
            borderTop: '1px solid rgba(74,222,128,.08)',
            fontSize: 10,
            color: '#2a4a35',
            textAlign: 'center',
          }}>
            5 Indian languages supported
          </div>
        </div>
      )}
    </div>
  )
}
