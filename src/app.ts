import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db";
import responseInterceptor from "./middlewares/responseInterceptor";
import errorHandler from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";
import migrationRoutes from "./routes/migrationRoutes";
import wheelRoutes from "./routes/wheelRoutes";
import betRoutes from "./routes/betRoutes";
import userRoutes from "./routes/userRoutes";
import { requireAuth } from "./middlewares/authMiddleware";
import rateLimit from "express-rate-limit";
import config from "./config/config";
import helmet from 'helmet';
import swaggerConfig from "./config/swagger";



const FULL_API_URL = `${config.API_URL}:${config.port}`;


const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: [FULL_API_URL], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Define a rate limiter with options
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(apiLimiter); // add a rate limiter


// Response interceptor middleware
app.use(responseInterceptor);


// Swagger UI
app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerConfig));

app.use("/api/migration", migrationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/wheel", requireAuth , wheelRoutes)
app.use("/api/bet", requireAuth, betRoutes)
app.use("/api/user", requireAuth, userRoutes);


// Global error handler
app.use(errorHandler); 

// MongoDB Connection
connectDB();

export default app;