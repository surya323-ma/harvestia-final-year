import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import { authAPI } from '@api/client'

/* ── Login Schema ── */
const loginSchema = z.object({
  email:    z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
})

/* ── SHARED AUTH LAYOUT ── */
function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-surface bg-grid flex items-center justify-center px-4">
      {/* Ambient orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,222,128,.04), transparent)', filter: 'blur(60px)' }} />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(96,165,250,.03), transparent)', filter: 'blur(50px)' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <img
  src="/harvestia-logo.png"
  alt="Harvestia"
  className="w-27 h-24 rounded-full object-cover"
/>
          <span className="font-display font-bold text-2xl text-brand-400 tracking-tight">Harvestia</span>
        </div>

        <div className="card p-8">
          <h1 className="font-display font-bold text-green-50 text-2xl mb-1.5 text-center" style={{ letterSpacing: '-.5px' }}>
            {title}
          </h1>
          <p className="text-sm text-green-800 text-center mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════════════════════ */
export function LoginPage() {
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const login    = useAuthStore(s => s.login)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'demo@harvestia.in', password: 'demo@123' },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Try real API, fallback to demo
      let user, token, refresh
      try {
        const res = await authAPI.login(data)
        user    = res.data.user
        token   = res.data.access
        refresh = res.data.refresh
      } catch {
        // Demo mode: mock user
        user    = { id: '1', full_name: 'Rajesh Kumar', email: data.email, role: 'farmer', plan: 'pro', state: 'Maharashtra', district: 'Pune', is_verified: true }
        token   = 'demo-token-' + Date.now()
        refresh = 'demo-refresh'
      }
      login(user, token, refresh)
      toast.success(`Welcome back, ${user.full_name.split(' ')[0]}! 🌿`)
      navigate('/app/dashboard')
    } catch (err) {
      toast.error('Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your Harvestia account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Email Address</label>
          <input {...register('email')} type="email" className="input" placeholder="you@harvestia.in" />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input {...register('password')} type={showPwd ? 'text' : 'password'}
              className="input pr-11" placeholder="Enter password" />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-800 hover:text-brand-400 transition-colors">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-green-700 cursor-pointer">
            <input type="checkbox" className="accent-brand-500 w-3.5 h-3.5" />
            Remember me
          </label>
          <a href="#" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Forgot password?
          </a>
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center py-3.5 text-sm mt-2">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
        </button>

        <div className="text-center pt-2">
          <p className="text-sm text-green-800">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </form>

      {/* Demo hint */}
      <div className="mt-6 p-3 rounded-xl border border-brand-800/40 bg-brand-400/4 text-center">
        <p className="text-xs text-green-800">
          <span className="text-brand-400 font-bold">Demo:</span> Use any email + password to explore
        </p>
      </div>
    </AuthLayout>
  )
}

/* ══════════════════════════════════════════════════════════
   REGISTER PAGE
══════════════════════════════════════════════════════════ */
const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name required'),
  email:     z.string().email('Valid email required'),
  phone:     z.string().min(10, 'Valid phone required'),
  state:     z.string().min(1, 'State required'),
  role:      z.enum(['farmer', 'enterprise', 'advisor']),
  password:  z.string().min(8, 'Min 8 characters'),
  password2: z.string(),
}).refine(d => d.password === d.password2, {
  message: 'Passwords do not match', path: ['password2'],
})

export function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const login    = useAuthStore(s => s.login)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'farmer' },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      let user, token, refresh
      try {
        const res = await authAPI.register(data)
        user    = res.data.user
        token   = res.data.access
        refresh = res.data.refresh
      } catch {
        user    = { id: '1', full_name: data.full_name, email: data.email, role: data.role, plan: 'free', state: data.state }
        token   = 'demo-token-' + Date.now()
        refresh = 'demo-refresh'
      }
      login(user, token, refresh)
      toast.success('Account created! Welcome to Harvestia 🌿')
      navigate('/app/dashboard')
    } catch {
      toast.error('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const STATES = ['Punjab','Haryana','Uttar Pradesh','Madhya Pradesh','Maharashtra','Gujarat',
    'Rajasthan','Bihar','West Bengal','Andhra Pradesh','Karnataka','Tamil Nadu','Telangana','Other']

  return (
    <AuthLayout title="Create account" subtitle="Join 340+ agri enterprises on Harvestia">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="label">Full Name</label>
            <input {...register('full_name')} className="input" placeholder="Rajesh Kumar" />
            {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="label">Email</label>
            <input {...register('email')} type="email" className="input" placeholder="you@farm.in" />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label">Phone</label>
            <input {...register('phone')} className="input" placeholder="+91 98765 43210" />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="label">State</label>
            <select {...register('state')} className="input">
              <option value="">Select state</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state.message}</p>}
          </div>

          <div>
            <label className="label">Role</label>
            <select {...register('role')} className="input">
              <option value="farmer">Farmer</option>
              <option value="enterprise">Agri Enterprise</option>
              <option value="advisor">Field Advisor</option>
            </select>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input {...register('password')} type={showPwd ? 'text' : 'password'}
                className="input pr-10" placeholder="Min 8 chars" />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-800 hover:text-brand-400 transition-colors">
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="label">Confirm Password</label>
            <input {...register('password2')} type="password" className="input" placeholder="Repeat password" />
            {errors.password2 && <p className="text-red-400 text-xs mt-1">{errors.password2.message}</p>}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-sm mt-2">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
        </button>

        <p className="text-center text-sm text-green-800">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
