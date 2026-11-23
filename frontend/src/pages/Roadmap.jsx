import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  FiArrowLeft,
  FiCheck,
  FiChevronDown,
  FiClock,
  FiFileText,
  FiMap,
  FiSend,
  FiX,
} from 'react-icons/fi'
import api from '../utils/axios'
import { useCoins } from '../apis/user.api'
import RoadmapResult from '../components/roadmap/RoadmapResult'

const PACKAGES = ['10 LPA', '15 LPA', '20 LPA', '30 LPA', '40 LPA']

function Roadmap({ user, setUser }) {
  const navigate = useNavigate()
  const { resume } = useSelector((state) => state.resume)
  const [role, setRole] = useState('')
  const [targetPackage, setTargetPackage] = useState('20 LPA')
  const [useResume, setUseResume] = useState(false)
  const [packageOpen, setPackageOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [roadmap, setRoadmap] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!resume) setUseResume(false)
  }, [resume])

  useEffect(() => {
    const loadHistory = async () => {
      setHistoryLoading(true)
      try {
        const response = await api.get('/api/roadmap/all')
        setHistory(response.data.data || [])
      } catch (requestError) {
        console.log(requestError)
      } finally {
        setHistoryLoading(false)
      }
    }
    loadHistory()
  }, [])

  const loadHistoryItem = async (id) => {
    try {
      const response = await api.get(`/api/roadmap/${id}`)
      setRoadmap(response.data.data)
      setHistoryOpen(false)
    } catch (requestError) {
      console.log(requestError)
    }
  }

  const generate = async () => {
    if (!role.trim() || loading) return
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/api/roadmap/generate', {
        role: role.trim(),
        targetPackage,
        useResume: useResume && Boolean(resume),
        resume,
      })
      setRoadmap(response.data.data)
      try {
        const coins = await useCoins({ coins: 20, action: 'roadmap-builder' })
        setUser((previous) => ({ ...previous, interviewCoin: coins?.interviewCoin }))
      } catch (coinError) {
        console.log('Roadmap generated, but coin deduction failed:', coinError)
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Roadmap generation failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95">
        <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-4 sm:px-6">
          <button onClick={() => navigate('/dashboard')} className="flex h-10 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
            <FiArrowLeft size={16} /> Back
          </button>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Career planning</p>
            <h1 className="text-sm font-bold text-slate-950">Roadmap generator</h1>
          </div>
          <button onClick={() => setHistoryOpen(true)} className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-950">
            <FiClock size={14} /><span className="hidden sm:inline">History</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10">
        <AnimatePresence mode="wait">
          {!roadmap ? (
            <motion.section key="composer" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-auto max-w-3xl">
              <div className="surface-card overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-7 sm:px-8">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><FiMap size={20} /></div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">Personalized plan</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Plan the next step in your career.</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">Choose a role and package. The roadmap will organize the skills, projects, and learning sequence needed to get there.</p>
                </div>

                <div className="grid gap-5 px-6 py-7 sm:px-8 md:grid-cols-2">
                  <label className="md:col-span-2">
                    <span className="mb-2 block text-xs font-semibold text-slate-700">Target role</span>
                    <input value={role} onChange={(event) => setRole(event.target.value)} placeholder="For example: Backend Developer" className="app-input h-12 px-4 text-sm" />
                  </label>

                  <div className="relative">
                    <span className="mb-2 block text-xs font-semibold text-slate-700">Target package</span>
                    <button onClick={() => setPackageOpen(!packageOpen)} className="app-input flex h-12 items-center justify-between px-4 text-left text-sm">
                      {targetPackage}<FiChevronDown size={15} className={`text-slate-400 transition ${packageOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {packageOpen && (
                      <div className="absolute inset-x-0 top-[82px] z-10 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                        {PACKAGES.map((item) => (
                          <button key={item} onClick={() => { setTargetPackage(item); setPackageOpen(false) }} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${targetPackage === item ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>{item}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    disabled={!resume}
                    onClick={() => setUseResume(!useResume)}
                    className={`flex h-12 items-center justify-between rounded-xl border px-4 text-left transition ${useResume ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'} ${!resume ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <span>
                      <span className="block text-xs font-semibold text-slate-700">Use resume</span>
                      <span className="mt-0.5 block text-[10px] text-slate-400">{resume ? 'Personalize the plan' : 'Upload a resume first'}</span>
                    </span>
                    <span className={`flex h-6 w-10 items-center rounded-full p-1 transition ${useResume ? 'justify-end bg-blue-600' : 'justify-start bg-slate-200'}`}>
                      <span className="h-4 w-4 rounded-full bg-white" />
                    </span>
                  </button>
                </div>

                {error && <p className="mx-6 mb-5 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600 sm:mx-8">{error}</p>}

                <div className="flex items-center justify-between border-t border-slate-100 px-6 py-5 sm:px-8">
                  <button onClick={() => navigate('/dashboard')} className="text-xs font-semibold text-slate-400 hover:text-slate-700">Cancel</button>
                  <button disabled={!role.trim() || loading} onClick={generate} className="flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-40">
                    {loading ? 'Generating...' : 'Generate roadmap'} {!loading && <FiSend size={15} />}
                  </button>
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.section key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <RoadmapResult roadmap={roadmap} onClear={() => setRoadmap(null)} />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {historyOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setHistoryOpen(false)} className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm" />
            <motion.aside initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }} className="fixed bottom-0 right-0 top-0 z-50 w-[320px] max-w-[90vw] border-l border-slate-200 bg-white">
              <div className="flex h-[72px] items-center justify-between border-b border-slate-100 px-5">
                <h2 className="text-sm font-bold text-slate-950">Roadmap history</h2>
                <button onClick={() => setHistoryOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><FiX size={16} /></button>
              </div>
              <div className="space-y-2 p-4">
                {historyLoading ? <p className="py-8 text-center text-xs text-slate-400">Loading...</p> : history.length === 0 ? <p className="py-8 text-center text-xs text-slate-400">No roadmaps yet.</p> : history.map((item) => (
                  <button key={item._id} onClick={() => loadHistoryItem(item._id)} className="w-full rounded-xl border border-slate-200 p-4 text-left hover:border-blue-200">
                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.targetPackage} · {item.duration}</p>
                  </button>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Roadmap
