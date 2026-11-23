import React from 'react'
import { motion } from 'motion/react'
import { FiCheckCircle, FiClock, FiMap, FiTarget, FiX } from 'react-icons/fi'
import ModuleCard from './ModuleCard'

function RoadmapResult({ roadmap, onClear }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-10">
      <div className="surface-card mb-5 overflow-hidden">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-6 sm:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">Your roadmap</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{roadmap.title}</h2>
            <p className="mt-1 text-sm text-slate-500">Target package: <span className="font-semibold text-slate-800">{roadmap.targetPackage}</span></p>
          </div>
          <button onClick={onClear} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close roadmap"><FiX size={16} /></button>
        </div>
        <div className="grid gap-px bg-slate-100 sm:grid-cols-3">
          {[
            { icon: FiTarget, label: 'Level', value: roadmap.level },
            { icon: FiClock, label: 'Duration', value: roadmap.duration },
            { icon: FiCheckCircle, label: 'Modules', value: `${roadmap.modules?.length || 0} topics` },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="bg-white px-6 py-5">
                <div className="flex items-center gap-2 text-xs text-slate-400"><Icon size={13} /> {item.label}</div>
                <p className="mt-2 text-sm font-bold text-slate-900">{item.value}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400"><FiMap size={13} /> Learning modules</div>
      <div className="space-y-3">
        {(roadmap.modules || []).map((module, index) => (
          <ModuleCard key={`${module.title}-${index}`} mod={module} index={index} />
        ))}
      </div>
    </motion.div>
  )
}

export default RoadmapResult
