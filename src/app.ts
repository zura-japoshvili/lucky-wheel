import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";  
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


const app = express();

const FULL_API_URL = `${config.API_URL}:${config.port}`;


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


const options = {
  definition: {
    openapi: "3.0.0", 
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API Documentation for the project",
    },
    servers: [
      {
        url: FULL_API_URL,
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', 
        },
      },
    },
    security: [
      {
        BearerAuth: [] as any,
      },
    ],
  },
  apis: [
    path.join(__dirname, './routes/*.ts'),  
    path.join(__dirname, './controllers/*.ts'),
  ],
};

const specs = swaggerJsdoc(options);



// Response interceptor middleware
app.use(responseInterceptor);


// Swagger UI
app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(specs));

// Middleware
app.use(bodyParser.json());
app.use(cors());

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