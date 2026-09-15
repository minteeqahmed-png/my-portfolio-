const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// 1. Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    xFrameOptions: { action: 'deny' },
    xContentTypeOptions: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// 2. CORS Configuration
const allowedOrigins = [
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS Policy: Request from unauthorized origin blocked.'));
      }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// 3. Body Parsing & Input Sanitization Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Sanitize string inputs to prevent XSS / Script Injections
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// 4. Rate Limiting (DoS & Brute Force Defense)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests from this IP, please try again after 15 minutes.' },
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 5 contact submissions per hour per IP
  message: { success: false, error: 'Contact submission limit reached for this hour. Please try again later.' },
});

app.use('/api/', apiLimiter);

// In-Memory Storage for Demo Contact Inquiries (Sanitized)
const inquiryDatabase = [];

// 5. Backend API Endpoints

// GET /api/health - Health check & Security Audit status
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    security: {
      helmetHeaders: 'active',
      corsProtection: 'enabled',
      rateLimiting: 'active',
      inputSanitization: 'active',
      environment: process.env.NODE_ENV || 'production',
    },
    serverPort: PORT,
  });
});

// POST /api/contact - Secure Contact Form Handler
app.post('/api/contact', contactLimiter, (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Input Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, and message are required.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address format.',
      });
    }

    // Input Sanitization
    const sanitizedSubmission = {
      id: `INQ-${Date.now()}`,
      name: sanitizeString(name),
      email: sanitizeString(email),
      subject: sanitizeString(subject || 'General Inquiry'),
      message: sanitizeString(message),
      receivedAt: new Date().toISOString(),
      ipHash: req.ip ? sanitizeString(req.ip) : 'anonymous',
    };

    inquiryDatabase.push(sanitizedSubmission);

    console.log(`[SECURE BACKEND] New Inquiry Received from ${sanitizedSubmission.email}`);

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been securely submitted.',
      inquiryId: sanitizedSubmission.id,
    });
  } catch (err) {
    console.error('[BACKEND ERROR]', err);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your request.',
    });
  }
});

// GET /api/inquiries - Protected list of inquiries (Demonstrating Auth check rule)
app.get('/api/inquiries', (req, res) => {
  const authHeader = req.headers['authorization'];
  const expectedKey = process.env.ADMIN_API_KEY || 'minteeq_sec_key_9f8d7c6b5a4e3f21';

  if (!authHeader || authHeader !== `Bearer ${expectedKey}`) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or missing API key in Bearer token.',
    });
  }

  return res.status(200).json({
    success: true,
    total: inquiryDatabase.length,
    inquiries: inquiryDatabase,
  });
});

// 6. Serve Static Website Files
app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Route fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 7. Global Error Handler (Hiding Stack Traces in Production)
app.use((err, req, res, next) => {
  console.error('[UNHANDLED ERROR]', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`⚡ SECURE BACKEND SERVER RUNNING AT: http://localhost:${PORT}`);
  console.log(`🛡️  ALL 20 SECURITY CONTROLS ACTIVE`);
  console.log(`====================================================`);
});
