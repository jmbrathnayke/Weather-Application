import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weather-dashboard.js';
// Use simple auth for development to avoid JWT issues
import { checkJwt, extractUser, authErrorHandler, sessionUtils } from './middleware/auth-simple.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Health check route (public - no auth required)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Weather API Server is running',
    timestamp: new Date().toISOString(),
    authenticated: !!req.auth,
    session: req.auth ? sessionUtils.getSessionInfo(req) : null
  });
});

// Authentication middleware (JWT validation) - applied after health check
app.use('/api', (req, res, next) => {
  // Skip auth ONLY for health check endpoint
  const publicEndpoints = ['/health'];
  
  // Check if the path starts with any public endpoint
  const isPublic = publicEndpoints.some(endpoint => req.path.startsWith(endpoint));
  
  if (isPublic) {
    return next();
  }
  
  // Apply JWT check for ALL other API routes (including weather dashboard)
  checkJwt(req, res, next);
});
app.use(extractUser);

// Session activity logging
app.use((req, res, next) => {
  if (req.auth) {
    sessionUtils.logSessionActivity(req, `${req.method} ${req.path}`);
  }
  next();
});

// Routes
app.use('/api/weather', weatherRoutes);

// Auth status endpoint
app.get('/api/auth/status', (req, res) => {
  if (!req.auth) {
    return res.status(401).json({ 
      authenticated: false, 
      message: 'Not authenticated' 
    });
  }
  
  const sessionInfo = sessionUtils.getSessionInfo(req);
  res.json({
    authenticated: true,
    user: {
      id: req.auth.sub,
      email: req.auth.email,
      name: req.auth.name
    },
    session: sessionInfo,
    tokenInfo: {
      issuer: req.auth.iss,
      audience: req.auth.aud,
      scopes: req.auth.scope?.split(' ') || []
    }
  });
});

// Authentication error handler
app.use(authErrorHandler);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});