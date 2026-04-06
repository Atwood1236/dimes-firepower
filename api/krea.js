// api/krea.js — Vercel Serverless Function
// Proxies requests to Krea API, bypassing browser CORS restrictions
// Deploy to: dimes-firepower/api/krea.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-krea-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const kreaKey = req.headers['x-krea-key'];
  if (!kreaKey) return res.status(401).json({ error: 'Missing x-krea-key header' });

  const { method, path, body } = req.body || {};
  if (!path) return res.status(400).json({ error: 'Missing path' });

  try {
    const kreaRes = await fetch(`https://api.krea.ai${path}`, {
      method: method || 'GET',
      headers: {
        'Authorization': `Bearer ${kreaKey}`,
        'Content-Type': 'application/json'
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    const data = await kreaRes.json();
    return res.status(kreaRes.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
