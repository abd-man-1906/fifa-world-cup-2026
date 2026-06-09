import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitBranch, AlertCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { getBracketMatches } from '../api/football';

function BracketMatch({ match }) {
  const date = new Date(match.match_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      to={`/match/${match.id}`}
      className="block p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-500/30 transition-all text-sm"
    >
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>{date}</span>
        {match.num && <span>#{match.num}</span>}
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-white font-medium truncate">
            <span>{match.home_team?.flag}</span>
            <span className="truncate">{match.home_team?.name}</span>
          </span>
          <span className="font-bold text-cyan-400 tabular-nums shrink-0">
            {match.home_score ?? '-'}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-white font-medium truncate">
            <span>{match.away_team?.flag}</span>
            <span className="truncate">{match.away_team?.name}</span>
          </span>
          <span className="font-bold text-cyan-400 tabular-nums shrink-0">
            {match.away_score ?? '-'}
          </span>
        </div>
      </div>
      <p className="text-[10px] text-gray-600 mt-2 truncate">{match.stadium?.name}</p>
    </Link>
  );
}

function BracketRound({ label, matches }) {
  if (!matches?.length) return null;

  return (
    <div className="flex flex-col gap-3 min-w-[200px]">
      <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest text-center sticky top-24">
        {label}
      </h3>
      <div className="flex flex-col gap-2">
        {matches.map((match) => (
          <BracketMatch key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}

export default function Bracket() {
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBracketMatches()
      .then(setBracket)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const rounds = bracket
    ? [
        bracket.round_of_32,
        bracket.round_of_16,
        bracket.quarter_finals,
        bracket.semi_finals,
        bracket.final,
        bracket.third_place,
      ].filter((r) => r?.matches?.length)
    : [];

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">Knockout Stage</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mt-3">
              Tournament <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Bracket</span>
            </h1>
            <p className="text-gray-400 mt-4 text-lg">
              Round of 32 through the Final. Click any match for details.
            </p>
          </motion.div>

          {loading && (
            <div className="animate-pulse rounded-2xl bg-white/5 h-96" />
          )}

          {error && (
            <div className="text-center py-20">
              <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
              <p className="text-gray-400 text-lg">Failed to load bracket: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6 min-w-max items-start">
                {rounds.map((round) => (
                  <BracketRound key={round.label} label={round.label} matches={round.matches} />
                ))}
              </div>
            </div>
          )}

          {!loading && !error && rounds.length === 0 && (
            <div className="text-center py-20">
              <GitBranch size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-500 text-xl">Knockout bracket data not available yet.</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
