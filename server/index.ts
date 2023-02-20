import "module-alias/register"
import express, { json, urlencoded, Application } from "express"
import { config } from "dotenv"
import session, { CookieOptions, SessionOptions } from "express-session"
import cors, { CorsOptions } from "cors"
import morgan from "morgan"
import multer from "multer"
import path from "path"
import { store } from "@config/prisma.config"
import { sessionRouter } from "@routers/session.router"
import { clientRouter } from "@routers/client.router"
import { userRouter } from "@routers/user.router"
import { projectRouter } from "@routers/project.router"
import { supplierRouter } from "@routers/supplier.router"
import { errorHandler } from "@middlewares/error.middleware"
import { quotationRouter } from "@routers/quotation.router"
import { applicationRouter } from "@routers/application.router"
import { paymentRouter } from "@routers/payment.router"
import { notificationRouter } from "@routers/notification.router"
import { activityLogsRouter } from "@routers/activityLog.router"
import { purchaseOrder } from "@routers/purchaseorder.router"
import { carouselRouter } from "@routers/carousel.router"
import { inquiryRouter } from "@routers/inquiries.router"

config()

// Express Application
const app: Application = express()

// Express Session
const cookieOptions: CookieOptions = {
  maxAge: 24 * 60 * 60 * 1000, // 1 Day
  secure: process.env.NODE_ENV! === "production",
  sameSite: process.env.NODE_ENV! === "production" ? "none" : "lax",
  httpOnly: true
}

var sessionOptions: SessionOptions = {
  secret: process.env.SESSION_SECRET!.split(" "),
  resave: true,
  saveUninitialized: false,
  rolling: true,
  store: store,
  cookie: cookieOptions,
}

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1)
}

app.use(session(sessionOptions))

// Body Parser
app.use(json())
app.use(urlencoded({
  extended: false
}))

app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "../build")))

// CORS
const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_BASE_URI!,
  credentials: true
}

app.use(cors(corsOptions))

// Morgan
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan(
//     `Request Information:
//     endpoint -> :url
//     method -> :method
//     statusCode -> :status
//     responseTime -> :response-time ms
//   `))
// }

// API Routes
app.use("/api/sessions", sessionRouter)
app.use("/api/clients", clientRouter)
app.use("/api/users", userRouter)
app.use("/api/projects", projectRouter)
app.use("/api/quotations", quotationRouter)
app.use("/api/suppliers", supplierRouter)
app.use("/api/payments", paymentRouter)
app.use("/api/application", applicationRouter)
app.use("/api/notifications", notificationRouter)
app.use("/api/purchase-orders", purchaseOrder)
app.use("/api/payments", paymentRouter)
app.use("/api/activity_logs", activityLogsRouter)
app.use("/api/carousel", carouselRouter)
app.use("/api/inquiries", inquiryRouter)

// Error Handler
app.use(errorHandler)

app.get('/*', function (req, res) {
  return res.sendFile(path.join(__dirname, '../build/index.html'));
  // res.sendFile(path.join(__dirname, '../build/index.html'), function (err) {
  //   if (err) {
  //     res.status(500).send(err)
  //   }
  // })
})

// Port
const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Serving on port: ${port}`))