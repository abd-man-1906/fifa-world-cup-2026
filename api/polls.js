import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('polls').select('*').eq('is_active', true);
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { poll_id, option_index } = req.body;
      const { data: poll } = await supabase.from('polls').select('*').eq('id', poll_id).single();
      if (!poll) return res.status(404).json({ error: 'Poll not found' });
      
      const votes = [...poll.votes];
      votes[option_index] = (votes[option_index] || 0) + 1;
      
      const { data, error } = await supabase.from('polls').update({ votes }).eq('id', poll_id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}