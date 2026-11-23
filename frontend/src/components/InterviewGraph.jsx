import React from 'react'
import { motion } from 'motion/react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] shadow-lg">
      <p className="mb-0.5 text-slate-400">{payload[0]?.payload?.skill}</p>
      <p className="font-bold text-slate-900">{payload[0]?.value}%</p>
    </div>
  )
}

function RadarCard({ title, data, color, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="surface-card p-4">
      <ResponsiveContainer width="100%" height={180}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="68%">
          <PolarGrid stroke="#e7eaf0" gridType="circle" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 500 }} />
          <Radar name={title} dataKey="score" stroke={color} fill={color} fillOpacity={0.12} strokeWidth={2} dot={{ r: 2.5, fill: color, strokeWidth: 0 }} />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
      <p className="mt-1 text-center text-xs font-semibold text-slate-600">{title}</p>
    </motion.div>
  )
}

function InterviewGraph({ technicalData, hrData, technicalCount, hrCount }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
      <RadarCard title={`Technical interviews (${technicalCount})`} data={technicalData} color="#2563eb" index={0} />
      <RadarCard title={`HR interviews (${hrCount})`} data={hrData} color="#7c3aed" index={1} />
    </div>
  )
}

export default InterviewGraph
