import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { featured, team_id } = req.query;
      let query = supabase.from('players').select('*, team:team_id(*)').order('rating', { ascending: false });
      
      if (featured === 'true') query = query.eq('is_featured', true);
      if (team_id) query = query.eq('team_id', team_id);
      
      const { data, error } = await query.limit(50);
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}