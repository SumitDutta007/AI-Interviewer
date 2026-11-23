import express from "express"
import dotenv from "dotenv"
dotenv.config()
import proxy from "express-http-proxy"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import http from "http"
import https from "https"
import { getCurrentUser } from "./controllers/user.controller.js"
import { isAuth } from "./middleware/isAuth.js"
import { nativeServiceProxy, proxyWithHeaders } from "./utils/proxyWithHeaders.js"
const app = express()

const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "")

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = new Set([
            frontendUrl,
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "https://ai-interviewer-virid-xi.vercel.app"
        ])

        if (!origin || allowedOrigins.has(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Origin not allowed"))
        }
    },
    credentials:true
}))

app.use(morgan("dev"))
app.use(cookieParser())

const PORT = process.env.PORT || 6000

app.get("/" , (req,res)=>{
    res.send("Hello from Gateway")
})


const configuredAuthServiceUrl = process.env.AUTH_SERVICE_URL
const authServiceUrl = configuredAuthServiceUrl || "http://localhost:8001"

const getServiceUrl = (name, localUrl, renderUrl) => {
    const configuredUrl = process.env[name]
    return configuredUrl || renderUrl || localUrl
}

const resumeServiceUrl = getServiceUrl(
    "RESUME_SERVICE_URL",
    "http://localhost:8002",
    "https://resume-service-zb97.onrender.com"
)
const interviewServiceUrl = getServiceUrl(
    "INTERVIEW_SERVICE_URL",
    "http://localhost:8003",
    "https://ai-interviewer-78p7.onrender.com"
)
const roadmapServiceUrl = getServiceUrl(
    "ROADMAP_SERVICE_URL",
    "http://localhost:8004",
    "https://roadmap-service-7sg9.onrender.com"
)
const billingServiceUrl = getServiceUrl(
    "BILLING_SERVICE_URL",
    "http://localhost:8005",
    "https://billing-service-b1g1.onrender.com"
)

app.use("/api/auth" , express.json(), proxy(authServiceUrl, {
    timeout: 300000
}))
app.use("/api/resume/upload", isAuth, nativeServiceProxy(resumeServiceUrl, "/upload"))
app.use("/api/resume" ,isAuth, nativeServiceProxy(resumeServiceUrl))
app.use("/api/interview",isAuth, nativeServiceProxy(interviewServiceUrl))
app.use("/api/roadmap",isAuth, nativeServiceProxy(roadmapServiceUrl))
app.use("/api/billing",isAuth, nativeServiceProxy(billingServiceUrl))
app.get("/api/me",isAuth,getCurrentUser)





app.listen(PORT , ()=>{
    console.log(`Gateway Started on ${PORT}`)
})