import React, { useRef } from 'react'
import { motion } from 'motion/react'
import { FiArrowLeft, FiCheck, FiTarget, FiTrendingUp, FiX } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import DownloadBtn from '../resume/DownloadBtn'

function Step3report({ report, user, setUser }) {
  const navigate = useNavigate()
  const reportRef = useRef(null)

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95">
        <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-4 sm:px-6">
          <button onClick={() => navigate('/dashboard')} className="flex h-10 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><FiArrowLeft size={16} /> <span className="hidden sm:inline">Dashboard</span></button>
          <div className="text-center"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Performance report</p><h1 className="text-sm font-bold text-slate-950">Interview complete</h1></div>
          <DownloadBtn docRef={reportRef} user={user} setUser={setUser} />
        </div>
      </header>

      <main ref={reportRef} className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-5 grid gap-3 md:grid-cols-3">
          {[
            { label: 'Overall score', value: `${report.overallScore}/100`, icon: FiTarget, tone: 'bg-blue-50 text-blue-600' },
            { label: 'Questions', value: report.questions.length, icon: FiTrendingUp, tone: 'bg-violet-50 text-violet-600' },
            { label: 'Status', value: 'Completed', icon: FiCheck, tone: 'bg-emerald-50 text-emerald-600' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <article key={item.label} className="surface-card p-5">
                <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl ${item.tone}`}><Icon size={18} /></div>
                <p className="text-xs font-medium text-slate-400">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">{item.value}</p>
              </article>
            )
          })}
        </motion.div>

        <section className="surface-card mb-5 p-6 sm:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Summary</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">{report.summary}</p>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <article className="surface-card p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-950"><FiTrendingUp className="text-emerald-500" /> Strengths</h2>
            <div className="mt-4 space-y-2">
              {report.strengths?.length ? report.strengths.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3.5"><FiCheck className="mt-0.5 shrink-0 text-emerald-600" /><p className="text-xs leading-5 text-slate-600">{item}</p></div>
              )) : <p className="text-xs text-slate-400">No strengths available.</p>}
            </div>
          </article>

          <article className="surface-card p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-950"><FiX className="text-red-500" /> Areas to improve</h2>
            <div className="mt-4 space-y-2">
              {report.weaknesses?.length ? report.weaknesses.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/60 p-3.5"><FiX className="mt-0.5 shrink-0 text-red-500" /><p className="text-xs leading-5 text-slate-600">{item}</p></div>
              )) : <p className="text-xs text-slate-400">No weaknesses found.</p>}
            </div>
          </article>
        </section>

        {report.recommendations?.length > 0 && (
          <section className="surface-card mt-5 p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Recommendations</p>
            <div className="mt-4 space-y-2">
              {report.recommendations.map((item, index) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3.5"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600">{index + 1}</span><p className="text-xs leading-5 text-slate-600">{item}</p></div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default Step3report
