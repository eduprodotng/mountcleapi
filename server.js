import express from "express";
import dotenv from "dotenv";
import { S3 } from "@aws-sdk/client-s3";
import cors from "cors";
import classRoute from "./routes/classRoute.js";
import adRoutes from "./routes/adRoutes.js";
import fingerRoute from "./routes/fingerRoute.js";
import aiRoute from "./routes/aiRoute.js";
import examlistRoute from "./routes/examlistRoute.js";
import gradeRoute from "./routes/gradeRoute.js";
import catRoute from "./routes/catRoute.js";
import stuRoute from "./routes/stuRoute.js";
import FibroidRoute from "./routes/FibroidRoute.js";
import teRoute from "./routes/teRoute.js";
import parentRoute from "./routes/parentRoute.js";
import commonRoute from "./routes/commonRoute.js";
import questionRoute from "./routes/questionRoute.js";
import examRoute from "./routes/examRoute.js";
import subRoute from "./routes/subRoute.js";
import markRoute from "./routes/markRoute.js";
import offlineRoute from "./routes/offlineRoute.js";
import OffRoutes from "./routes/OffRoutes.js";
import psyRoute from "./routes/psyRoute.js";
import receiptRoute from "./routes/receiptRoute.js";
import onScreenRoute from "./routes/onScreenRoute.js";
import innovateRoute from "./routes/innovateRoute.js";
import noticeRoute from "./routes/noticeRoute.js";
import sessionRoute from "./routes/sessionRoute.js";
import practicePqRoutes from "./routes/practicePqRoutes.js";
import { getStudentsByClass } from "./controller/authController.js";
import authenticateUser from "./middleware/authMiddleware.js";
import connectDB from "./config/db2.js";

dotenv.config();
const app = express();
connectDB();

// AWS S3 setup
const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const corsOptions = {
  origin: [
    "http://localhost:3001",
    "https://rarebuild.vercel.app",
    "https://mountcle.edupro.com.ng",
    "https://montclair.edupro.com.ng",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(express.json({ limit: "100mb" })); // Adjust size as needed
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight for all routes

app.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next(err);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/", offlineRoute);
app.use("/api/ad", adRoutes);
app.use("/api/ad", adRoutes);
app.use("/api/", examlistRoute);
app.use("/api/", noticeRoute);
app.use("/api", fingerRoute);
// Define routes
const authRoutes = [
  { method: "get", path: "/students/:id", middleware: authenticateUser },
  { method: "get", path: "/teachers/:id", middleware: authenticateUser },
  {
    method: "get",
    path: "/get-session-admin/:sessionId",
    middleware: authenticateUser,
  },
  { method: "put", path: "/students/:id", middleware: authenticateUser },
  { method: "put", path: "/teachers/:id", middleware: authenticateUser },
];

const commonRouterWithAuth = commonRoute(s3, authRoutes);
const onScreen = onScreenRoute(s3);

// Routes
app.use("/api/", innovateRoute);
app.use("/api/", OffRoutes);

app.use("/api/", receiptRoute);

app.use("/api/", receiptRoute);
app.use("/api/", aiRoute);
app.use("/api/divine", FibroidRoute);
app.use("/api/", classRoute);
app.use("/api/sessions", sessionRoute);
app.use("/api/onScreen", onScreen);
app.use("/api", commonRouterWithAuth);
app.use("/api/student/:className/:sessionId", getStudentsByClass);
app.use("/api/", gradeRoute);
app.use("/api/", catRoute);
app.use("/api/mark", markRoute);
app.use("/api/", stuRoute);
app.use("/api/", teRoute);
app.use("/api/", parentRoute);
app.use("/api/", subRoute);
app.use("/api/", questionRoute);
app.use("/api/", examRoute);

app.use("/api/", psyRoute);

app.use("/api/", practicePqRoutes);

// Start server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
