import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { useTranslation } from '@store/langStore'
import { useLiveSensors, useBackendStatus } from '@hooks'
import LanguageSwitcher from '@components/ui/LanguageSwitcher'
import {
  LayoutDashboard, Map, Wheat, Brain, Droplets, Bug, FlaskConical,
  ShoppingCart, Bell, FileBarChart, Settings, ChevronLeft, ChevronRight,
  LogOut, Wifi, WifiOff, Leaf, Store
} from 'lucide-react'

const NAV_ITEMS = [
  { to: 'dashboard',     icon: LayoutDashboard, key: 'nav.dashboard' },
  { to: 'fields',        icon: Map,             key: 'nav.fields' },
  { to: 'crops',         icon: Wheat,           key: 'nav.crops' },
  { dividerKey: 'nav.aiModels', isDivider: true },
  { to: 'ai/yield',      icon: Brain,           key: 'nav.yieldAI' },
  { to: 'ai/disease',    icon: Leaf,            key: 'nav.diseaseAI' },
  { to: 'ai/irrigation', icon: Droplets,        key: 'nav.irrigationAI' },
  { to: 'ai/pest',       icon: Bug,             key: 'nav.pestAI' },
  { to: 'ai/soil',       icon: FlaskConical,    key: 'nav.soilAI' },
  { dividerKey: 'nav.more', isDivider: true },
  { to: 'store',         icon: Store,           key: 'nav.store' },
  { to: 'market',        icon: ShoppingCart,    key: 'nav.market' },
  { to: 'alerts',        icon: Bell,            key: 'nav.alerts' },
  { to: 'reports',       icon: FileBarChart,    key: 'nav.reports' },
  { to: 'settings',      icon: Settings,        key: 'nav.settings' },
]

function LiveDot({ connected }) {
  return (
    <span className="relative inline-flex items-center">
      <span className={`w-2 h-2 rounded-full ${connected ? 'bg-brand-400' : 'bg-red-400'}`} />
      {connected && <span className="absolute w-2 h-2 rounded-full bg-brand-400 animate-pulse-dot" />}
    </span>
  )
}

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const user    = useAuthStore(s => s.user)
  const logout  = useAuthStore(s => s.logout)
  const { sensors, isConnected } = useLiveSensors('demo-farm-1')
  const { backendOnline }        = useBackendStatus()
  const navigate = useNavigate()
  const { t } = useTranslation()

  // Online = backend REST API + WebSocket both connected
  const fullyOnline = backendOnline && isConnected

  return (
    <div className="flex h-screen bg-surface overflow-hidden">

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside
        className="flex flex-col border-r border-brand-800/40 bg-surface-200 transition-all duration-300 flex-shrink-0"
        style={{ width: collapsed ? 64 : 220 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-3.5 h-16 border-b border-brand-800/30">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-700 to-brand-400 flex items-center justify-center text-lg flex-shrink-0 animate-glow">
            🌿
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-lg text-brand-400 tracking-tight whitespace-nowrap">
              Harvestia
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2.5 flex flex-col gap-0.5 overflow-y-auto scrollbar-hide">
          {NAV_ITEMS.map((item, i) => {
            if (item.isDivider) {
              return !collapsed ? (
                <div key={i} className="px-2 pt-4 pb-1.5">
                  <span className="text-xs font-bold text-green-900 tracking-widest uppercase">
                    {t(item.dividerKey)}
                  </span>
                </div>
              ) : <div key={i} className="my-2 h-px bg-brand-800/30 mx-2" />
            }
            const Icon = item.icon
            const label = t(item.key)
            return (
              <NavLink
                key={item.to}
                to={`/app/${item.to}`}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`
                }
                title={collapsed ? label : undefined}
              >
                <Icon size={17} className="flex-shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* Live Sensor Mini Panel */}
        {!collapsed && (
          <div className="mx-2.5 mb-2 p-3 card-flat rounded-xl">
            <div className="flex items-center gap-2 mb-2.5">
              <LiveDot connected={isConnected} />
              <span className="text-xs font-bold text-green-800 tracking-widest uppercase">{t('common.liveData')}</span>
            </div>
            {[
              ['🌡️', `${sensors.temp}°C`],
              ['💧', `${sensors.humidity}%`],
              ['🌱', `${sensors.moisture}%`],
            ].map(([ic, val]) => (
              <div key={ic} className="flex justify-between items-center py-1 border-b border-brand-800/20 last:border-0">
                <span className="text-xs text-green-800">{ic}</span>
                <span className="text-xs font-bold text-brand-400">{val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Collapse + Logout */}
        <div className="p-2.5 border-t border-brand-800/30 flex flex-col gap-1.5">
          <button onClick={() => setCollapsed(!collapsed)} className="nav-item justify-center w-full">
            {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span className="text-xs">{t('common.collapse')}</span></>}
          </button>
          <button onClick={logout} className="nav-item text-red-600 hover:text-red-400 hover:bg-red-400/5 justify-center w-full">
            <LogOut size={15} />
            {!collapsed && <span className="text-xs">{t('auth.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="h-16 bg-surface-200 border-b border-brand-800/30 flex items-center justify-between px-6 flex-shrink-0">
          <div>
            <h1 className="font-display font-bold text-green-100 text-lg leading-tight">
              {t('dashboard.welcomeBack')}, {user?.full_name?.split(' ')[0] || t('common.farmer')} 👋
            </h1>
            <p className="text-xs text-green-800 mt-0.5">
              {user?.plan?.toUpperCase()} Plan · {user?.state || 'India'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* 🌐 Language Switcher */}
            <LanguageSwitcher />

            {/* Backend + WebSocket status */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-500
              ${fullyOnline
                ? 'bg-brand-400/8 text-brand-400 border-brand-400/20'
                : backendOnline
                  ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
                  : 'bg-red-400/8 text-red-400 border-red-400/20'
              }`}>
              {fullyOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              {fullyOnline
                ? t('common.allSystems')
                : backendOnline
                  ? t('common.backendOnly')
                  : t('common.offline')
              }
            </div>

            {/* Alerts bell */}
            <NavLink to="/app/alerts" className="relative p-2 rounded-xl hover:bg-brand-400/8 transition-colors">
              <Bell size={18} className="text-green-600" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-400" />
            </NavLink>

            {/* Avatar */}
            <div
              onClick={() => navigate('/app/settings')}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-sm font-bold cursor-pointer hover:scale-105 transition-transform"
            >
              {user?.full_name?.slice(0, 2).toUpperCase() || 'HV'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-grid bg-surface p-6">
          <Outlet context={{ sensors, isConnected, backendOnline, t }} />
        </main>
      </div>
    </div>
  )
}
