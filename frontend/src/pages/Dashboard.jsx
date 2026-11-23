import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import {
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiFileText,
  FiMap,
  FiMenu,
  FiMic,
  FiStar,
  FiTrendingUp,
} from 'react-icons/fi'
import Sidebar from '../components/Sidebar'
import api from '../utils/axios'
import { getAllInterviews } from '../apis/interview.api'

const features = [
  { title: 'Mock interview', description: 'Practice technical or HR interviews with targeted questions.', icon: FiMic, route: '/interview', tone: 'bg-blue-50 text-blue-600' },
  { title: 'Resume scorer', description: 'Get an ATS score and actionable improvement feedback.', icon: FiStar, route: '/scorer', tone: 'bg-violet-50 text-violet-600' },
  { title: 'Resume builder', description: 'Create a structured, professional resume in guided steps.', icon: FiFileText, route: '/resume', tone: 'bg-emerald-50 text-emerald-600' },
  { title: 'Career roadmap', description: 'Build a focused learning path for your target role.', icon: FiMap, route: '/roadmap', tone: 'bg-amber-50 text-amber-600' },
]

function Dashboard({ user, setUser }) {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [stats, setStats] = useState({
    totalInterviews: 0,
    totalQuestions: 0,
    completed: 0,
    averageScore: 0,
  })
  const [technicalData, setTechnicalData] = useState([])
  const [hrData, setHrData] = useState([])

  useEffect(() => {
    getAllInterviews().then((response) => {
      if (!response?.stats) return
      setStats(response.stats)
      setTechnicalData(response.technicalData || [])
      setHrData(response.hrData || [])
    })
  }, [])

  const handleLogout = async () => {
    try {
      const response = await api.get('/api/auth/logout')
      if (response.data.success) {
        setUser(null)
        navigate('/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <Sidebar
        user={user}
        onNewInterview={() => navigate('/interview')}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        moblieOpen={mobileOpen}
        setMoblieOpen={setMobileOpen}
      />

      <main className={`min-h-screen px-4 py-5 transition-all md:px-8 md:py-7 ${sidebarOpen ? 'md:ml-[248px]' : 'md:ml-[72px]'}`}>
        <div className="mx-auto max-w-[1180px]">
          <header className="mb-7 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 md:hidden">
                <FiMenu size={18} />
              </button>
              <div>
                <p className="text-xs font-semibold text-slate-400">Workspace overview</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Good morning, {firstName}</h1>
              </div>
            </div>
            <button onClick={() => navigate('/interview')} className="hidden h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,.16)] hover:bg-blue-700 sm:flex">
              Start interview <FiArrowRight size={15} />
            </button>
          </header>

          <section className="surface-card mb-5 overflow-hidden bg-slate-950 p-6 text-white sm:p-8">
            <div className="relative z-10 max-w-xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-semibold text-blue-200">
                <FiTrendingUp size={13} /> Your career preparation
              </span>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Turn preparation into confident performance.</h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">Complete one focused activity today and keep your interview readiness moving forward.</p>
            </div>
          </section>

          <section className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: 'Interviews', value: stats.totalInterviews, icon: FiMic, tone: 'bg-blue-50 text-blue-600' },
              { label: 'Questions', value: stats.totalQuestions, icon: FiCheckCircle, tone: 'bg-emerald-50 text-emerald-600' },
              { label: 'Completed', value: stats.completed, icon: FiBarChart2, tone: 'bg-violet-50 text-violet-600' },
              { label: 'Avg. score', value: `${Math.round(stats.averageScore || 0)}%`, icon: FiTrendingUp, tone: 'bg-amber-50 text-amber-600' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <motion.article whileHover={{ y: -3 }} key={item.label} className="surface-card p-4 sm:p-5">
                  <div className={`mb-5 flex h-9 w-9 items-center justify-center rounded-xl ${item.tone}`}><Icon size={17} /></div>
                  <p className="text-2xl font-bold tracking-tight text-slate-950">{item.value}</p>
                  <p className="mt-1 text-xs font-medium text-slate-400">{item.label}</p>
                </motion.article>
              )
            })}
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">AI tools</p>
                  <h2 className="mt-1 text-lg font-bold text-slate-950">Continue working</h2>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {features.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <motion.button whileHover={{ y: -3 }} key={feature.title} onClick={() => navigate(feature.route)} className="surface-card flex items-start gap-4 p-5 text-left hover:border-blue-200">
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${feature.tone}`}><Icon size={19} /></span>
                      <span className="min-w-0">
                        <span className="flex items-center justify-between gap-3 text-sm font-bold text-slate-900">
                          {feature.title} <FiArrowRight size={14} className="text-slate-300" />
                        </span>
                        <span className="mt-1.5 block text-xs leading-5 text-slate-500">{feature.description}</span>
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            <div className="surface-card p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Performance</p>
                  <h2 className="mt-1 text-lg font-bold text-slate-950">Skill profile</h2>
                </div>
                <FiBarChart2 className="text-slate-300" size={18} />
              </div>
              <div className="space-y-4">
                {(technicalData.length ? technicalData : [
                  { skill: 'Correctness', score: 0 }, { skill: 'Clarity', score: 0 },
                  { skill: 'Communication', score: 0 }, { skill: 'Problem solving', score: 0 },
                ]).slice(0, 5).map((item) => (
                  <div key={item.skill}>
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="font-medium text-slate-600">{item.skill}</span>
                      <span className="font-bold text-slate-900">{item.score}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-blue-600" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
