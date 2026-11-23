import React, { useState } from 'react'
import { motion } from 'motion/react'
import { FiArrowLeft, FiArrowRight, FiEye } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import ResumeForm from '../components/resume/ResumeForm'
import initialData from '../components/resume/initialData'
import PreviewResume from '../components/resume/PreviewResume'

const STEPS = [
  { step: 1, title: 'Personal information', subtitle: 'Your basic contact details' },
  { step: 2, title: 'Professional summary', subtitle: 'Introduce your experience and direction' },
  { step: 3, title: 'Skills', subtitle: 'Select the skills relevant to your target role' },
  { step: 4, title: 'Work experience', subtitle: 'Add roles, outcomes, and responsibilities' },
  { step: 5, title: 'Projects', subtitle: 'Showcase the work that proves your skills' },
  { step: 6, title: 'Education', subtitle: 'Complete your academic background' },
]

function ResumeBuilder({ user, setUser }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState(initialData)
  const [showPreview, setShowPreview] = useState(false)
  const navigate = useNavigate()
  const activeStep = STEPS.find((item) => item.step === currentStep)
  const progress = (currentStep / STEPS.length) * 100

  if (showPreview) {
    return <PreviewResume data={data} user={user} setUser={setUser} onBack={() => setShowPreview(false)} />
  }

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95">
        <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-4 sm:px-6">
          <button onClick={() => navigate('/dashboard')} className="flex h-10 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
            <FiArrowLeft size={16} /><span className="hidden sm:inline">Dashboard</span>
          </button>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Career tools</p>
            <h1 className="text-sm font-bold text-slate-950">Resume builder</h1>
          </div>
          <button onClick={() => setShowPreview(true)} className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:border-slate-300">
            <FiEye size={14} /><span className="hidden sm:inline">Preview</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="surface-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400">Step {currentStep} of {STEPS.length}</span>
              <span className="font-semibold text-slate-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full bg-blue-600" />
            </div>
            <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">{activeStep.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{activeStep.subtitle}</p>
          </div>

          <div className="px-6 py-7 sm:px-8">
            <ResumeForm step={currentStep} data={data} setData={setData} />
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-5 sm:px-8">
            <button
              onClick={() => setCurrentStep((step) => Math.max(1, step - 1))}
              disabled={currentStep === 1}
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:border-slate-300 disabled:opacity-40"
            >
              <FiArrowLeft size={15} /> Previous
            </button>

            <div className="hidden items-center gap-1.5 sm:flex">
              {STEPS.map((item) => (
                <button key={item.step} onClick={() => setCurrentStep(item.step)} className={`h-1.5 rounded-full transition ${item.step === currentStep ? 'w-5 bg-blue-600' : item.step < currentStep ? 'w-1.5 bg-slate-400' : 'w-1.5 bg-slate-200'}`} aria-label={`Go to step ${item.step}`} />
              ))}
            </div>

            {currentStep === STEPS.length ? (
              <button onClick={() => setShowPreview(true)} className="flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
                Preview <FiEye size={15} />
              </button>
            ) : (
              <button onClick={() => setCurrentStep((step) => Math.min(STEPS.length, step + 1))} className="flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
                Next <FiArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ResumeBuilder
