import { useOutletContext } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Brain, Droplets, Map, Bell, Leaf } from 'lucide-react'
import { useTranslation } from '@store/langStore'
import { analyticsAPI } from '@api/client'
import {
  StatCard, DonutChart, YieldBarChart, ProgressBar,
  AlertBanner, PageHeader
} from '@components/ui'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const ACTUAL  = [62, 58, 67, 71, 79, 86, 89, 93, 88, 81, 74, 69]
const FORECAST= [65, 61, 69, 74, 82, 88, 92, 96, 90, 84, 77, 72]

const CROP_FIELDS = [
  { crop: 'Wheat',   field: 'A-12', health: 94, color: '#4ade80' },
  { crop: 'Rice',    field: 'B-07', health: 78, color: '#a3e635' },
  { crop: 'Cotton',  field: 'C-03', health: 61, color: '#eab308' },
  { crop: 'Soybean', field: 'D-15', health: 88, color: '#4ade80' },
  { crop: 'Corn',    field: 'E-09', health: 44, color: '#f87171' },
]

const ALERTS_DATA = [
  { type: 'danger',  titleKey: 'Aphid risk HIGH — Field C-03 (Cotton)',     time: '2 min ago' },
  { type: 'warn',    titleKey: 'Soil moisture critical — Field E-09 (Corn)', time: '18 min ago' },
  { type: 'success', titleKey: 'Optimal harvest window — Field A-12 (Wheat)',time: '1 hr ago' },
  { type: 'info',    titleKey: 'Irrigation cycle complete — Field B-07',     time: '2 hr ago' },
]

export default function DashboardPage() {
  const { sensors, isConnected, backendOnline } = useOutletContext()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [dashData, setDashData] = useState(null)

  useEffect(() => {
    analyticsAPI.dashboard()
      .then(res => setDashData(res.data))
      .catch(() => {})
  }, [])

  const SENSOR_ROWS = [
    { ic: '🌡️', label: t('sensors.temperature'), key: 'temp',     unit: '°C',    color: '#f97316' },
    { ic: '💧', label: t('sensors.humidity'),    key: 'humidity', unit: '%',     color: '#60a5fa' },
    { ic: '🌱', label: t('sensors.soilMoisture'),key: 'moisture', unit: '%',     color: '#4ade80' },
    { ic: '🧪', label: t('sensors.soilPh'),      key: 'ph',       unit: '',      color: '#a78bfa' },
    { ic: '🌬️', label: t('sensors.windSpeed'),   key: 'wind',     unit: ' km/h', color: '#34d399' },
    { ic: '🌿', label: t('sensors.ndvi'),         key: 'ndvi',     unit: '',      color: '#4ade80' },
  ]

  const kpis = [
    { label: t('dashboard.totalAcreage'), value: dashData ? `${dashData.total_acreage} ac` : '12,450 ac', sub: `${dashData?.total_fields || 0} fields`, trend: 'up',   icon: '🌾' },
    { label: t('dashboard.cropHealth'),   value: dashData ? `${dashData.avg_crop_health}%` : '73.2%',     sub: `${dashData?.active_crops || 0} active crops`, trend: 'up', icon: '💚' },
    { label: t('dashboard.waterSaved'),   value: `${dashData?.water_saved_pct || 42}%`,   sub: 'vs conventional', trend: 'up',   icon: '💧' },
    { label: t('dashboard.aiAlerts'),     value: `${dashData?.unread_alerts ?? 3} Active`, sub: `${dashData?.critical_alerts ?? 2} critical`, trend: dashData?.critical_alerts > 0 ? 'down' : 'up', icon: '🔔' },
  ]

  const QUICK_ACTIONS = [
    { icon: <Brain size={20}/>,    label: t('nav.yieldAI'),     to: '/app/ai/yield',      color: '#4ade80' },
    { icon: <Leaf size={20}/>,     label: t('nav.diseaseAI'),   to: '/app/ai/disease',    color: '#60a5fa' },
    { icon: <Droplets size={20}/>, label: t('nav.irrigationAI'),to: '/app/ai/irrigation', color: '#a78bfa' },
    { icon: <Map size={20}/>,      label: t('nav.fields'),      to: '/app/fields',        color: '#f97316' },
    { icon: <Bell size={20}/>,     label: t('nav.alerts'),      to: '/app/alerts',        color: '#eab308' },
  ]

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      <PageHeader
        tag={backendOnline ? '🟢 LIVE FARM INTELLIGENCE' : '🟡 DEMO MODE'}
        title={t('dashboard.title')}
        desc="Real-time overview of all your fields, AI models, and IoT sensors."
      >
        {/* ✅ SIRF YAHI CHANGE HAI — Logo add kiya */}
        <img
          src="/harvestia-logo.png"
          alt="Harvestia Logo"
          className="w-10 h-10 rounded-full object-cover"
        />
        <button onClick={() => navigate('/app/ai/yield')} className="btn-primary text-sm py-2.5">
          <Brain size={15} /> {t('common.runModel')}
        </button>
      </PageHeader>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <StatCard key={i} label={k.label} value={k.value} sub={k.sub} trend={k.trend} icon={k.icon} />
        ))}
      </div>

      {/* AI Recommendation Banner */}
      <AlertBanner
        type="success"
        title={`🤖 ${t('dashboard.recommendation')}`}
        message="Satellite + soil data shows early aphid signs in Field C-03 (Cotton). Apply Neem-based pesticide within 48 hrs. Estimated yield loss prevention: ₹2.4 Lakh."
        action={`${t('alerts.applyTreatment')} ✓`}
        onAction={() => navigate('/app/ai/pest')}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Yield Chart */}
        <div className="card p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display font-bold text-green-100 text-sm">{t('dashboard.yieldAnalytics')}</h3>
            <div className="flex gap-3 text-xs text-green-800">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-brand-500 inline-block"/>Actual</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-400 inline-block opacity-65"/>Forecast</span>
            </div>
          </div>
          <p className="text-xs text-green-800 mb-4">{t('dashboard.actualVsForecast')}</p>
          <YieldBarChart actual={ACTUAL} forecast={FORECAST} labels={MONTHS} />
        </div>

        {/* Crop Health */}
        <div className="card p-5 lg:col-span-1">
          <h3 className="font-display font-bold text-green-100 text-sm mb-1">{t('dashboard.fieldHealth')}</h3>
          <p className="text-xs text-green-800 mb-5">Real-time AI crop analysis</p>
          <div className="space-y-4">
            {CROP_FIELDS.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <DonutChart value={c.health} size={48} color={c.color} showValue={false} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-green-100">
                      {c.crop} <span className="text-green-800 font-normal text-xs">· Field {c.field}</span>
                    </span>
                    <span className="font-bold text-sm tabular-nums" style={{ color: c.color }}>{c.health}%</span>
                  </div>
                  <ProgressBar value={c.health} color={c.color} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Panel */}
        <div className="flex flex-col gap-4">
          {/* IoT Sensors */}
          <div className="card p-4 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-brand-400' : 'bg-yellow-400'}`} />
                {isConnected && <span className="absolute w-2 h-2 rounded-full bg-brand-400 animate-pulse-dot" />}
              </span>
              <span className="text-xs font-bold text-green-800 tracking-widest uppercase">{t('dashboard.iotSensors')}</span>
            </div>
            <div className="space-y-2.5">
              {SENSOR_ROWS.map(({ ic, label, key, unit, color }) => (
                <div key={key} className="flex justify-between items-center py-1.5 border-b border-brand-800/20 last:border-0">
                  <span className="text-xs text-green-800">{ic} {label}</span>
                  <span className="font-bold text-sm tabular-nums" style={{ color }}>
                    {sensors[key]}{unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="card p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-green-800 tracking-widest uppercase">{t('dashboard.aiAlertsFeed')}</span>
              <button onClick={() => navigate('/app/alerts')} className="text-xs text-brand-400 hover:text-brand-300 font-semibold">
                View all →
              </button>
            </div>
            <div className="space-y-2">
              {ALERTS_DATA.map((a, i) => (
                <div key={i} className={`alert-${a.type}`}>
                  <p className="text-xs text-green-100 leading-relaxed">{a.titleKey}</p>
                  <p className="text-xs text-green-800 mt-0.5">{a.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {QUICK_ACTIONS.map((q, i) => (
          <button key={i} onClick={() => navigate(q.to)}
            className="card p-4 flex flex-col items-center gap-3 text-center hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="p-2.5 rounded-xl" style={{ background: `${q.color}14`, color: q.color }}>{q.icon}</div>
            <span className="text-xs font-bold text-green-700">{q.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}