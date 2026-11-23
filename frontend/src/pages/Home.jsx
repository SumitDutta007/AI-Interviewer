import React, { useState } from 'react'
import { motion } from 'motion/react'
import { FiArrowRight, FiBarChart2, FiCheck, FiFileText, FiMap, FiMic } from 'react-icons/fi'
import LoginModel from '../components/LoginModel'

const capabilities = [
  { icon: FiMic, title: 'Realistic interviews', text: 'Technical and HR practice with role-specific questions.' },
  { icon: FiFileText, title: 'Resume intelligence', text: 'ATS analysis, scoring, and practical resume improvements.' },
  { icon: FiMap, title: 'Career roadmaps', text: 'Structured learning paths aligned to your target role.' },
  { icon: FiBarChart2, title: 'Clear feedback', text: 'Measure strengths, gaps, and performance over time.' },
]

function Home({ setUser }) {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f8fb] text-slate-900">
      <nav className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-5">
          <button onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-3">
            <span className="brand-mark flex h-9 w-9 items-center justify-center rounded-xl text-white"><FiMic size={17} /></span>
            <span className="text-[15px] font-bold tracking-tight text-slate-950">FresherAI</span>
          </button>
          <button onClick={() => setShowLogin(true)} className="flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
            Sign in <FiArrowRight size={15} />
          </button>
        </div>
      </nav>

      <main>
        <section className="mx-auto grid min-h-[680px] max-w-[1180px] items-center gap-12 px-5 pb-16 pt-[112px] lg:grid-cols-[.92fr_1.08fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> AI career preparation
            </div>
            <h1 className="max-w-[620px] text-[44px] font-bold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-[58px]">
              Prepare for interviews with a plan.
            </h1>
            <p className="mt-6 max-w-[540px] text-base leading-7 text-slate-500">
              Practice realistic questions, improve your resume, and get a focused roadmap for the role you want.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setShowLogin(true)} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,.18)] hover:bg-blue-700">
                Get started <FiArrowRight size={16} />
              </button>
              <a href="#features" className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:border-slate-300">
                Explore features
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
              {['Resume analysis', 'AI feedback', 'Progress tracking'].map((item) => (
                <span key={item} className="flex items-center gap-1.5"><FiCheck size={13} className="text-emerald-500" /> {item}</span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.08 }} className="relative">
            <div className="absolute -inset-10 rounded-full bg-blue-100/50 blur-3xl" />
            <div className="surface-card relative overflow-hidden p-3 sm:p-5">
              <div className="rounded-[14px] bg-slate-950 p-5 sm:p-7">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Readiness</p>
                    <p className="mt-1 text-lg font-bold text-white">Interview performance</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-semibold text-emerald-300">On track</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ['Interview', '72%', 'text-blue-300'],
                    ['Resume', '84%', 'text-violet-300'],
                    ['Roadmap', '68%', 'text-amber-300'],
                  ].map(([label, value, color]) => (
                    <div key={label} className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-3 sm:p-4">
                      <p className="text-[10px] text-slate-500">{label}</p>
                      <p className={`mt-2 text-xl font-bold ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
                  <div className="mb-3 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300">Weekly progress</span>
                    <span className="text-slate-500">4 of 5 sessions</span>
                  </div>
                  <div className="flex h-16 items-end gap-2">
                    {[38, 55, 46, 72, 64, 88, 78].map((height, index) => (
                      <div key={index} className="flex-1 rounded-t-md bg-blue-500/70" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="border-y border-slate-200 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-[1180px] px-5">
            <div className="mb-9 max-w-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">One preparation workspace</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Everything you need to prepare.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {capabilities.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.title} className="rounded-2xl border border-slate-200 p-5">
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><Icon size={18} /></div>
                    <h3 className="text-sm font-bold text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{item.text}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-7 text-xs text-slate-400">
          <span className="font-semibold text-slate-700">FresherAI</span>
          <span>© {new Date().getFullYear()} FresherAI</span>
        </div>
      </footer>

      {showLogin && <LoginModel onClose={() => setShowLogin(false)} setUser={setUser} />}
    </div>
  )
}

export default Home
