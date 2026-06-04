import express from 'express';
import cors from 'cors';
import config from './infrastructure/config/index.js';
import router from './interface/routes/v1/index.js';
import errorMiddleware from './interface/middlewares/errorMiddleware.js';

const app = express();
const port = config.port;

// CORS setup
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// v1 API Routes
app.use('/api/v1', router);

// Error Handling Middleware (must be registered last!)
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`[AutoRenova Server] running on port ${port}`);
  console.log(`[AutoRenova Server] CORS enabled for origin ${config.frontendUrl}`);
});
