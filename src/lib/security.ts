/**
 * Security Configuration for Agronomy Club Website
 * Contains security headers, CSP policies, and other security settings
 */

// Content Security Policy
export const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com https://www.google.com https://apis.google.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://*.googleapis.com https://*.gstatic.com;
  font-src 'self' https://fonts.gstatic.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

// Security Headers Configuration
export const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspHeader.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'false'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

type SecurityToken = {
  role?: string;
  chapterId?: string;
  [key: string]: unknown;
};

type SecurityUser = {
  role?: string;
  chapterId?: string;
  [key: string]: unknown;
};

type SecuritySession = {
  user?: {
    role?: string;
    chapterId?: string;
    [key: string]: unknown;
  } & Record<string, unknown>;
  [key: string]: unknown;
};

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
};

// Authentication configuration
export const authConfig = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }: { token: SecurityToken; user?: SecurityUser }) {
      if (user) {
        token.role = user.role;
        token.chapterId = user.chapterId;
      }
      return token;
    },
    async session({ session, token }: { session: SecuritySession; token: SecurityToken }) {
      if (!session.user) {
        session.user = {};
      }
      session.user.role = typeof token.role === 'string' ? token.role : session.user.role;
      session.user.chapterId = typeof token.chapterId === 'string' ? token.chapterId : session.user.chapterId;
      return session;
    },
  },
};

// File upload security settings
export const fileUploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ],
  scanForMalware: true,
  quarantineSuspiciousFiles: true,
  virusScanTimeout: 30000, // 30 seconds
};

// Input validation rules
export const validationRules = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    blacklistedPasswords: [
      'password', '123456', 'password123', 'admin', 'qwerty'
    ]
  },
  username: {
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_-]+$/,
    blacklistedNames: ['admin', 'root', 'administrator', 'moderator']
  },
  content: {
    maxLength: 10000,
    allowHtml: false,
    sanitizeInput: true
  }
};

// API Security Configuration
export const apiSecurityConfig = {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://agronomyclub.org', 'https://www.agronomyclub.org']
      : ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  },
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        scriptSrc: ["'self'", 'https://www.google.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }
};

const securityConfig = {
  securityHeaders,
  rateLimitConfig,
  authConfig,
  fileUploadConfig,
  validationRules,
  apiSecurityConfig,
};

export default securityConfig;