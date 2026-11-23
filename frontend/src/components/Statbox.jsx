import React from 'react'
import { motion } from 'motion/react'

function Statbox({ label, value, sub, subHighlight, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -3 }}
      className="surface-card p-4"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
      {sub && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {subHighlight && <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600">{subHighlight}</span>}
          <span className="text-[10px] text-slate-400">{sub}</span>
        </div>
      )}
    </motion.div>
  )
}

export default Statbox
