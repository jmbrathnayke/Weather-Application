import { expressjwt as jwt } from 'express-jwt';
import jwksClient from 'jwks-client';

// Auth0 configuration
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || 'dev-weather.us.auth0.com';
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';

console.log('🔐 Auth0 Configuration:', {
  domain: AUTH0_DOMAIN,
  audience: AUTH0_AUDIENCE ? 'Set' : 'Not set',
  development: IS_DEVELOPMENT
});

// Create JWKS client for Auth0
const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  requestHeaders: {},
  timeout: 30000,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
});

// Function to get signing key with better error handling
function getKey(header, callback) {
  if (!header || !header.kid) {
    console.error('❌ No kid found in JWT header');
    return callback(new Error('No kid found in JWT header'));
  }

  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error('❌ Error getting signing key:', err.message);
      return callback(err);
    }
    
    if (!key) {
      console.error('❌ No signing key received');
      return callback(new Error('No signing key received'));
    }

    const signingKey = key.publicKey || key.rsaPublicKey;
    if (!signingKey) {
      console.error('❌ No valid signing key found');
      return callback(new Error('No valid signing key found'));
    }

    console.log('✅ Successfully retrieved signing key');
    callback(null, signingKey);
  });
}

// Development bypass middleware
const developmentAuth = (req, res, next) => {
  console.log('🔓 Development mode: Auth bypassed');
  req.auth = {
    sub: 'dev-user-123',
    email: 'dev@example.com',
    name: 'Development User'
  };
  next();
};

// JWT Authentication middleware with fallback
export const checkJwt = IS_DEVELOPMENT ? developmentAuth : jwt({
  secret: getKey,
  ...(AUTH0_AUDIENCE && { audience: AUTH0_AUDIENCE }),
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
  credentialsRequired: true
}).unless({
  path: [
    '/api/health'
    // All other routes require authentication
  ]
});

// middleware - protect specific routes
export const requireAuth = jwt({
  secret: getKey,
  ...(AUTH0_AUDIENCE && { audience: AUTH0_AUDIENCE }),
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// User info extraction middleware
export const extractUser = (req, res, next) => {
  if (req.auth) {
    console.log('✅ Authenticated user:', {
      sub: req.auth.sub,
      email: req.auth.email,
      name: req.auth.name,
      scope: req.auth.scope
    });
    
    // Add user info to request for downstream usage
    req.userInfo = {
      id: req.auth.sub,
      email: req.auth.email,
      name: req.auth.name,
      permissions: req.auth.permissions || [],
      scope: req.auth.scope?.split(' ') || []
    };
  }
  next();
};

// Session management utilities
export const sessionUtils = {
  // Extract session info from JWT token
  getSessionInfo: (req) => {
    if (!req.auth) return null;
    
    return {
      userId: req.auth.sub,
      email: req.auth.email,
      name: req.auth.name,
      issuedAt: req.auth.iat,
      expiresAt: req.auth.exp,
      sessionAge: Date.now() / 1000 - req.auth.iat,
      timeToExpiry: req.auth.exp - Date.now() / 1000
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
      console.log(`🔐 Session Activity: ${activity}`, {
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
    if (!req.auth) {
      return res.status(401).json({ error: 'No user claims found' });
    }
    
    // Check required OIDC claims
    const requiredClaims = ['sub', 'aud', 'iss', 'exp', 'iat'];
    const missingClaims = requiredClaims.filter(claim => !req.auth[claim]);
    
    if (missingClaims.length > 0) {
      return res.status(401).json({
        error: 'Invalid OIDC token',
        missingClaims
      });
    }
    
    console.log('✅ OIDC Claims validated successfully');
    next();
  },
  
  // Extract standard OIDC profile
  getOIDCProfile: (req) => {
    if (!req.auth) return null;
    
    return {
      sub: req.auth.sub, // Subject (unique user ID)
      name: req.auth.name,
      email: req.auth.email,
      email_verified: req.auth.email_verified,
      picture: req.auth.picture,
      updated_at: req.auth.updated_at,
      iss: req.auth.iss, // Issuer
      aud: req.auth.aud, // Audience
      iat: req.auth.iat, // Issued at
      exp: req.auth.exp  // Expires at
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
