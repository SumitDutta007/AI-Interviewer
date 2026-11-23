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
import { proxyWithHeaders } from "./utils/proxyWithHeaders.js"
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
const forwardResumeUpload = (req, res) => {
    const chunks = []
    req.on("data", (chunk) => chunks.push(chunk))
    req.on("end", () => {
        const body = Buffer.concat(chunks)
        const target = new URL("/upload", resumeServiceUrl)
        const transport = target.protocol === "https:" ? https : http

        const send = (attempt) => {
            const upstream = transport.request(target, {
                method: "POST",
                headers: {
                    "content-type": req.headers["content-type"],
                    "content-length": body.length,
                    "x-user-id": req.user.userId,
                },
                timeout: 300000,
            }, (upstreamResponse) => {
                res.status(upstreamResponse.statusCode || 502)
                Object.entries(upstreamResponse.headers).forEach(([name, value]) => {
                    if (!["connection", "transfer-encoding", "content-length"].includes(name)) {
                        res.setHeader(name, value)
                    }
                })
                upstreamResponse.pipe(res)
            })

            upstream.on("timeout", () => upstream.destroy(new Error("Resume service timed out")))
            upstream.on("error", (error) => {
                if (attempt === 0 && ["ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND"].includes(error.code)) {
                    setTimeout(() => send(1), 3000)
                    return
                }
                if (res.headersSent) return
                res.status(502).json({
                    success: false,
                    message: "Resume service is unavailable.",
                })
            })
            upstream.end(body)
        }

        send(0)
    })
    req.on("aborted", () => {
        if (!res.headersSent) {
            res.status(400).json({ success: false, message: "Resume upload was interrupted." })
        }
    })
}

app.post("/api/resume/upload", isAuth, forwardResumeUpload)
app.use("/api/resume" ,isAuth, proxyWithHeaders(resumeServiceUrl))
app.use("/api/interview",isAuth, express.json(), proxyWithHeaders(interviewServiceUrl))
app.use("/api/roadmap",isAuth, express.json(), proxyWithHeaders(roadmapServiceUrl))
app.use("/api/billing",isAuth, express.json(), proxyWithHeaders(billingServiceUrl))
app.get("/api/me",isAuth,getCurrentUser)





app.listen(PORT , ()=>{
    console.log(`Gateway Started on ${PORT}`)
})