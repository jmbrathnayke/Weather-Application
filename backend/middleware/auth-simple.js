// Temporary bypass for development
export const authenticateToken = (req, res, next) => {
  console.log('🔓 Auth bypassed for development');
  req.user = { id: 'dev-user', email: 'dev@example.com' };
  next();
};

export const optionalAuth = (req, res, next) => {
  console.log('🔓 Optional auth bypassed for development');
  next();
};

// Simple auth middleware that allows all requests in development
export const checkJwt = (req, res, next) => {
  console.log('🔓 JWT check bypassed for development');
  req.auth = { 
    sub: 'dev-user-123',
    email: 'dev@example.com',
    name: 'Development User'
  };
  next();
};

export const extractUser = (req, res, next) => {
  if (req.auth) {
    console.log('✅ Development user extracted:', req.auth);
    req.userInfo = {
      id: req.auth.sub,
      email: req.auth.email,
      name: req.auth.name,
      permissions: [],
      scope: []
    };
  }
  next();
};

export const authErrorHandler = (err, req, res, next) => {
  console.log('🔓 Auth error bypassed for development:', err.message);
  next();
};

export const sessionUtils = {
  getSessionInfo: (req) => ({
    userId: 'dev-user-123',
    email: 'dev@example.com',
    name: 'Development User',
    issuedAt: Math.floor(Date.now() / 1000),
    expiresAt: Math.floor(Date.now() / 1000) + 3600,
    sessionAge: 0,
    timeToExpiry: 3600
  }),
  
  isSessionValid: () => true,
  
  logSessionActivity: (req, activity) => {
    console.log(`🔐 Dev Session Activity: ${activity}`);
  }
};

export default {
  checkJwt,
  extractUser,
  authErrorHandler,
  sessionUtils,
  authenticateToken,
  optionalAuth
};