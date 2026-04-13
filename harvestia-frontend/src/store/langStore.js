/**
 * HARVESTIA — Language Store (Zustand)
 * Persists user's language choice in localStorage
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { translate, getBundle, LANGUAGES } from '@i18n'

export const useLangStore = create(
  persist(
    (set, get) => ({
      lang: 'en',   // default language

      // Change language
      setLang: (code) => {
        set({ lang: code })
        // Update HTML dir attribute if needed (for RTL languages in future)
        const langObj = LANGUAGES.find(l => l.code === code)
        if (langObj) {
          document.documentElement.lang = code
          document.documentElement.dir  = langObj.dir
        }
      },

      // Translate a key
      t: (key) => translate(get().lang, key),

      // Get full bundle (for components that need multiple keys)
      bundle: () => getBundle(get().lang),

      // Current language info
      currentLang: () => LANGUAGES.find(l => l.code === get().lang) || LANGUAGES[0],
    }),
    {
      name: 'harvestia-language',
      partialize: (s) => ({ lang: s.lang }),
    }
  )
)

// ── Convenience hook ─────────────────────────────────────────────
export function useTranslation() {
  const { lang, setLang, t, bundle, currentLang } = useLangStore()
  return { lang, setLang, t, bundle: bundle(), currentLang: currentLang(), LANGUAGES }
}
