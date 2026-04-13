import { useState, useEffect, useRef, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { mlAPI, alertsAPI, iotAPI } from '@api/client'
import { useAuthStore } from '@store/authStore'

/* ─────────────────────────────────────────────────────────────
   useLiveSensors  –  Simulates live IoT data (WebSocket ready)
───────────────────────────────────────────────────────────── */
export function useLiveSensors(farmId) {
  const [sensors, setSensors] = useState({
    temp:     27.8,
    humidity: 64,
    moisture: 48,
    ph:       6.7,
    wind:     11.4,
    ndvi:     0.72,
    lux:      840,
    rainfall: 0,
  })
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef(null)

  useEffect(() => {
    if (!farmId) return

    // Try real WebSocket first
    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8000'}/ws/sensors/${farmId}/`
    try {
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen  = () => setIsConnected(true)
      ws.onclose = () => setIsConnected(false)
      ws.onerror = () => {
        // Fallback to simulated data
        setIsConnected(false)
        startSimulation()
      }
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data)
          if (msg.type === 'sensor_update') setSensors(prev => ({ ...prev, ...msg.data }))
        } catch {}
      }
    } catch {
      startSimulation()
    }

    function startSimulation() {
      const t = setInterval(() => {
        setSensors(prev => ({
          temp:     +(prev.temp     + (Math.random() - .5) * .5).toFixed(1),
          humidity: Math.round(Math.max(30, Math.min(95, prev.humidity + (Math.random() - .5) * 2))),
          moisture: Math.round(Math.max(15, Math.min(85, prev.moisture + (Math.random() - .5) * 1.5))),
          ph:       +(Math.max(5.2, Math.min(8.8, prev.ph + (Math.random() - .5) * .06))).toFixed(1),
          wind:     +(Math.max(0, prev.wind + (Math.random() - .5) * 1.5)).toFixed(1),
          ndvi:     +(Math.max(.2, Math.min(.98, prev.ndvi + (Math.random() - .5) * .015))).toFixed(2),
          lux:      Math.round(Math.max(0, Math.min(1200, prev.lux + (Math.random() - .5) * 40))),
          rainfall: +(Math.max(0, prev.rainfall + Math.random() * .1)).toFixed(1),
        }))
      }, 2200)
      return () => clearInterval(t)
    }

    return () => {
      wsRef.current?.close()
      setIsConnected(false)
    }
  }, [farmId])

  const sendCommand = useCallback((cmd) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(cmd))
    }
  }, [])

  return { sensors, isConnected, sendCommand }
}

/* ─────────────────────────────────────────────────────────────
   useAlerts  –  Fetch + mark read + WebSocket push alerts
───────────────────────────────────────────────────────────── */
export function useAlerts(params = {}) {
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: ['alerts', params],
    queryFn:  () => alertsAPI.list(params).then(r => r.data),
    refetchInterval: 30_000,
  })

  const markRead = useMutation({
    mutationFn: (id) => alertsAPI.markRead(id),
    onSuccess:  () => qc.invalidateQueries(['alerts']),
  })

  const resolve = useMutation({
    mutationFn: (id) => alertsAPI.resolve(id),
    onSuccess:  () => {
      toast.success('Alert resolved')
      qc.invalidateQueries(['alerts'])
    },
  })

  return { ...query, markRead: markRead.mutate, resolve: resolve.mutate }
}

/* ─────────────────────────────────────────────────────────────
   useYieldPredict  –  Call ML yield prediction endpoint
───────────────────────────────────────────────────────────── */
export function useYieldPredict() {
  return useMutation({
    mutationFn: (inputs) => mlAPI.yieldPredict(inputs).then(r => r.data),
    onError: () => toast.error('Yield prediction failed'),
  })
}

export function useDiseaseDetect() {
  return useMutation({
    mutationFn: (inputs) => {
      if (inputs instanceof FormData) {
        return mlAPI.diseaseDetect(inputs).then(r => r.data)
      }
      return mlAPI.diseaseDetect(inputs).then(r => r.data)
    },
    onError: () => toast.error('Disease detection failed'),
  })
}

export function useIrrigationOptimize() {
  return useMutation({
    mutationFn: (inputs) => mlAPI.irrigationOptimize(inputs).then(r => r.data),
    onError: () => toast.error('Irrigation optimization failed'),
  })
}

export function usePestRisk() {
  return useMutation({
    mutationFn: (inputs) => mlAPI.pestRisk(inputs).then(r => r.data),
    onError: () => toast.error('Pest risk analysis failed'),
  })
}

export function useSoilAnalyze() {
  return useMutation({
    mutationFn: (inputs) => mlAPI.soilAnalyze(inputs).then(r => r.data),
    onError: () => toast.error('Soil analysis failed'),
  })
}

export function usePriceForecast() {
  return useMutation({
    mutationFn: (inputs) => mlAPI.priceForecast(inputs).then(r => r.data),
    onError: () => toast.error('Price forecast failed'),
  })
}

/* ─────────────────────────────────────────────────────────────
   useFarms  –  Farm list with caching
───────────────────────────────────────────────────────────── */
export function useFarms() {
  return useQuery({
    queryKey: ['farms'],
    queryFn:  () => import('@api/client').then(m => m.farmsAPI.list()).then(r => r.data),
  })
}

/* ─────────────────────────────────────────────────────────────
   useMLModelsStatus  –  Check all models online
───────────────────────────────────────────────────────────── */
export function useMLModelsStatus() {
  return useQuery({
    queryKey: ['ml-status'],
    queryFn:  () => mlAPI.modelsStatus().then(r => r.data),
    refetchInterval: 60_000,
    staleTime: 30_000,
  })
}

/* ─────────────────────────────────────────────────────────────
   useBackendStatus  –  Ping backend every 10s → online/offline
───────────────────────────────────────────────────────────── */
export function useBackendStatus() {
  const [backendOnline, setBackendOnline] = useState(false)

  useEffect(() => {
    const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace('/api/v1', '')

    async function ping() {
      try {
        const res = await fetch(`${BASE}/api/health/`, {
          method: 'GET', signal: AbortSignal.timeout(3000),
        })
        setBackendOnline(res.ok || res.status === 401) // 401 = server up, just not authed
      } catch {
        setBackendOnline(false)
      }
    }

    ping()
    const interval = setInterval(ping, 10000)
    return () => clearInterval(interval)
  }, [])

  return { backendOnline }
}
