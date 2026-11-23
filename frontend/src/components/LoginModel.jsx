import React, { useState } from 'react'
import { FiMic, FiX } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../utils/firebase'
import api from '../utils/axios'

function LoginModel({ onClose, setUser }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleAuth = async () => {
    setError('')
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, provider)
      const token = await result.user.getIdToken()
      const response = await api.post('/api/auth/login', { token })
      setUser(response?.data?.user)
      onClose()
    } catch (authError) {
      if (authError.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized in Firebase.')
      } else if (authError.code === 'auth/popup-blocked' || authError.code === 'auth/popup-closed-by-user') {
        setError('The Google sign-in window was blocked or closed.')
      } else {
        setError(authError.response?.data?.message || authError.message || 'Unable to sign in.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,.22)]">
        <button onClick={onClose} className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
          <FiX size={17} />
        </button>
        <div className="px-7 pb-6 pt-8 sm:px-8">
          <div className="brand-mark mb-5 flex h-11 w-11 items-center justify-center rounded-xl text-white"><FiMic size={20} /></div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">Welcome to FresherAI</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to access interviews, resume tools, and career roadmaps.</p>
          <button onClick={handleGoogleAuth} disabled={loading} className="mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60">
            <FcGoogle size={18} />
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>
          {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-600" role="alert">{error}</p>}
        </div>
        <div className="border-t border-slate-100 bg-slate-50 px-7 py-4 text-center text-[11px] font-medium text-slate-400 sm:px-8">
          Secure authentication powered by Firebase
        </div>
      </div>
    </div>
  )
}

export default LoginModel
