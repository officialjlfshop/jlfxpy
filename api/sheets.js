export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL;
  
  if (!GOOGLE_SHEETS_URL) {
    return res.status(500).json({ success: false, error: 'GOOGLE_SHEETS_URL not configured' });
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
    res.status(500).json({ success: false, error: error.message });
  }
}