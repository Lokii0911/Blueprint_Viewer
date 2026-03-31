import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { AtSign, Lock, Compass, AlertCircle } from 'lucide-react'
import api from '../lib/api.js'
import useStore from '../store/useStore.js'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { email, password })
      setAuth(data.token, email)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[100px] pointer-events-none"
        style={{ background: 'var(--color-primary)' }} />

      <motion.main
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-surface border border-border mb-5"
            style={{ boxShadow: '0 0 30px rgba(124,109,250,0.15)' }}>
            <Compass size={28} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-text mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
            Blueprint<span style={{ color: 'var(--color-primary)' }}>AI</span>
          </h1>
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--color-muted)' }}>
            Create your workspace
          </p>
        </div>

        <div className="card p-8" style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}>
          <h2 className="text-lg font-semibold mb-6 text-text" style={{ fontFamily: 'var(--font-headline)' }}>
            Register Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest mb-2"
                style={{ color: 'var(--color-muted)' }}>Email</label>
              <div className="relative">
                <input type="email" className="input-field pr-10" placeholder="you@company.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
                <AtSign size={16} className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-muted)' }} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-widest mb-2"
                style={{ color: 'var(--color-muted)' }}>Password</label>
              <div className="relative">
                <input type="password" className="input-field pr-10" placeholder="Min 6 characters"
                  value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-muted)' }} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-widest mb-2"
                style={{ color: 'var(--color-muted)' }}>Confirm Password</label>
              <div className="relative">
                <input type="password" className="input-field pr-10" placeholder="Repeat password"
                  value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-muted)' }} />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                style={{ background: 'var(--color-red-dim)', color: 'var(--color-red)', border: '1px solid rgba(244,63,94,0.2)' }}
              >
                <AlertCircle size={14} />{error}
              </motion.div>
            )}

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="btn-primary w-full py-3.5 text-sm tracking-wider uppercase"
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          <div className="mt-7 pt-6 border-t text-center" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:opacity-80 transition-opacity"
                style={{ color: 'var(--color-primary)' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </motion.main>
    </div>
  )
}
