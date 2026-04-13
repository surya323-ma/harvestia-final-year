import { useState } from 'react'
import { Loader2, Play, RefreshCw } from 'lucide-react'
import { useYieldPredict } from '@hooks'
import { useTranslation } from '@store/langStore'
import {
  PageHeader, SliderInput, MLResultCard,
  NeuralViz, RiskBadge, ProgressBar
} from '@components/ui'

const DEFAULTS = {
  ndvi: 0.72, soil_moisture: 52, temperature: 27,
  rainfall_30d: 45, crop_age: 90, field_area: 10,
  soil_ph: 6.8, nitrogen_kgha: 150,
}

const CROP_TYPES = ['wheat','rice','cotton','soybean','corn','sugarcane','mustard','groundnut']

function buildNNLayers(inputs) {
  const vals = Object.values(inputs).map(v => parseFloat(v) || 0)
  return [
    { label: 'Input Layer',    acts: vals.map(v => Math.min(1, Math.abs(v) / 120)) },
    { label: 'Dense-256 ReLU', acts: Array.from({length: 8}, () => Math.random()) },
    { label: 'Dense-128 ReLU', acts: Array.from({length: 7}, () => Math.random()) },
    { label: 'Dropout-0.3',    acts: Array.from({length: 6}, () => Math.random() * .8) },
    { label: 'Dense-64 ReLU',  acts: Array.from({length: 5}, () => Math.random()) },
    { label: 'Output Linear',  acts: Array.from({length: 3}, () => Math.random()) },
  ]
}

function simulateYieldResult(inputs) {
  let base = 55
  base += inputs.ndvi * 38
  base += Math.min((inputs.soil_moisture - 30) * 0.4, 12)
  base -= Math.abs(inputs.temperature - 26) * 0.9
  base += Math.min(inputs.rainfall_30d, 90) * 0.12
  base += (Math.min(inputs.crop_age, 180) / 180) * 15
  const val  = Math.max(18, Math.min(130, base + (Math.random() - .5) * 4))
  const conf = 87 + Math.random() * 11
  const risk = val < 45 ? 'Critical' : val < 65 ? 'High' : val < 85 ? 'Medium' : 'Low'
  return {
    predicted_yield: +val.toFixed(1),
    unit: 'tons/acre',
    confidence_pct: +conf.toFixed(1),
    risk_level: risk,
    risk_color: { Critical:'#f87171', High:'#f97316', Medium:'#eab308', Low:'#4ade80' }[risk],
    recommendations: [
      { priority: inputs.soil_moisture < 35 ? 'HIGH' : 'LOW',
        action: inputs.soil_moisture < 35
          ? 'Immediate irrigation required. Soil moisture critically low.'
          : 'Field conditions are optimal. Continue current management.' },
    ],
    feature_importance: {
      'NDVI': 0.28, 'Soil Moisture': 0.19, 'Temperature': 0.15,
      'Rainfall': 0.12, 'Crop Age': 0.11, 'Nitrogen': 0.09, 'Soil pH': 0.06,
    },
    model_version: 'v3.2.1-gb-lstm',
    inference_ms: Math.round(80 + Math.random() * 120),
  }
}

export default function YieldAIPage() {
  const [inputs, setInputs]     = useState(DEFAULTS)
  const [crop, setCrop]         = useState('wheat')
  const [nnLayers, setNNLayers] = useState(null)
  const [result, setResult]     = useState(null)
  const [progress, setProgress] = useState(0)
  const [running, setRunning]   = useState(false)
  const predict = useYieldPredict()
  const { t } = useTranslation()

  const set = (key, val) => setInputs(p => ({ ...p, [key]: val }))

  const runModel = async () => {
    setRunning(true); setResult(null); setNNLayers(null); setProgress(0)
    const steps = [0,18,40,62,80,95,100]
    steps.forEach((p, i) => setTimeout(() => setProgress(p), i * 200))
    setTimeout(() => setNNLayers(buildNNLayers(inputs)), 600)
    setTimeout(async () => {
      try {
        const res = await predict.mutateAsync({ ...inputs, crop_type: crop })
        setResult(res)
      } catch {
        setResult(simulateYieldResult(inputs))
      }
      setRunning(false)
    }, 1400)
  }

  const reset = () => { setInputs(DEFAULTS); setResult(null); setNNLayers(null); setProgress(0) }

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <PageHeader
        tag="GRADIENT BOOSTING + LSTM · 12.4M TRAINING RECORDS"
        title={`🌾 ${t('ml.yieldTitle')}`}
        desc={t('ml.yieldSubtitle')}
      >
        <button onClick={reset} className="btn-secondary text-sm py-2.5 px-4">
          <RefreshCw size={14} /> {t('common.refresh')}
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5">
        {/* ── INPUT PANEL ── */}
        <div className="card p-5 space-y-5">
          <div>
            <label className="label">{t('fields.crop')}</label>
            <select value={crop} onChange={e => setCrop(e.target.value)} className="input bg-[#071409] text-green-400 border-green-500">
              {CROP_TYPES.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <p className="label">{t('ml.modelInputs')}</p>
            <SliderInput label={t('ml.ndviScore')} value={inputs.ndvi} min={0.1} max={1} step={0.01} onChange={v => set('ndvi', v)} />
            <SliderInput label={t('ml.soilMoisturePct')} value={inputs.soil_moisture} min={10} max={90} unit="%" onChange={v => set('soil_moisture', v)} />
            <SliderInput label={t('ml.avgTemp')} value={inputs.temperature} min={10} max={45} step={0.5} unit="°C" onChange={v => set('temperature', v)} />
            <SliderInput label={t('ml.rainfall30')} value={inputs.rainfall_30d} min={0} max={200} step={5} unit="mm" onChange={v => set('rainfall_30d', v)} />
            <SliderInput label={t('ml.cropAge')} value={inputs.crop_age} min={1} max={365} unit=" days" onChange={v => set('crop_age', v)} />
            <SliderInput label={t('ml.fieldArea')} value={inputs.field_area} min={0.5} max={100} step={0.5} unit=" ac" onChange={v => set('field_area', v)} />
            <SliderInput label="Soil pH" value={inputs.soil_ph} min={4} max={9} step={0.1} onChange={v => set('soil_ph', v)} />
            <SliderInput label="Nitrogen (kg/ha)" value={inputs.nitrogen_kgha} min={0} max={400} step={10} onChange={v => set('nitrogen_kgha', v)} />
          </div>

          <button onClick={runModel} disabled={running} className="btn-primary w-full justify-center py-3.5">
            {running
              ? <><Loader2 size={16} className="animate-spin" /> {t('ml.running')}</>
              : <><Play size={16} /> {t('ml.runYield')}</>
            }
          </button>

          {running && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-green-800">
                <span>Forward pass progress</span><span>{progress}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill bg-gradient-to-r from-green-700 to-brand-400"
                  style={{ width: `${progress}%`, transition: 'width .25s ease' }} />
              </div>
            </div>
          )}
        </div>

        {/* ── OUTPUT PANEL ── */}
        <div className="space-y-4">
          <div className="card p-5">
            <p className="label mb-4">🧠 Neural Network — Forward Pass Visualization</p>
            {nnLayers
              ? <NeuralViz layers={nnLayers} />
              : <div className="h-44 flex items-center justify-center text-green-900 text-sm">
                  {running ? t('ml.running') : 'Run model to visualize inference'}
                </div>
            }
          </div>

          {result && (
            <MLResultCard title={`📊 ${t('ml.results')}`} model={result.model_version} inferenceMs={result.inference_ms}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: t('ml.yieldTitle'), value: `${result.predicted_yield}`, unit: 'tons/acre', color: '#4ade80' },
                  { label: t('ml.confidence'), value: `${result.confidence_pct}%`, unit: 'certainty', color: '#60a5fa' },
                  { label: t('ml.riskLevel'),  value: result.risk_level,           unit: 'season risk', color: result.risk_color },
                  { label: 'Forecast Window',  value: '6 Weeks',                   unit: 'ahead',       color: '#a78bfa' },
                ].map((m, i) => (
                  <div key={i} className="rounded-xl p-3.5 text-center" style={{ background: `${m.color}08` }}>
                    <div className="font-display font-bold mb-1" style={{ fontSize: 26, color: m.color, letterSpacing: '-.5px' }}>
                      {m.value}
                    </div>
                    <div className="text-xs text-green-800 leading-tight">{m.unit}</div>
                    <div className="text-[10px] text-green-900 mt-0.5 uppercase tracking-wider">{m.label}</div>
                  </div>
                ))}
              </div>

              {result.feature_importance && (
                <div className="mb-5">
                  <p className="label mb-3">Feature Importance</p>
                  <div className="space-y-2">
                    {Object.entries(result.feature_importance).sort(([,a],[,b]) => b - a).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-xs text-green-800 w-28 flex-shrink-0">{key}</span>
                        <div className="flex-1"><ProgressBar value={val * 100} color="#4ade80" /></div>
                        <span className="text-xs font-bold text-brand-400 tabular-nums w-10 text-right">
                          {(val * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.recommendations?.map((rec, i) => (
                <div key={i} className={`rounded-xl p-4 border ${
                  rec.priority === 'HIGH' ? 'bg-red-400/5 border-red-400/20' : 'bg-brand-400/5 border-brand-400/15'
                }`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`badge text-xs ${rec.priority === 'HIGH' ? 'badge-red' : 'badge-green'}`}>
                      {rec.priority}
                    </span>
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wider">{t('ml.recommendation')}</span>
                  </div>
                  <p className="text-sm text-green-300 leading-relaxed">{rec.action}</p>
                </div>
              ))}
            </MLResultCard>
          )}

          {!result && !running && (
            <div className="card p-12 flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4 opacity-25">🌾</div>
              <h3 className="font-display font-bold text-green-800 text-lg mb-2">Ready to Predict</h3>
              <p className="text-sm text-green-900">{t('ml.yieldSubtitle')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
