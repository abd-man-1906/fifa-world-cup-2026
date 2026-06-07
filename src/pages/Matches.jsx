import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const stages = [
  { id: 'all', label: 'All Matches' },
  { id: 'group', label: 'Group Stage' },
  { id: 'round_of_32', label: 'Round of 32' },
  { id: 'round_of_16', label: 'Round of 16' },
  { id: 'quarter_finals', label: 'Quarter Finals' },
  { id: 'semi_finals', label: 'Semi Finals' },
  { id: 'third_place', label: 'Third Place' },
  { id: 'final', label: 'Final' },
];

function getStatusBadge(status) {
  switch (status) {
    case 'live':
      return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold animate-pulse"><span className="w-2 h-2 rounded-full bg-red-500" /> LIVE</span>;
    case 'completed':
      return <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-bold">FT</span>;
    case 'upcoming':
      return <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">UPCOMING</span>;
    default:
      return null;
  }
}

function MatchCard({ match }) {
  const matchDate = new Date(match.match_date);
  const formattedDate = matchDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const formattedTime = matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative p-5 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden"
    >
      {/* Status glow */}
      {match.status === 'live' && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-red-400 to-red-500 animate-pulse" />
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <Calendar size={14} />
          <span>{formattedDate}</span>
          <Clock size={14} className="ml-2" />
          <span>{formattedTime} (Local)</span>
        </div>
        {getStatusBadge(match.status)}
      </div>
      
      {/* Teams vs */}
      <div className="flex items-center justify-between mb-4">
        {/* Home Team */}
        <div className="flex-1 flex items-center gap-3">
          <span className="text-3xl">{match.home_team?.flag || '🏳️'}</span>
          <div>
            <p className="font-bold text-white text-sm md:text-base">{match.home_team?.name || 'TBD'}</p>
            <p className="text-xs text-gray-500">Home</p>
          </div>
        </div>
        
        {/* Score */}
        <div className="px-4 md:px-6 py-2 rounded-xl bg-black/40 border border-white/10">
          <span className="text-2xl md:text-3xl font-black text-white tabular-nums">
            {match.status === 'upcoming' ? 'VS' : `${match.home_score ?? 0} - ${match.away_score ?? 0}`}
          </span>
        </div>
        
        {/* Away Team */}
        <div className="flex-1 flex items-center gap-3 justify-end">
          <div className="text-right">
            <p className="font-bold text-white text-sm md:text-base">{match.away_team?.name || 'TBD'}</p>
            <p className="text-xs text-gray-500">Away</p>
          </div>
          <span className="text-3xl">{match.away_team?.flag || '🏳️'}</span>
        </div>
      </div>
      
      {/* Stadium info */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <MapPin size={12} />
          <span>{match.stadium?.name || 'Stadium TBD'}, {match.stadium?.city || ''}</span>
        </div>
        <span className="text-xs text-gray-600 uppercase tracking-wider font-semibold">{match.stage?.replace(/_/g, ' ')}</span>
      </div>
    </motion.div>
  );
}

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState('all');

  useEffect(() => {
    fetch(`/api/matches?stage=${activeStage === 'all' ? '' : activeStage}`)
      .then(res => res.json())
      .then(data => {
        setMatches(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeStage]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">Full Schedule</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mt-3">
              Match <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Schedule</span>
            </h1>
            <p className="text-gray-400 mt-4 text-lg">
              All 104 matches across 16 stadiums. Never miss a moment.
            </p>
          </motion.div>

          {/* Stage Tabs */}
          <div className="mt-8 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              {stages.map(stage => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    activeStage === stage.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Matches List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white/5 h-36" />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-20">
              <Calendar size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-500 text-xl">No matches found for this stage.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match, i) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <MatchCard match={match} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}