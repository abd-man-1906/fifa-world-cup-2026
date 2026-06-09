import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';

function getStatusBadge(status) {
  switch (status) {
    case 'live':
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500" /> LIVE
        </span>
      );
    case 'completed':
      return (
        <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-bold">FT</span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">UPCOMING</span>
      );
  }
}

export default function MatchCard({ match, compact = false, linkable = true }) {
  const matchDate = new Date(match.match_date);
  const formattedDate = matchDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = matchDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const card = (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className={`group relative rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      {match.status === 'live' && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-red-400 to-red-500 animate-pulse" />
      )}

      <div className={`flex items-start justify-between ${compact ? 'mb-3' : 'mb-4'}`}>
        <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm flex-wrap">
          <Calendar size={14} />
          <span>{formattedDate}</span>
          <Clock size={14} />
          <span>{formattedTime}</span>
        </div>
        {getStatusBadge(match.status)}
      </div>

      <div className={`flex items-center justify-between ${compact ? 'mb-3' : 'mb-4'}`}>
        <div className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0">
          <span className={compact ? 'text-2xl' : 'text-3xl'}>{match.home_team?.flag || '🏳️'}</span>
          <div className="min-w-0">
            <p className="font-bold text-white text-sm md:text-base truncate">
              {match.home_team?.name || 'TBD'}
            </p>
            {!compact && <p className="text-xs text-gray-500">Home</p>}
          </div>
        </div>

        <div className="px-3 sm:px-6 py-2 rounded-xl bg-black/40 border border-white/10 shrink-0">
          <span className="text-xl sm:text-2xl md:text-3xl font-black text-white tabular-nums">
            {match.status === 'upcoming' && match.home_score == null
              ? 'VS'
              : `${match.home_score ?? 0} - ${match.away_score ?? 0}`}
          </span>
        </div>

        <div className="flex-1 flex items-center gap-2 sm:gap-3 justify-end min-w-0">
          <div className="text-right min-w-0">
            <p className="font-bold text-white text-sm md:text-base truncate">
              {match.away_team?.name || 'TBD'}
            </p>
            {!compact && <p className="text-xs text-gray-500">Away</p>}
          </div>
          <span className={compact ? 'text-2xl' : 'text-3xl'}>{match.away_team?.flag || '🏳️'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-2">
        <div className="flex items-center gap-2 text-gray-500 text-xs min-w-0">
          <MapPin size={12} className="text-cyan-500 shrink-0" />
          <span className="truncate">
            {match.stadium?.name || 'Stadium TBD'}
            {match.stadium?.city ? `, ${match.stadium.city}` : ''}
          </span>
        </div>
        {match.group && (
          <span className="text-xs text-gray-600 uppercase tracking-wider font-semibold shrink-0">
            {match.group}
          </span>
        )}
        {!match.group && match.round && (
          <span className="text-xs text-gray-600 uppercase tracking-wider font-semibold shrink-0">
            {match.round}
          </span>
        )}
      </div>
    </motion.div>
  );

  if (linkable) {
    return (
      <Link to={`/match/${match.id}`} className="block">
        {card}
      </Link>
    );
  }

  return card;
}
