import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { stage, status } = req.query;
      let query = supabase.from('matches').select('*, home_team:home_team_id(*), away_team:away_team_id(*), stadium:stadium_id(*)').order('match_date', { ascending: true });
      
      if (stage) query = query.eq('stage', stage);
      if (status) query = query.eq('status', status);
      
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}