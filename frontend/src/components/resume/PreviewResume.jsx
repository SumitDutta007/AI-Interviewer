import React, { useEffect, useRef, useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import DownloadBtn from './DownloadBtn'
import ATSTemplate from './ATSTemplate'

function PreviewResume({ data, onBack, user, setUser }) {
  const resumeRef = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const updateScale = () => {
      if (window.innerWidth < 640) setScale(0.42)
      else if (window.innerWidth < 768) setScale(0.58)
      else if (window.innerWidth < 1024) setScale(0.72)
      else setScale(0.9)
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95">
        <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-4 sm:px-6">
          <button onClick={onBack} className="flex h-10 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><FiArrowLeft size={16} /><span className="hidden sm:inline">Back to editor</span></button>
          <div className="text-center"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Resume</p><h1 className="text-sm font-bold text-slate-950">Preview</h1></div>
          <DownloadBtn docRef={resumeRef} user={user} setUser={setUser} />
        </div>
      </header>
      <div className="overflow-auto px-3 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto flex justify-center">
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
            <div ref={resumeRef} className="bg-white shadow-[0_12px_40px_rgba(15,23,42,.12)]"><ATSTemplate data={data} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewResume
