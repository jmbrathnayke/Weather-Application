import { expressjwt as jwt } from 'express-jwt';
import jwksClient from 'jwks-client';

// Auth0 configuration
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || 'dev-weather.us.auth0.com';
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;

// Create JWKS client for Auth0
const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  requestHeaders: {}, // Optional
  timeout: 30000, // Defaults to 30s
});

// Function to get signing key
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error('Error getting signing key:', err);
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// JWT Authentication middleware
export const checkJwt = jwt({
  secret: getKey,
  audience: AUTH0_AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
}).unless({ 
  path: [
    '/api/health',
    { url: '/api/weather/dashboard', methods: ['GET'] }
  ] 
});

// Optional middleware - protect specific routes
export const requireAuth = jwt({
  secret: getKey,
  audience: AUTH0_AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// User info extraction middleware
export const extractUser = (req, res, next) => {
  if (req.user) {
    console.log(' Authenticated user:', {
      sub: req.user.sub,
      email: req.user.email,
      name: req.user.name,
      scope: req.user.scope
    });
    
    // Add user info to request for downstream usage
    req.userInfo = {
      id: req.user.sub,
      email: req.user.email,
      name: req.user.name,
      permissions: req.user.permissions || [],
      scope: req.user.scope?.split(' ') || []
    };
  }
  next();
};

// Session management utilities
export const sessionUtils = {
  // Extract session info from JWT token
  getSessionInfo: (req) => {
    if (!req.user) return null;
    
    return {
      userId: req.user.sub,
      email: req.user.email,
      name: req.user.name,
      issuedAt: req.user.iat,
      expiresAt: req.user.exp,
      sessionAge: Date.now() / 1000 - req.user.iat,
      timeToExpiry: req.user.exp - Date.now() / 1000
    };
  },
  
  // Check if session is valid
  isSessionValid: (req) => {
    const sessionInfo = sessionUtils.getSessionInfo(req);
    if (!sessionInfo) return false;
    
    return sessionInfo.timeToExpiry > 0;
  },
  
  // Log session activity
  logSessionActivity: (req, activity) => {
    const sessionInfo = sessionUtils.getSessionInfo(req);
    if (sessionInfo) {
      console.log(` Session Activity: ${activity}`, {
        user: sessionInfo.email,
        sessionAge: Math.round(sessionInfo.sessionAge / 60) + ' minutes',
        timeToExpiry: Math.round(sessionInfo.timeToExpiry / 60) + ' minutes'
      });
    }
  }
};

// Error handler for authentication errors
export const authErrorHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    console.error('Authentication Error:', err.message);
    
    return res.status(401).json({
      error: 'Authentication required',
      message: err.message,
      code: 'UNAUTHORIZED',
      timestamp: new Date().toISOString()
    });
  }
  next(err);
};

// OpenID Connect Flow utilities
export const oidcUtils = {
  // Validate OpenID Connect claims
  validateOIDCClaims: (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No user claims found' });
    }
    
    // Check required OIDC claims
    const requiredClaims = ['sub', 'aud', 'iss', 'exp', 'iat'];
    const missingClaims = requiredClaims.filter(claim => !req.user[claim]);
    
    if (missingClaims.length > 0) {
      return res.status(401).json({
        error: 'Invalid OIDC token',
        missingClaims
      });
    }
    
    console.log(' OIDC Claims validated successfully');
    next();
  },
  
  // Extract standard OIDC profile
  getOIDCProfile: (req) => {
    if (!req.user) return null;
    
    return {
      sub: req.user.sub, // Subject (unique user ID)
      name: req.user.name,
      email: req.user.email,
      email_verified: req.user.email_verified,
      picture: req.user.picture,
      updated_at: req.user.updated_at,
      iss: req.user.iss, // Issuer
      aud: req.user.aud, // Audience
      iat: req.user.iat, // Issued at
      exp: req.user.exp  // Expires at
    };
  }
};

export default {
  checkJwt,
  requireAuth,
  extractUser,
  sessionUtils,
  authErrorHandler,
  oidcUtils
};
