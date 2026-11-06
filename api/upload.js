export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, content } = req.body;
    if (!filename || !content) {
      return res.status(400).json({ error: 'No data provided' });
    }

    const repo = 'nefryttttt/Napka';
    const path = `uploads/${filename}`;
    const token = process.env.GH_TOKEN;

    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Napka-App'
      },
      body: JSON.stringify({
        message: `Upload ${filename}`,
        content: content
      })
    });

    const data = await response.json();

    if (response.ok) {
      const rawUrl = `https://raw.githubusercontent.com/${repo}/main/${path}`;
      return res.status(200).json({ url: rawUrl });
    } else {
      return res.status(500).json({ error: data.message || 'GitHub Error' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
