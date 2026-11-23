import React, { useEffect, useState } from 'react'
import Step3report from '../components/interview/Step3report'
import { useNavigate, useParams } from 'react-router-dom'
import { getInterview } from '../apis/interview.api'

function InterviewReport({user, setUser}) {
  const {id} = useParams()
    const [loading , setLoading] = useState(true)
    const [report,setReport] = useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchReport = async () => {
            const response = await getInterview(id)
            const data = response?.interview
            if(data.status !== "completed"){
                navigate(`/interview/${id}`,
                    {replace: true});
                    return;
            }
            setReport(data)
            setLoading(false)
         }

         fetchReport()

    },[id,navigate])

    if(loading){
        return(
            <div className="min-h-screen bg-[#f7f8fb] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
      </div>
        )
    }
    if(!report) return null


  return (
   <Step3report
   user={user}
   setUser={setUser}
   report={report}
   />
  )
}

export default InterviewReport
