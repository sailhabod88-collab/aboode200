// ═══════════════════════════════════════════════════════════════════════════════
// CIBID SERVER — Backend API كامل مع Appwrite
// ═══════════════════════════════════════════════════════════════════════════════

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const app = express();

// ═════════════════════════════════════════════════════════════════════════════════
// ⚙️ CONFIGURATION
// ═════════════════════════════════════════════════════════════════════════════════

const config = {
  appwrite: {
    endpoint: 'https://cloud.appwrite.io/v1',
    projectId: 'if0_41916916',
    apiKey: 'aboode2005555',
    databaseId: 'if0_41916916_cibod'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
    expiresIn: '7d'
  },
  recaptcha: {
    secret: process.env.RECAPTCHA_SECRET || ''
  },
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://yourdomain.com'
  ]
};

// ═════════════════════════════════════════════════════════════════════════════════
// 🛡️ SECURITY MIDDLEWARE
// ═════════════════════════════════════════════════════════════════════════════════

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://www.google.com/recaptcha/', 'https://www.gstatic.com'],
      frameSrc: ['https://www.google.com/recaptcha/']
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true }
}));

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || config.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'cookie-secret'));

// ═════════════════════════════════════════════════════════════════════════════════
// 🚦 RATE LIMITING
// ═════════════════════════════════════════════════════════════════════════════════

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'عدد الطلبات كثير جداً، حاول لاحقاً',
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'عدد محاولات التسجيل كثير جداً'
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// ═════════════════════════════════════════════════════════════════════════════════
// 🔗 APPWRITE API HELPER
// ═════════════════════════════════════════════════════════════════════════════════

class AppwriteClient {
  constructor() {
    this.endpoint = config.appwrite.endpoint;
    this.projectId = config.appwrite.projectId;
    this.apiKey = config.appwrite.apiKey;
    this.databaseId = config.appwrite.databaseId;
  }

  async request(method, path, data = null) {
    try {
      const axiosConfig = {
        method,
        url: `${this.endpoint}${path}`,
        headers: {
          'X-Appwrite-Project': this.projectId,
          'X-Appwrite-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      };

      if (data) axiosConfig.data = data;
      const response = await axios(axiosConfig);
      return response.data;
    } catch (error) {
      console.error('Appwrite Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getDocuments(collectionId, queries = []) {
    let path = `/databases/${this.databaseId}/collections/${collectionId}/documents`;
    if (queries.length) {
      path += '?' + queries.map(q => `queries=${q}`).join('&');
    }
    return this.request('GET', path);
  }

  async getDocument(collectionId, documentId) {
    return this.request('GET', `/databases/${this.databaseId}/collections/${collectionId}/documents/${documentId}`);
  }

  async createDocument(collectionId, data) {
    return this.request('POST', `/databases/${this.databaseId}/collections/${collectionId}/documents`, data);
  }

  async updateDocument(collectionId, documentId, data) {
    return this.request('PATCH', `/databases/${this.databaseId}/collections/${collectionId}/documents/${documentId}`, data);
  }

  async deleteDocument(collectionId, documentId) {
    return this.request('DELETE', `/databases/${this.databaseId}/collections/${collectionId}/documents/${documentId}`);
  }
}

const appwrite = new AppwriteClient();

// ═════════════════════════════════════════════════════════════════════════════════
// 🔐 JWT & SESSION MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════════

function generateToken(userId) {
  return jwt.sign(
    { userId, iat: Date.now() },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
}

function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password + config.jwt.secret)
    .digest('hex');
}

// Middleware: Authentication
const authMiddleware = (req, res, next) => {
  const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }

  req.userId = decoded.userId;
  next();
};

// ═════════════════════════════════════════════════════════════════════════════════
// 🤖 reCAPTCHA VERIFICATION
// ═════════════════════════════════════════════════════════════════════════════════

async function verifyRecaptcha(token) {
  if (!config.recaptcha.secret) return true;

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: config.recaptcha.secret,
          response: token
        }
      }
    );

    return response.data.success && (response.data.score >= 0.5);
  } catch (error) {
    console.error('reCAPTCHA Error:', error);
    return false;
  }
}

// ═════════════════════════════════════════════════════════════════════════════════
// 📺 CHANNELS API
// ═════════════════════════════════════════════════════════════════════════════════

// GET all channels
app.get('/api/channels', async (req, res) => {
  try {
    const response = await appwrite.getDocuments('channels');
    res.json({
      success: true,
      data: response.documents || [],
      total: response.total || 0
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch channels' });
  }
});

// GET single channel
app.get('/api/channels/:id', async (req, res) => {
  try {
    const channel = await appwrite.getDocument('channels', req.params.id);
    res.json({ success: true, data: channel });
  } catch (error) {
    res.status(404).json({ success: false, error: 'Channel not found' });
  }
});

// CREATE channel (Authenticated)
app.post('/api/channels', authMiddleware, async (req, res) => {
  try {
    const { name, url, image, category, recaptchaToken } = req.body;

    // Validation
    if (!name || !url) {
      return res.status(400).json({ error: 'Name and URL required' });
    }

    // reCAPTCHA check
    if (!await verifyRecaptcha(recaptchaToken)) {
      return res.status(403).json({ error: 'reCAPTCHA verification failed' });
    }

    const channelData = {
      documentId: uuidv4(),
      name: String(name).substring(0, 100),
      url: String(url),
      image: String(image || ''),
      category: String(category || 'عام'),
      userId: req.userId,
      views: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const response = await appwrite.createDocument('channels', channelData);
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create channel' });
  }
});

// UPDATE channel
app.put('/api/channels/:id', authMiddleware, async (req, res) => {
  try {
    const { name, url, image, category } = req.body;

    const updateData = {};
    if (name) updateData.name = String(name).substring(0, 100);
    if (url) updateData.url = String(url);
    if (image !== undefined) updateData.image = String(image);
    if (category) updateData.category = String(category);
    updateData.updatedAt = new Date().toISOString();

    const response = await appwrite.updateDocument('channels', req.params.id, updateData);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update channel' });
  }
});

// DELETE channel
app.delete('/api/channels/:id', authMiddleware, async (req, res) => {
  try {
    await appwrite.deleteDocument('channels', req.params.id);
    res.json({ success: true, message: 'Channel deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete channel' });
  }
});

// ═════════════════════════════════════════════════════════════════════════════════
// 👥 AUTHENTICATION API
// ═════════════════════════════════════════════════════════════════════════════════

// SIGNUP
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, recaptchaToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    if (!await verifyRecaptcha(recaptchaToken)) {
      return res.status(403).json({ error: 'reCAPTCHA verification failed' });
    }

    const userId = uuidv4();
    const userData = {
      documentId: userId,
      email: String(email).toLowerCase(),
      passwordHash: hashPassword(password),
      username: email.split('@')[0],
      isActive: true,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await appwrite.createDocument('users', userData);

    const token = generateToken(userId);
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({ success: true, token, userId });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Signup failed' });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, recaptchaToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    if (!await verifyRecaptcha(recaptchaToken)) {
      return res.status(403).json({ error: 'reCAPTCHA verification failed' });
    }

    // Find user
    const users = await appwrite.getDocuments('users');
    const user = users.documents?.find(u => u.email === email.toLowerCase());

    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.$id);
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Update last login
    await appwrite.updateDocument('users', user.$id, {
      lastLogin: new Date().toISOString()
    });

    res.json({ success: true, token, userId: user.$id });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// LOGOUT
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true, message: 'Logged out' });
});

// VERIFY TOKEN
app.get('/api/auth/verify', authMiddleware, (req, res) => {
  res.json({ success: true, userId: req.userId });
});

// ═════════════════════════════════════════════════════════════════════════════════
// ❤️ FAVORITES API
// ═════════════════════════════════════════════════════════════════════════════════

// GET user favorites
app.get('/api/favorites', authMiddleware, async (req, res) => {
  try {
    const response = await appwrite.getDocuments('favorites');
    const userFavorites = response.documents?.filter(f => f.userId === req.userId) || [];
    res.json({ success: true, data: userFavorites });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch favorites' });
  }
});

// ADD to favorites
app.post('/api/favorites/:channelId', authMiddleware, async (req, res) => {
  try {
    const favoriteData = {
      documentId: uuidv4(),
      userId: req.userId,
      channelId: req.params.channelId,
      createdAt: new Date().toISOString()
    };

    const response = await appwrite.createDocument('favorites', favoriteData);
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add favorite' });
  }
});

// REMOVE from favorites
app.delete('/api/favorites/:channelId', authMiddleware, async (req, res) => {
  try {
    const favorites = await appwrite.getDocuments('favorites');
    const favorite = favorites.documents?.find(
      f => f.userId === req.userId && f.channelId === req.params.channelId
    );

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    await appwrite.deleteDocument('favorites', favorite.$id);
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to remove favorite' });
  }
});

// ═════════════════════════════════════════════════════════════════════════════════
// 📊 ANALYTICS API
// ═════════════════════════════════════════════════════════════════════════════════

// Log view
app.post('/api/analytics/view/:channelId', async (req, res) => {
  try {
    const logData = {
      documentId: uuidv4(),
      action: 'channel_view',
      resource: `channel_${req.params.channelId}`,
      ipAddress: req.ip,
      createdAt: new Date().toISOString()
    };

    await appwrite.createDocument('logs', logData);

    // Increment view count
    try {
      const channel = await appwrite.getDocument('channels', req.params.channelId);
      await appwrite.updateDocument('channels', req.params.channelId, {
        views: (channel.views || 0) + 1
      });
    } catch (e) {}

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to log view' });
  }
});

// ═════════════════════════════════════════════════════════════════════════════════
// ❌ ERROR HANDLING
// ═════════════════════════════════════════════════════════════════════════════════

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

// ═════════════════════════════════════════════════════════════════════════════════
// 🚀 START SERVER
// ═════════════════════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║     ✨ CIBID API SERVER STARTED ✨             ║');
  console.log('╚════════════════════════════════════════════════╝\n');
  console.log(`📡 Server:      http://localhost:${PORT}`);
  console.log(`📊 Database:    ${config.appwrite.databaseId}`);
  console.log(`🔑 Project:     ${config.appwrite.projectId}`);
  console.log(`🌐 Endpoint:    ${config.appwrite.endpoint}`);
  console.log('\n✅ جاهز للاستقبال...\n');
});

module.exports = app;
