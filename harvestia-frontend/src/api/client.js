import axios from 'axios'
import { useAuthStore } from '@store/authStore'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

/* ── Request: attach JWT ── */
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/* ── Response: handle 401 / errors ── */
api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = useAuthStore.getState().refresh
        const { data } = await axios.post(`${BASE_URL}/auth/refresh/`, { refresh })
        useAuthStore.getState().login(
          useAuthStore.getState().user,
          data.access,
          refresh
        )
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        useAuthStore.getState().logout()
      }
    }
    const msg = err.response?.data?.detail || err.response?.data?.error || 'Something went wrong'
    if (err.response?.status >= 500) toast.error('Server error. Please try again.')
    return Promise.reject(err)
  }
)

/* ── Typed API helpers ── */
export const authAPI = {
  login:    data => api.post('/auth/login/', data),
  register: data => api.post('/auth/register/', data),
  logout:   data => api.post('/auth/logout/', data),
  profile:  ()   => api.get('/auth/profile/'),
  updateProfile: data => api.patch('/auth/profile/', data),
}

export const farmsAPI = {
  list:        ()      => api.get('/farms/'),
  get:         id      => api.get(`/farms/${id}/`),
  create:      data    => api.post('/farms/', data),
  update:      (id, d) => api.patch(`/farms/${id}/`, d),
  delete:      id      => api.delete(`/farms/${id}/`),
  fields:      id      => api.get(`/farms/${id}/fields/`),
  createField: (id, d) => api.post(`/farms/${id}/fields/`, d),
}

export const cropsAPI = {
  seasons:      params => api.get('/crops/seasons/', { params }),
  getSeason:    id     => api.get(`/crops/seasons/${id}/`),
  createSeason: data   => api.post('/crops/seasons/', data),
  updateSeason: (id,d) => api.patch(`/crops/seasons/${id}/`, d),
  growthLogs:   id     => api.get(`/crops/seasons/${id}/logs/`),
  addGrowthLog: (id,d) => api.post(`/crops/seasons/${id}/logs/`, d),
  inputs:       id     => api.get(`/crops/seasons/${id}/inputs/`),
  addInput:     (id,d) => api.post(`/crops/seasons/${id}/inputs/`, d),
}

export const mlAPI = {
  yieldPredict:       data => api.post('/ml/yield/predict/', data),
  diseaseDetect:      data => api.post('/ml/disease/detect/', data),
  irrigationOptimize: data => api.post('/ml/irrigation/optimize/', data),
  pestRisk:           data => api.post('/ml/pest/risk/', data),
  soilAnalyze:        data => api.post('/ml/soil/analyze/', data),
  priceForecast:      data => api.post('/ml/price/forecast/', data),
  sensorAnomaly:      data => api.post('/ml/sensor/anomaly/', data),
  fieldIntelligence:  data => api.post('/ml/field/intelligence/', data),
  modelsStatus:       ()   => api.get('/ml/models/status/'),
}

export const iotAPI = {
  devices:  params => api.get('/iot/devices/', { params }),
  readings: params => api.get('/iot/readings/', { params }),
  satellite:params => api.get('/iot/satellite/', { params }),
}

export const alertsAPI = {
  list:    params => api.get('/alerts/', { params }),
  markRead:   id => api.post(`/alerts/${id}/read/`),
  resolve:    id => api.post(`/alerts/${id}/resolve/`),
  readAll:    () => api.post('/alerts/read-all/'),
  summary:    () => api.get('/alerts/summary/'),
}

export const analyticsAPI = {
  dashboard: () => api.get('/analytics/dashboard/'),
  yieldHistory: params => api.get('/analytics/yield-history/', { params }),
}

export const marketplaceAPI = {
  products:   params  => api.get('/marketplace/products/', { params }),
  product:    id      => api.get(`/marketplace/products/${id}/`),
  featured:   ()      => api.get('/marketplace/products/featured/'),
  categories: ()      => api.get('/marketplace/products/categories/'),
  orders:     ()      => api.get('/marketplace/orders/'),
  placeOrder: data    => api.post('/marketplace/orders/', data),
  cancelOrder:id      => api.post(`/marketplace/orders/${id}/cancel/`),
}
