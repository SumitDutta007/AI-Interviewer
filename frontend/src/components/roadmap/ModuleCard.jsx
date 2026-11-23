import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FiBookOpen, FiChevronDown, FiClock, FiYoutube } from 'react-icons/fi'

const difficultyStyles = {
  Easy: 'bg-emerald-50 text-emerald-700',
  Medium: 'bg-amber-50 text-amber-700',
  Hard: 'bg-red-50 text-red-700',
}

function ModuleCard({ mod, index }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.055 }} className="surface-card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-4 px-5 py-4 text-left">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">{String(index + 1).padStart(2, '0')}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-slate-900">{mod.title}</span>
          <span className="mt-1 flex items-center gap-1.5 text-xs text-slate-400"><FiClock size={12} /> {mod.duration}</span>
        </span>
        <span className={`hidden rounded-full px-2.5 py-1 text-[10px] font-bold sm:block ${difficultyStyles[mod.difficulty] || difficultyStyles.Medium}`}>{mod.difficulty}</span>
        <FiChevronDown size={15} className={`shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="border-t border-slate-100 px-5 py-4">
              <p className="text-xs leading-6 text-slate-500">{mod.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {mod.youtube && (
                  <a href={mod.youtube} target="_blank" rel="noopener noreferrer" className="flex h-9 items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 text-xs font-semibold text-red-700"><FiYoutube size={14} /> Watch tutorial</a>
                )}
                {mod.article && (
                  <a href={mod.article} target="_blank" rel="noopener noreferrer" className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:border-slate-300"><FiBookOpen size={14} /> Read documentation</a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

export default ModuleCard
