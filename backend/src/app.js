import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes/api.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Initialize express app
const app = express();

// 1. Security Headers Middleware
app.use(helmet());

// 2. Cross-Origin Resource Sharing (CORS) Middleware
// Enabled for standard web and expo-cli client endpoints
app.use(
  cors({
    origin: '*', // Set specific domain origins if preferred in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Request Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 4. Request Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Mount Router
app.use('/api', apiRoutes);

// 6. Root Redirection / Health check
app.get('/', (req, res) => {
  res.redirect('/api');
});

// 7. Route Not Found Handling
app.use(notFound);

// 8. Central Error Handling Middleware
app.use(errorHandler);

export default app;
