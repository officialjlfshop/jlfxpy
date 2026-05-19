// ========================================
// RENDER API SERVER - JLF Fireworks
// ========================================

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));

// Environment variables
const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL;
const ADMIN_PHONE = process.env.ADMIN_PHONE || '101007101007';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '12345678';

// ========================================
// API ROUTES
// ========================================

// Admin config endpoint
app.get('/api/admin-config', (req, res) => {
  res.json({
    adminPhone: ADMIN_PHONE,
    adminPassword: ADMIN_PASSWORD
  });
});

// Proxy to Google Sheets
app.all('/api/sheets', async (req, res) => {
  if (!GOOGLE_SHEETS_URL) {
    return res.status(500).json({ 
      success: false, 
      error: 'GOOGLE_SHEETS_URL not configured' 
    });
  }

  try {
    let fetchUrl;
    let fetchOptions = {};

    if (req.method === 'GET') {
      const { action, ...params } = req.query;
      fetchUrl = new URL(GOOGLE_SHEETS_URL);
      fetchUrl.searchParams.set('action', action);
      Object.entries(params).forEach(([key, value]) => {
        fetchUrl.searchParams.set(key, value);
      });
      fetchOptions = { method: 'GET' };
    } else if (req.method === 'POST') {
      fetchUrl = GOOGLE_SHEETS_URL;
      fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(req.body).toString()
      };
    } else {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const response = await fetch(fetchUrl.toString(), fetchOptions);
    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/landing.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../landing.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin.html'));
});

app.get('/safety.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../safety.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ JLF Fireworks API running on port ${PORT}`);
  console.log(`📊 Google Sheets URL: ${GOOGLE_SHEETS_URL ? 'Configured' : 'MISSING!'}`);
});