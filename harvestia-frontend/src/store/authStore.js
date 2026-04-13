import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:    null,
      token:   null,
      refresh: null,

      login: (user, token, refresh) => set({ user, token, refresh }),

      logout: () => {
        set({ user: null, token: null, refresh: null })
        window.location.href = '/login'
      },

      updateUser: (patch) => set(s => ({ user: { ...s.user, ...patch } })),

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'harvestia-auth',
      partialize: s => ({ user: s.user, token: s.token, refresh: s.refresh }),
    }
  )
)
