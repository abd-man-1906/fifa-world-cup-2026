import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Activity, TrendingUp, Minus, Plus, RefreshCw } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { getLiveScores } from '../api/football';

function ScoreAnimation({ score, isLive }) {
  return (
    <motion.span
      key={score}
      initial={{ scale: 1.5, color: '#06b6d4' }}
      animate={{ scale: 1, color: '#fff' }}
      className={`tabular-nums ${isLive ? 'text-cyan-400' : 'text-white'}`}
    >
      {score ?? '-'}
    </motion.span>
  );
}

function MatchStats({ stats }) {
  if (!stats) return null;
  
  const statItems = [
    { label: 'Possession', home: stats.possession_home || 52, away: stats.possession_away || 48, suffix: '%' },
    { label: 'Shots', home: stats.shots_home || 12, away: stats.shots_away || 8 },
    { label: 'Shots on Target', home: stats.sot_home || 5, away: stats.sot_away || 3 },
    { label: 'Corners', home: stats.corners_home || 6, away: stats.corners_away || 4 },
  ];
  
  return (
    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
      {statItems.map(stat => (
        <div key={stat.label} className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{stat.home}{stat.suffix || ''}</span>
            <span className="font-semibold text-white">{stat.label}</span>
            <span>{stat.away}{stat.suffix || ''}</span>
          </div>
          <div className="flex gap-1 h-1.5">
            <div className="flex-1 bg-white/5 rounded-l-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${stat.home}%` }}
                className="h-full bg-cyan-500 rounded-l-full"
              />
            </div>
            <div className="flex-1 bg-white/5 rounded-r-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${stat.away}%` }}
                className="h-full bg-blue-500 rounded-r-full ml-auto"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LiveMatchCard({ match }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
        match.status === 'live' 
          ? 'bg-gradient-to-b from-red-950/30 to-black border-red-500/30' 
          : 'bg-gradient-to-b from-white/[0.05] to-black border-white/10'
      }`}
    >
      {/* Live indicator bar */}
      {match.status === 'live' && (
        <div className="h-1 bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-pulse" />
      )}
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {match.status === 'live' && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-xs font-bold">LIVE • {match.minute || 45}'</span>
              </div>
            )}
            {match.status === 'upcoming' && (
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">UPCOMING</span>
            )}
            {match.status === 'completed' && (
              <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-bold">FULL TIME</span>
            )}
          </div>
          <span className="text-gray-500 text-xs">{new Date(match.match_date).toLocaleDateString()}</span>
        </div>
        
        {/* Teams & Score */}
        <div className="flex items-center justify-between">
          {/* Home */}
          <div className="flex items-center gap-3 flex-1">
            <span className="text-3xl">{match.home_team?.flag || '🏳️'}</span>
            <div>
              <p className="font-bold text-white">{match.home_team?.name || 'TBD'}</p>
              <p className="text-xs text-gray-500">Home</p>
            </div>
          </div>
          
          {/* Score */}
          <div className="px-6 py-3 rounded-xl bg-black/50 border border-white/10 text-center min-w-[100px]">
            <div className="text-3xl font-black text-white tabular-nums">
              <ScoreAnimation score={match.home_score} isLive={match.status === 'live'} />
              <span className="text-gray-600 mx-1">-</span>
              <ScoreAnimation score={match.away_score} isLive={match.status === 'live'} />
            </div>
          </div>
          
          {/* Away */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="text-right">
              <p className="font-bold text-white">{match.away_team?.name || 'TBD'}</p>
              <p className="text-xs text-gray-500">Away</p>
            </div>
            <span className="text-3xl">{match.away_team?.flag || '🏳️'}</span>
          </div>
        </div>
        
        {/* Expand button */}
        {match.status !== 'upcoming' && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 w-full py-2 text-xs text-gray-500 hover:text-cyan-400 transition-colors flex items-center justify-center gap-1"
          >
            {expanded ? 'Hide' : 'View'} Match Statistics
            <Minus size={12} className={expanded ? '' : 'hidden'} />
            <Plus size={12} className={expanded ? 'hidden' : ''} />
          </button>
        )}
        
        {/* Expanded stats */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <MatchStats stats={match.stats} />
          </motion.div>
        )}
        
        {/* Stadium */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
          <span>📍 {match.stadium?.name || 'Stadium'}</span>
          <span className="uppercase tracking-wider">{match.stage?.replace(/_/g, ' ')}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function LiveScores() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [filter, setFilter] = useState('all');

  const fetchScores = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await getLiveScores();
      setMatches(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch scores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores(true);
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchScores();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const filteredMatches = filter === 'all' ? matches : matches.filter(m => m.status === filter);

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <Radio className="text-red-500 animate-pulse" size={28} />
                <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">Real-Time Updates</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white">
                Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">Scores</span>
              </h1>
            </motion.div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="text-right">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Last Update</p>
                <p className="text-sm font-bold text-white">{lastUpdated.toLocaleTimeString()}</p>
              </div>
              <button 
                onClick={() => fetchScores()}
                className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all group"
              >
                <RefreshCw size={20} className="group-active:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-8">
            {[{ id: 'all', label: 'All Matches' }, { id: 'live', label: '🔴 Live Now' }, { id: 'upcoming', label: '⏰ Upcoming' }, { id: 'completed', label: '✓ Completed' }].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  filter === f.id
                    ? 'bg-cyan-500 border-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Matches */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-3xl bg-white/5 h-48 border border-white/10" />
              ))}
            </div>
          ) : filteredMatches.length > 0 ? (
            <div className="space-y-6">
              {filteredMatches.map(match => (
                <LiveMatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
              <Activity size={48} className="mx-auto text-gray-700 mb-4" />
              <p className="text-gray-500 font-bold uppercase tracking-widest">No {filter} matches found</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}