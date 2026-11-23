import express from "express"
import dotenv from "dotenv"
dotenv.config()
import proxy from "express-http-proxy"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { getCurrentUser } from "./controllers/user.controller.js"
import { isAuth } from "./middleware/isAuth.js"
import { proxyWithHeaders } from "./utils/proxyWithHeaders.js"
const app = express()
app.use(express.json())

const isRender = Boolean(process.env.RENDER)
const frontendUrl = isRender
    ? "https://ai-interviewer-virid-xi.vercel.app"
    : (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "")

app.use(cors({
    origin: frontendUrl,
    credentials:true
}))

app.use(morgan("dev"))
app.use(cookieParser())

const PORT = process.env.PORT || 6000

app.get("/" , (req,res)=>{
    res.send("Hello from Gateway")
})


const configuredAuthServiceUrl = process.env.AUTH_SERVICE_URL
const authServiceUrl =
    isRender && (!configuredAuthServiceUrl ||
        configuredAuthServiceUrl.includes("localhost") ||
        configuredAuthServiceUrl.includes("127.0.0.1"))
        ? "https://auth-service-1vp7.onrender.com"
        : (configuredAuthServiceUrl || "http://localhost:8001")

const getServiceUrl = (name, localUrl, renderUrl) => {
    const configuredUrl = process.env[name]
    if (isRender && (!configuredUrl ||
        configuredUrl.includes("localhost") ||
        configuredUrl.includes("127.0.0.1"))) {
        return renderUrl
    }
    return configuredUrl || localUrl
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

app.use("/api/auth" , proxy(authServiceUrl))
app.use("/api/resume" ,isAuth, proxyWithHeaders(resumeServiceUrl))
app.use("/api/interview",isAuth ,proxyWithHeaders(interviewServiceUrl))
app.use("/api/roadmap",isAuth ,proxyWithHeaders(roadmapServiceUrl))
app.use("/api/billing",isAuth ,proxyWithHeaders(billingServiceUrl))
app.get("/api/me",isAuth,getCurrentUser)





app.listen(PORT , ()=>{
    console.log(`Gateway Started on ${PORT}`)
})