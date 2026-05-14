// ═══════════════════════════════════════════════════════════════════════════════
// CIBID API CLIENT — مكتبة جافاسكريبت للتفاعل مع API
// ═══════════════════════════════════════════════════════════════════════════════

class CibidClient {
  constructor(baseURL = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  async request(method, path, data = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    };

    if (this.token) {
      options.headers.Authorization = `Bearer ${this.token}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${path}`, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'API Error');
      }

      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ─── CHANNELS ───
  async getChannels() {
    return this.request('GET', '/channels');
  }

  async getChannel(id) {
    return this.request('GET', `/channels/${id}`);
  }

  async createChannel(name, url, image = '', category = 'عام', recaptchaToken) {
    return this.request('POST', '/channels', {
      name,
      url,
      image,
      category,
      recaptchaToken
    });
  }

  async updateChannel(id, updates) {
    return this.request('PUT', `/channels/${id}`, updates);
  }

  async deleteChannel(id) {
    return this.request('DELETE', `/channels/${id}`);
  }

  // ─── AUTHENTICATION ───
  async signup(email, password, recaptchaToken) {
    const result = await this.request('POST', '/auth/signup', {
      email,
      password,
      recaptchaToken
    });

    if (result.token) {
      this.token = result.token;
      localStorage.setItem('auth_token', result.token);
    }

    return result;
  }

  async login(email, password, recaptchaToken) {
    const result = await this.request('POST', '/auth/login', {
      email,
      password,
      recaptchaToken
    });

    if (result.token) {
      this.token = result.token;
      localStorage.setItem('auth_token', result.token);
    }

    return result;
  }

  async logout() {
    await this.request('POST', '/auth/logout');
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async verifyToken() {
    return this.request('GET', '/auth/verify');
  }

  // ─── FAVORITES ───
  async getFavorites() {
    return this.request('GET', '/favorites');
  }

  async addFavorite(channelId) {
    return this.request('POST', `/favorites/${channelId}`);
  }

  async removeFavorite(channelId) {
    return this.request('DELETE', `/favorites/${channelId}`);
  }

  // ─── ANALYTICS ───
  async logView(channelId) {
    return this.request('POST', `/analytics/view/${channelId}`);
  }

  // ─── AUTH STATE ───
  isAuthenticated() {
    return !!this.token;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }
}

// ─── GLOBAL INSTANCE ───
const cibid = new CibidClient();

// ─── USAGE EXAMPLES ───
/*

// Get all channels
cibid.getChannels().then(result => {
  console.log('Channels:', result.data);
});

// Sign up
cibid.signup('user@example.com', 'password123', recaptchaToken).then(result => {
  console.log('Signed up:', result);
});

// Create channel (authenticated)
cibid.createChannel(
  'Channel Name',
  'http://stream.url/playlist.m3u8',
  'http://image.url/logo.png',
  'أفلام',
  recaptchaToken
).then(result => {
  console.log('Channel created:', result);
});

// Add to favorites
cibid.addFavorite('channel-id').then(result => {
  console.log('Added to favorites:', result);
});

// Log view
cibid.logView('channel-id');

*/

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CibidClient;
}
