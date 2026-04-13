/* ══════════════════════════════════════════════════════════
   Harvestia – Shared UI Components
   DonutChart | BarChart | StatCard | MLResultCard | LiveBadge
══════════════════════════════════════════════════════════ */

/* ── DonutChart ─────────────────────────────────────────── */
export function DonutChart({ value, size = 72, color = '#4ade80', label, showValue = true }) {
  const r      = (size - 12) / 2
  const circ   = 2 * Math.PI * r
  const offset = circ - (Math.min(100, Math.max(0, value)) / 100) * circ

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} className="absolute">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(74,222,128,.08)" strokeWidth={9} />
          <circle
            cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={9}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
          />
        </svg>
        {showValue && (
          <span className="relative font-display font-bold text-green-100" style={{ fontSize: size * .22 }}>
            {Math.round(value)}%
          </span>
        )}
      </div>
      {label && <span className="text-xs text-green-800">{label}</span>}
    </div>
  )
}

/* ── YieldBarChart ──────────────────────────────────────── */
export function YieldBarChart({ actual, forecast, labels }) {
  const max = Math.max(...actual, ...forecast, 1)
  return (
    <div className="flex items-end gap-1 h-32 px-1">
      {actual.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end" style={{ height: 108 }}>
            <div
              className="flex-1 rounded-t-sm min-h-1 bg-gradient-to-t from-green-700 to-brand-400"
              style={{ height: `${(v / max) * 100}%`, transition: 'height .9s ease' }}
            />
            {forecast?.[i] !== undefined && (
              <div
                className="flex-1 rounded-t-sm min-h-1 bg-gradient-to-t from-blue-700 to-blue-400 opacity-65"
                style={{ height: `${(forecast[i] / max) * 100}%`, transition: 'height .9s ease' }}
              />
            )}
          </div>
          {labels?.[i] && (
            <span className="text-[8px] text-green-900 tracking-wide">{labels[i]}</span>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── StatCard ───────────────────────────────────────────── */
export function StatCard({ label, value, sub, icon, trend, color = 'brand' }) {
  const trendUp = trend === 'up'
  return (
    <div className="card p-5">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <p className="label mb-2">{label}</p>
          <p className="font-display font-bold text-green-50" style={{ fontSize: 28, letterSpacing: '-0.5px' }}>
            {value}
          </p>
          {sub && (
            <p className={`text-xs font-semibold mt-1.5 ${trendUp ? 'text-brand-400' : 'text-red-400'}`}>
              {trendUp ? '↑' : '↓'} {sub}
            </p>
          )}
        </div>
        {icon && <span className="text-3xl ml-3 flex-shrink-0">{icon}</span>}
      </div>
    </div>
  )
}

/* ── MLResultCard ───────────────────────────────────────── */
export function MLResultCard({ title, children, model, inferenceMs }) {
  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-green-100 text-sm tracking-tight">{title}</h3>
        <div className="flex items-center gap-2">
          {inferenceMs && (
            <span className="badge badge-blue text-xs">{inferenceMs}ms</span>
          )}
          {model && (
            <span className="badge badge-green text-xs">{model}</span>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

/* ── ProgressBar ────────────────────────────────────────── */
export function ProgressBar({ value, color = '#4ade80', className = '' }) {
  return (
    <div className={`progress-track ${className}`}>
      <div
        className="progress-fill"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
      />
    </div>
  )
}

/* ── RiskBadge ──────────────────────────────────────────── */
export function RiskBadge({ level }) {
  const map = {
    Low:      'badge-green',
    Medium:   'badge-yellow',
    High:     'badge-orange',
    Critical: 'badge-red',
  }
  return <span className={`badge ${map[level] || 'badge-blue'}`}>{level}</span>
}

/* ── SeverityBadge ──────────────────────────────────────── */
export function SeverityBadge({ severity }) {
  return <RiskBadge level={severity} />
}

/* ── NeuralViz ──────────────────────────────────────────── */
export function NeuralViz({ layers }) {
  if (!layers?.length) return null
  const W = 500, H = 180
  const lw = W / layers.length

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} className="block">
      {/* Connections */}
      {layers.slice(0, -1).map((layer, li) => {
        const next = layers[li + 1]
        const x1 = li * lw + lw / 2
        const x2 = (li + 1) * lw + lw / 2
        return layer.acts.map((act, ni) => {
          const y1 = (H / (layer.acts.length + 1)) * (ni + 1)
          return next.acts.map((_, nj) => {
            const y2 = (H / (next.acts.length + 1)) * (nj + 1)
            return (
              <line
                key={`${li}-${ni}-${nj}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={`rgba(74,222,128,${act * .28})`}
                strokeWidth={act * 1.2}
              />
            )
          })
        })
      })}

      {/* Neurons */}
      {layers.map((layer, li) => {
        const x = li * lw + lw / 2
        return layer.acts.map((act, ni) => {
          const y = (H / (layer.acts.length + 1)) * (ni + 1)
          const r = 7 + act * 5
          return (
            <g key={`n-${li}-${ni}`}>
              <circle cx={x} cy={y} r={r + 3} fill={`rgba(74,222,128,${act * .1})`} />
              <circle
                cx={x} cy={y} r={r} fill="#071409"
                stroke={`rgba(74,222,128,${.2 + act * .8})`} strokeWidth={1.5}
              />
              <circle cx={x} cy={y} r={r * .4} fill={`rgba(74,222,128,${act})`} />
            </g>
          )
        })
      })}

      {/* Labels */}
      {layers.map((l, i) => (
        <text
          key={`lbl-${i}`}
          x={i * lw + lw / 2} y={H - 3}
          textAnchor="middle" fill="#2d5c3a" fontSize={6.5}
          fontFamily="Plus Jakarta Sans"
        >
          {l.label?.split(' ')[0]}
        </text>
      ))}
    </svg>
  )
}

/* ── SliderInput ────────────────────────────────────────── */
export function SliderInput({ label, value, min, max, step = 1, unit = '', onChange }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="label mb-0">{label}</label>
        <span className="text-brand-400 font-bold text-sm tabular-nums">
          {value}{unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full cursor-pointer accent-brand-500 h-1.5"
        style={{ accentColor: '#22c55e' }}
      />
      <div className="flex justify-between text-[10px] text-green-900 mt-1">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  )
}

/* ── EmptyState ─────────────────────────────────────────── */
export function EmptyState({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4 opacity-30">{icon}</div>
      <h3 className="font-display font-bold text-green-700 text-lg mb-2">{title}</h3>
      <p className="text-sm text-green-900 max-w-xs">{desc}</p>
    </div>
  )
}

/* ── Spinner ────────────────────────────────────────────── */
export function Spinner({ size = 20 }) {
  return (
    <div
      className="border-2 border-brand-800 border-t-brand-400 rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  )
}

/* ── PageHeader ─────────────────────────────────────────── */
export function PageHeader({ tag, title, desc, children }) {
  return (
    <div className="mb-6">
      {tag && <div className="section-tag mb-3">{tag}</div>}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title">{title}</h1>
          {desc && <p className="text-sm text-green-700 mt-1.5 max-w-xl">{desc}</p>}
        </div>
        {children && <div className="flex items-center gap-3 flex-shrink-0">{children}</div>}
      </div>
    </div>
  )
}

/* ── AlertBanner ────────────────────────────────────────── */
export function AlertBanner({ type = 'info', title, message, action, onAction }) {
  const styles = {
    danger:  'alert-danger',
    warn:    'alert-warn',
    success: 'alert-success',
    info:    'alert-info',
  }
  return (
    <div className={styles[type]}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-green-100 mb-0.5">{title}</p>
          <p className="text-xs text-green-600 leading-relaxed">{message}</p>
        </div>
        {action && (
          <button onClick={onAction} className="btn-primary text-xs px-3 py-1.5 flex-shrink-0">
            {action}
          </button>
        )}
      </div>
    </div>
  )
}
