import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Play, Satellite, Brain, Droplets, Bug, TrendingUp, Shield } from 'lucide-react'

const FEATURES = [
  { icon: <Satellite size={28} />, title: 'Satellite Intelligence', desc: 'NDVI analysis via Sentinel-2 imagery. Crop health scoring before visible symptoms appear.', tag: 'Remote Sensing', color: '#4ade80' },
  { icon: <Brain size={28} />,     title: 'Deep Learning Yield AI', desc: 'GradientBoost + LSTM ensemble trained on 12.4M field records. 98.7% forecast accuracy.', tag: 'DL Model', color: '#60a5fa' },
  { icon: <Droplets size={28} />,  title: 'RL Irrigation Optimizer', desc: 'Reinforcement learning agent schedules irrigation — cutting water use by up to 42%.', tag: 'RL Agent', color: '#a78bfa' },
  { icon: <Bug size={28} />,       title: 'Pest & Disease CNN', desc: 'ResNet-50 identifies 47 diseases from leaf images. Real-time inference under 200ms.', tag: 'Computer Vision', color: '#f97316' },
  { icon: <TrendingUp size={28} />,title: 'Market Price Forecast', desc: 'LSTM time series model predicts 30-day mandi prices to optimize selling decisions.', tag: 'NLP + LSTM', color: '#eab308' },
  { icon: <Shield size={28} />,    title: 'Smart Alert Engine', desc: 'Every 5 minutes: IoT + satellite + ML triggers real-time alerts before damage occurs.', tag: 'IoT + ML', color: '#34d399' },
]

const STATS = [
  { value: '2.4M+', label: 'Acres Monitored', icon: '🌾' },
  { value: '98.7%', label: 'Forecast Accuracy', icon: '🎯' },
  { value: '340+',  label: 'Agri Enterprises', icon: '🏢' },
  { value: '42%',   label: 'Water Reduction', icon: '💧' },
]

const MODELS = [
  { name: 'Yield Predictor', algo: 'GradientBoost + LSTM', acc: '98.7%', color: '#4ade80' },
  { name: 'Disease Detector', algo: 'ResNet-50 CNN', acc: '96.2%', color: '#60a5fa' },
  { name: 'Irrigation RL Agent', algo: 'PPO Reinforcement Learning', acc: '42% saved', color: '#a78bfa' },
  { name: 'Pest Risk XGBoost', algo: 'XGBoost Classifier', acc: '94.5%', color: '#f97316' },
  { name: 'Soil Health RF', algo: 'Random Forest + Rules', acc: '91.0%', color: '#eab308' },
  { name: 'Price Forecast LSTM', algo: 'LSTM Time Series', acc: '87.3%', color: '#34d399' },
  { name: 'Anomaly Detector', algo: 'Isolation Forest', acc: '95.1%', color: '#f472b6' },
]

export default function LandingPage() {
  const navigate  = useNavigate()
  const [scroll, setScroll] = useState(0)
  const [mouse,  setMouse]  = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY)
    const onMouse  = e  => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('scroll', onScroll)
    window.addEventListener('mousemove', onMouse)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMouse) }
  }, [])

  const goApp = () => navigate('/app/dashboard')

  return (
    <div className="min-h-screen bg-surface bg-grid overflow-x-hidden">
      {/* Ambient cursor glow */}
      <div
        className="fixed pointer-events-none z-0 rounded-full"
        style={{
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(74,222,128,.045) 0%, transparent 70%)',
          left: mouse.x - 250, top: mouse.y - 250,
          transition: 'left .5s ease, top .5s ease',
        }}
      />

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 transition-all duration-300"
        style={{
          background: scroll > 30 ? 'rgba(4,16,10,.97)' : 'transparent',
          backdropFilter: scroll > 30 ? 'blur(24px)' : 'none',
          borderBottom: scroll > 30 ? '1px solid rgba(74,222,128,.08)' : 'none',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-700 to-brand-400 flex items-center justify-center text-lg animate-glow">
            🌿
          </div>
          <span className="font-display font-bold text-xl text-brand-400 tracking-tight">Harvestia</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'AI Models', 'Solutions', 'Pricing'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
               className="text-green-700 hover:text-brand-400 text-sm font-semibold transition-colors">
              {l}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="btn-secondary py-2 px-4 text-xs">
            Log In
          </button>
          <button onClick={goApp} className="btn-primary py-2 px-4 text-xs">
            Start Free <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="min-h-screen flex items-center justify-center text-center pt-20 pb-16 px-6 relative">
        <div className="max-w-4xl relative z-10">
          <div className="section-tag mb-6 animate-fade-up">
            <span className="live-dot" />
            AI-POWERED AGRITECH PLATFORM — INDIA
          </div>

          <h1
            className="font-display font-bold leading-[1.03] mb-6 animate-fade-up text-green-50"
            style={{ fontSize: 'clamp(44px,7.5vw,88px)', letterSpacing: '-2.5px', animationDelay: '.08s' }}
          >
            Where AI Meets<br />
            <span className="text-gradient">Indian Agriculture</span>
          </h1>

          <p
            className="text-green-700 leading-relaxed mb-10 animate-fade-up mx-auto"
            style={{ fontSize: 'clamp(15px,2vw,19px)', maxWidth: 580, animationDelay: '.18s' }}
          >
            Harvestia combines satellite imagery, IoT sensors, and 7 production ML/DL models to help
            farmers maximize yield, minimize waste, and make data-driven decisions — in real time.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap animate-fade-up" style={{ animationDelay: '.28s' }}>
            <button onClick={goApp} className="btn-primary text-base px-8 py-4">
              Open Live Dashboard <ArrowRight size={18} />
            </button>
            <button className="btn-secondary text-base px-8 py-4">
              <Play size={16} /> Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12 mt-20 flex-wrap animate-fade-up" style={{ animationDelay: '.4s' }}>
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl mb-1">{s.icon}</div>
                <div className="font-display font-bold text-brand-400 mb-1"
                     style={{ fontSize: 'clamp(26px,3vw,36px)', letterSpacing: '-1px' }}>
                  {s.value}
                </div>
                <div className="text-xs text-green-800 font-semibold tracking-wider uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating orbs */}
        {[
          { s: 320, t: '8%',  l: '4%',  c: 'rgba(74,222,128,.055)', d: 5 },
          { s: 220, t: '60%', l: '76%', c: 'rgba(96,165,250,.04)',  d: 7 },
          { s: 260, t: '20%', l: '80%', c: 'rgba(167,139,250,.04)', d: 6 },
        ].map((o, i) => (
          <div key={i} className="absolute pointer-events-none rounded-full"
            style={{
              width: o.s, height: o.s, top: o.t, left: o.l,
              background: `radial-gradient(circle, ${o.c}, transparent)`,
              filter: 'blur(40px)',
              animation: `float ${o.d}s ease-in-out infinite`,
              animationDelay: `${i * 1.2}s`,
            }}
          />
        ))}
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="section-tag mb-4">PLATFORM CAPABILITIES</div>
          <h2 className="font-display font-bold text-green-50 mb-4"
              style={{ fontSize: 'clamp(30px,5vw,54px)', letterSpacing: '-1.5px' }}>
            Everything your farm needs,<br />
            <span className="text-gradient">powered by AI.</span>
          </h2>
          <p className="text-green-700 max-w-md mx-auto">
            Six intelligence modules working together to transform farm operations end-to-end.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={i} className="card p-7" style={{ animationDelay: `${i * .07}s` }}>
              <div className="flex items-start justify-between mb-5">
                <div className="p-2.5 rounded-xl" style={{ background: `${f.color}14`, color: f.color }}>
                  {f.icon}
                </div>
                <span className="badge text-xs" style={{ background: `${f.color}12`, color: f.color, borderColor: `${f.color}30` }}>
                  {f.tag}
                </span>
              </div>
              <h3 className="font-display font-bold text-green-100 mb-2.5 text-base">{f.title}</h3>
              <p className="text-sm text-green-800 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI MODELS ──────────────────────────────────────── */}
      <section id="ai-models" className="py-24 px-6"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(74,222,128,.025), transparent)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-tag mb-4">7 INTEGRATED ML/DL MODELS</div>
            <h2 className="font-display font-bold text-green-50"
                style={{ fontSize: 'clamp(28px,4vw,50px)', letterSpacing: '-1.2px' }}>
              Production-grade AI, <span className="text-gradient">built for real farms.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MODELS.map((m, i) => (
              <div key={i} className="card p-5">
                <div className="w-2.5 h-2.5 rounded-full mb-4" style={{ background: m.color, boxShadow: `0 0 12px ${m.color}` }} />
                <h4 className="font-display font-bold text-green-100 text-sm mb-1.5">{m.name}</h4>
                <p className="text-xs text-green-800 mb-4">{m.algo}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-900">Performance</span>
                  <span className="font-bold text-sm" style={{ color: m.color }}>{m.acc}</span>
                </div>
                <div className="mt-2 h-1 rounded-full" style={{ background: `${m.color}15` }}>
                  <div className="h-full rounded-full" style={{ background: m.color, width: '85%' }} />
                </div>
                <button onClick={goApp} className="btn-ghost w-full justify-center mt-4 text-xs py-2"
                  style={{ color: m.color }}>
                  Try this model →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div
          className="max-w-2xl mx-auto text-center rounded-3xl p-16 border"
          style={{
            background: 'linear-gradient(135deg,#071409,#0d2a15)',
            borderColor: 'rgba(74,222,128,.2)',
          }}
        >
          <div className="text-5xl mb-5 animate-float">🚀</div>
          <h2 className="font-display font-bold text-green-50 mb-4"
              style={{ fontSize: 'clamp(26px,4vw,42px)', letterSpacing: '-1px' }}>
            Ready to grow smarter?
          </h2>
          <p className="text-green-700 mb-10 leading-relaxed">
            Join 340+ agri enterprises using Harvestia to boost yield and cut costs. No credit card required.
          </p>
          <button onClick={goApp} className="btn-primary text-base px-10 py-4">
            Open Harvestia Dashboard <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="border-t border-brand-800/20 py-8 px-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🌿</span>
          <span className="font-display font-bold text-brand-400 text-lg">Harvestia</span>
          <span className="text-green-900 text-sm">— Grow with Intelligence</span>
        </div>
        <p className="text-xs text-green-900">
          © 2025 Harvestia Technologies Pvt. Ltd. · Privacy · Terms
        </p>
      </footer>
    </div>
  )
}
