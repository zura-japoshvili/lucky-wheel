import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
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

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


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
        url: "http://localhost:3000",
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