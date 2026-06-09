import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { getMatchById } from '../api/football';

function StatBar({ label, home, away, suffix = '' }) {
  const total = home + away || 1;
  const homePct = Math.round((home / total) * 100);
  const awayPct = 100 - homePct;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-400">
        <span>{home}{suffix}</span>
        <span className="font-semibold text-white">{label}</span>
        <span>{away}{suffix}</span>
      </div>
      <div className="flex gap-1 h-2">
        <div className="flex-1 bg-white/5 rounded-l-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${homePct}%` }}
            className="h-full bg-cyan-500 rounded-l-full"
          />
        </div>
        <div className="flex-1 bg-white/5 rounded-r-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${awayPct}%` }}
            className="h-full bg-blue-500 rounded-r-full ml-auto"
          />
        </div>
      </div>
    </div>
  );
}

function generatePlaceholderStats(match) {
  const seed = (match.id || 1) * 7;
  return {
    possession_home: 45 + (seed % 15),
    possession_away: 55 - (seed % 15),
    shots_home: 8 + (seed % 10),
    shots_away: 6 + (seed % 8),
    sot_home: 3 + (seed % 5),
    sot_away: 2 + (seed % 4),
    corners_home: 4 + (seed % 6),
    corners_away: 3 + (seed % 5),
  };
}

export default function MatchDetail() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getMatchById(id)
      .then((data) => {
        if (!data) throw new Error('Match not found');
        setMatch(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-black pt-24 pb-16 px-4">
          <div className="max-w-3xl mx-auto animate-pulse space-y-6">
            <div className="h-8 bg-white/5 rounded-xl w-32" />
            <div className="h-48 bg-white/5 rounded-3xl" />
            <div className="h-64 bg-white/5 rounded-3xl" />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error || !match) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-black pt-24 pb-16 px-4 text-center">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <p className="text-gray-400 text-lg mb-6">{error || 'Match not found'}</p>
          <Link to="/matches" className="text-cyan-400 hover:underline">
            ← Back to schedule
          </Link>
        </div>
      </PageTransition>
    );
  }

  const matchDate = new Date(match.match_date);
  const stats = generatePlaceholderStats(match);
  const goals = [
    ...(match.goals1 || []).map((g) => ({ ...g, team: match.home_team?.name })),
    ...(match.goals2 || []).map((g) => ({ ...g, team: match.away_team?.name })),
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link
            to="/matches"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-8 text-sm"
          >
            <ArrowLeft size={16} /> Back to Schedule
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 p-6 md:p-10 mb-8"
          >
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-6">
              <span className="flex items-center gap-1"><Calendar size={14} />{matchDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="flex items-center gap-1"><Clock size={14} />{matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="flex items-center gap-1"><MapPin size={14} />{match.stadium?.name}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 text-center">
                <span className="text-5xl md:text-6xl block mb-2">{match.home_team?.flag}</span>
                <h2 className="text-lg md:text-xl font-bold text-white">{match.home_team?.name}</h2>
              </div>
              <div className="text-center px-4">
                <div className="text-4xl md:text-5xl font-black text-white tabular-nums">
                  {match.status === 'upcoming' && match.home_score == null
                    ? 'VS'
                    : `${match.home_score ?? 0} - ${match.away_score ?? 0}`}
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wider mt-2 block">
                  {match.round || match.group || match.stage?.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex-1 text-center">
                <span className="text-5xl md:text-6xl block mb-2">{match.away_team?.flag}</span>
                <h2 className="text-lg md:text-xl font-bold text-white">{match.away_team?.name}</h2>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-white/[0.03] border border-white/10 p-6"
            >
              <h3 className="font-bold text-white mb-4">Goals Timeline</h3>
              {goals.length > 0 ? (
                <ul className="space-y-2">
                  {goals.map((g, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="text-cyan-400 font-bold w-8">{g.minute || g.min}&apos;</span>
                      <span>{g.name || g.scorer}</span>
                      <span className="text-gray-500">({g.team})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No goals recorded yet.</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-white/[0.03] border border-white/10 p-6"
            >
              <h3 className="font-bold text-white mb-4">Lineups</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-cyan-400 font-semibold mb-2">{match.home_team?.name}</p>
                  <p className="text-gray-500">Lineup TBA before kickoff</p>
                </div>
                <div>
                  <p className="text-blue-400 font-semibold mb-2">{match.away_team?.name}</p>
                  <p className="text-gray-500">Lineup TBA before kickoff</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 mt-6"
          >
            <h3 className="font-bold text-white mb-6">Match Statistics</h3>
            <div className="space-y-4">
              <StatBar label="Possession" home={stats.possession_home} away={stats.possession_away} suffix="%" />
              <StatBar label="Shots" home={stats.shots_home} away={stats.shots_away} />
              <StatBar label="Shots on Target" home={stats.sot_home} away={stats.sot_away} />
              <StatBar label="Corners" home={stats.corners_home} away={stats.corners_away} />
            </div>
            {match.status === 'upcoming' && (
              <p className="text-xs text-gray-600 mt-4">Stats shown are illustrative until match is played.</p>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
