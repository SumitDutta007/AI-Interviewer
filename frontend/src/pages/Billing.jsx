import React from 'react'
import { FiArrowLeft, FiMenu } from 'react-icons/fi'
import { GiTwoCoins } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'
import api from '../utils/axios'
import PricingCard from '../components/PricingCard'

const plans = [
  { title: 'Free', price: 'Free', coins: 150, button: 'Included', popular: false, disabled: true, features: ['Resume builder', 'Resume scorer', 'Roadmap generator', 'AI interviews'] },
  { title: 'Starter', price: '199', coins: 300, button: 'Buy now', popular: true, disabled: false, features: ['300 interview coins', 'Unlimited resume scores', 'Unlimited roadmaps', 'Priority AI responses'] },
]

function Billing({ user, setUser }) {
  const navigate = useNavigate()

  const handlePayment = async (plan) => {
    if (plan.disabled) return
    try {
      const result = await api.post('/api/billing/create', { planId: plan.title.toLowerCase() })
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.order.amount,
        currency: result.data.order.currency,
        name: 'FresherAI',
        description: `${plan.title} - ${plan.coins} Interview Coins`,
        order_id: result.data.order.id,
        handler: async (response) => {
          try {
            await api.post('/api/billing/verify', response)
            const coinRes = await api.post('/api/auth/add-coins', { coins: plan.coins })
            setUser((previous) => ({ ...previous, interviewCoin: coinRes.data.interviewCoin }))
            navigate('/dashboard')
          } catch (error) {
            alert(error?.response?.data?.message || 'Payment verification failed')
          }
        },
        theme: { color: '#2563eb' },
      }
      new window.Razorpay(options).open()
    } catch (error) {
      console.log(error)
      alert(error?.response?.data?.message || 'Unable to start payment')
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95">
        <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-4 sm:px-6">
          <button onClick={() => navigate('/dashboard')} className="flex h-10 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><FiArrowLeft size={16} /><span className="hidden sm:inline">Dashboard</span></button>
          <div className="text-center"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Account</p><h1 className="text-sm font-bold text-slate-950">Interview coins</h1></div>
          <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-800"><GiTwoCoins className="text-amber-500" /> {user?.interviewCoin ?? 0}</div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 max-w-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">Plans</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Keep your preparation moving.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Coins are used for resume scoring, roadmap generation, and mock interviews.</p>
        </div>
        <div className="grid place-items-center gap-4 md:grid-cols-2">
          {plans.map((item) => <PricingCard key={item.title} {...item} onBuy={() => handlePayment(item)} />)}
        </div>
      </main>
    </div>
  )
}

export default Billing
