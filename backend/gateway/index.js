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
    : (process.env.FRONTEND_URL || "http://localhost:5173")

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

app.use("/api/auth" , proxy(authServiceUrl))
app.use("/api/resume" ,isAuth, proxyWithHeaders(process.env.RESUME_SERVICE_URL))
app.use("/api/interview",isAuth ,proxyWithHeaders(process.env.INTERVIEW_SERVICE_URL))
app.use("/api/roadmap",isAuth ,proxyWithHeaders(process.env.ROADMAP_SERVICE_URL))
app.use("/api/billing",isAuth ,proxyWithHeaders(process.env.BILLING_SERVICE_URL))
app.get("/api/me",isAuth,getCurrentUser)





app.listen(PORT , ()=>{
    console.log(`Gateway Started on ${PORT}`)
})