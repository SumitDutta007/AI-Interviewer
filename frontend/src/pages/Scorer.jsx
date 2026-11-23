import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react"
import { useState } from 'react'
import { FiAlertCircle, FiTrendingUp, FiUploadCloud, FiUser, FiZap } from 'react-icons/fi'
import api from '../utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import { setResume } from '../redux/resumeSlice'
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"
import { useCoins } from '../apis/user.api'
const ScoreRing = ({ score }) => {
    const color = score >= 75 ? "#7c3aed" : score >= 50 ? "#f59e0b" : "#ef4444";
    return (
        <div className='relative flex items-center justify-center'>
            <RadialBarChart
                width={110}
                height={110}
                cx={55}
                cy={55}
                innerRadius={40}
                outerRadius={53}
                startAngle={90}
                endAngle={-270}
                data={[{ value: score, fill: color }]}
                barSize={8}
            >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background={{ fill: "#e5e7eb" }} dataKey="value" cornerRadius={8} />

            </RadialBarChart>

            <div className='absolute flex  items-center'>
                <span className='text-lg font-bold text-white leading-none'>{score}</span>
                <span className='text-[9px] text-gray-200 mt-0.5'>/100</span>
            </div>

        </div>
    )
}

const Tag = ({ text, color }) => {
    const styles = {
        purple: "bg-purple-50 text-purple-700 border-purple-200",
        red: "bg-red-50    text-red-700    border-red-200",
        green: "bg-green-50  text-green-700  border-green-200",
        yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    };
    return (
        <div className={`text-[10px] px-1.5 py-1 rounded-md border font-medium ${styles[color]}`}>
            {text}

        </div>
    )
}

const Navbar = ({ label }) => {
    const navigate = useNavigate()
    return (
        <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className='fixed inset-x-0 top-0 z-20 border-b border-black/8 bg-white/80 backdrop-blur-xl'>
            <div className='mx-auto flex h-12 max-w-7xl items-center justify-start px-3 sm:px-5'>
                <div onClick={() => navigate("/dashboard")}
                    className='flex cursor-pointer items-center gap-1.5'>
                    <span className='text-sm font-extrabold sm:text-base text-[#0A0A0A]'>FresherAI</span>
                    <span className='hidden rounded bg-black/5 px-1.5 py-0.5 text-[10px] text-black/50 sm:block'>{label}</span>
                </div>

            </div>

        </motion.nav>

    )
}

function Scorer({ user, setUser }) {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const { resume } = useSelector((state) => state.resume)

    const uploadResume = async () => {
        if (!file) {
            alert("Please select a PDF")
            return
        }
        try {
            setLoading(true)

            const formData = new FormData()
            formData.append("resume", file)

            const response = await api.post("/api/resume/upload", formData)

            const resumeData = response?.data?.data
            if (!resumeData) {
                throw new Error("The resume analysis did not return any data.")
            }

            dispatch(setResume(resumeData))

            try {
                const coinResponse = await useCoins({ coins: 10, action: "resume-scorer" })
                setUser((prev) => ({
                    ...prev, interviewCoin: coinResponse?.interviewCoin,
                }))
            } catch (error) {
                console.log("Resume uploaded, but coin deduction failed:", error)
            }

            setLoading(false)
        } catch (error) {
            console.log(error)
            try {
                const existingResume = await api.get("/api/resume/get-resume")
                if (existingResume?.data?.data) {
                    dispatch(setResume(existingResume.data.data))
                    return
                }
            } catch (resumeError) {
                console.log(resumeError)
            }

            const message = error.response?.data?.message || error.message || "Upload failed"
            alert(message)
            setLoading(false)
        }
    }
    // scorer section

    if (resume) return (
        <div className='min-h-screen bg-white text-[#0A0A0A]'>
            <Navbar label="Resume Scorer" />

            <section className='max-w-6xl mx-auto px-3 pt-18 sm:pt-20 pb-8 space-y-3.5'>
                {/* header */}
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <p className='text-[10px] text-black/40 tracking-widest uppercase mb-0.5'>Resume Analysis</p>
                        <h2 className='text-lg font-bold'>{resume?.name}</h2>

                    </div>
                    <button onClick={() => dispatch(setResume(null))}
                        className='text-[10px] sm:text-xs text-black/50 hover:text-[#0A0A0A] border border-black/15 hover:border-black/35 px-2.5 py-1 rounded-lg transition-colors'>Re-upload</button>
                </div>

                {/* Score */}

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className='surface-card p-5 flex flex-col items-center gap-4 sm:flex-row'>
                    <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none' />

                    <div className='relative'>
                        <ScoreRing score={resume?.score} />

                    </div>
                    <div className='relative'>
                        <p className='text-slate-400 text-xs mb-0.5'>Resume score</p>
                        <p className='text-lg sm:text-xl font-bold mb-1.5 text-slate-950'>
                            {resume.score >= 75 ? "Strong" : resume.score >= 50 ? "Average" : "Needs Work"}
                        </p>
                        <div className='flex items-center gap-1.5'>
                            <FiUser className='text-purple-400 text-xs' />
                            <span className='text-xs text-purple-300'>{resume?.suggestedRole}</span>
                        </div>

                    </div>

                </motion.div >

                {/* Weaknesses & Strengths */}
                <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>


                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.07 }}
                        className='surface-card p-5'>
                        <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none' />
                        <div className='relative flex items-center gap-1.5 mb-2.5'>
                            <FiAlertCircle className='text-green-400' size={14} />
                            <span className='text-xs font-semibold text-slate-900'>Strengths</span>
                        </div>



                        <div className='relative flex flex-wrap gap-1.5'>

                            {resume?.strengths?.map(s => <Tag key={s} text={s} color="green" />)}

                        </div>

                    </motion.div>


                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.07 }}
                        className='surface-card p-5'>
                        <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none' />
                        <div className='relative flex items-center gap-1.5 mb-2.5'>
                            <FiAlertCircle className='text-yellow-400' size={14} />
                            <span className='text-xs font-semibold text-slate-900'>Weaknesses</span>
                        </div>

                        <div className='relative flex flex-wrap gap-1.5'>

                            {resume?.weaknesses?.map(s => <Tag key={s} text={s} color="yellow" />)}

                        </div>

                    </motion.div>

                </div>

                {/* Missing Skills */}

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.09 }}
                    className='surface-card p-5'>
                    <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none' />
                    <div className='relative flex items-center gap-1.5 mb-2.5'>
                        <FiZap className='text-red-400' size={14} />
                        <span className='text-xs font-semibold text-slate-900'>Missing Skills</span>
                    </div>

                    <div className='relative flex flex-wrap gap-1.5'>

                        {resume?.missingSkills?.map(s => <Tag key={s} text={s} color="red" />)}

                    </div>

                </motion.div>
                {/* Recommendations */}

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.12 }}
                    className='surface-card p-5'>
                    <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none' />
                    <div className='relative flex items-center gap-1.5 mb-2.5'>
                        <FiTrendingUp className='text-purple-400' size={14} />
                        <span className='text-xs font-semibold text-slate-900'>Recommendations</span>
                    </div>

                    <div className='relative flex flex-wrap gap-1.5'>

                        {resume?.recommendations?.map(s => <Tag key={s} text={s} color="purple" />)}

                    </div>

                </motion.div>



            </section>

        </div>
    )
    //upload section
    return (
        <div className='min-h-screen bg-[#f7f8fb] text-slate-900'>
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95">
                <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-4 sm:px-6">
                    <button onClick={() => navigate('/dashboard')} className="flex h-10 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">← <span className="hidden sm:inline">Back</span></button>
                    <div className="text-center"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Career tools</p><h1 className="text-sm font-bold text-slate-950">Resume scorer</h1></div>
                    <div className="w-10" />
                </div>
            </header>


            <section className='mx-auto flex min-h-[calc(100vh-72px)] max-w-[1180px] items-center justify-center px-4 py-10'>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="surface-card w-full max-w-md p-6 sm:p-8">
                    <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><FiUploadCloud size={20} /></div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">Resume analysis</p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Upload your resume</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Get an ATS score, strengths, gaps, and clear recommendations.</p>

                    <label className={`mt-6 flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed transition ${file ? 'border-blue-300 bg-blue-50/50' : 'border-slate-300 bg-slate-50 hover:border-slate-400'}`}>
                        <FiUploadCloud className={`mb-3 text-3xl ${file ? 'text-blue-600' : 'text-slate-400'}`} />
                        <p className="max-w-[260px] truncate px-4 text-sm font-semibold text-slate-700">{file ? file.name : 'Choose a PDF resume'}</p>
                        <p className="mt-1 text-xs text-slate-400">PDF only · Maximum 20 MB</p>
                        <input type="file" accept=".pdf" className="hidden" onChange={(event) => setFile(event.target.files[0])} />
                    </label>

                    <motion.button whileTap={{ scale: 0.98 }} onClick={uploadResume} disabled={!file || loading} className="mt-5 h-11 w-full rounded-xl bg-slate-950 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-40">
                        {loading ? 'Analyzing...' : 'Analyze resume'}
                    </motion.button>
                </motion.div>
            </section>




        </div>
    )
}

export default Scorer
