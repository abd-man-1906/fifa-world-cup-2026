import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LiveTicker() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/scores')
      .then(res => res.json())
      .then(data => {
        setMatches(data.slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || matches.length === 0) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-red-950/90 via-black to-red-950/90 border-y border-red-500/30 py-2">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: [0, -2000] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {[...matches, ...matches].map((match, i) => (
          <div key={`${match.id}-${i}`} className="flex items-center gap-4 px-6 min-w-max">
            <span className={`flex items-center gap-1.5 text-xs font-bold ${
              match.status === 'live' ? 'text-red-400 animate-pulse' : 'text-gray-400'
            }`}>
              {match.status === 'live' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
              {match.status === 'live' ? 'LIVE' : match.status === 'upcoming' ? 'UPCOMING' : 'FT'}
            </span>
            <span className="text-white font-semibold text-sm">{match.home_team?.code || 'TBD'}</span>
            <span className="text-cyan-400 font-bold text-sm">
              {match.home_score ?? '-'} - {match.away_score ?? '-'}
            </span>
            <span className="text-white font-semibold text-sm">{match.away_team?.code || 'TBD'}</span>
            <span className="text-gray-500 text-xs">|</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}