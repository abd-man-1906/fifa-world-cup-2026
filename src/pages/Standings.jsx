import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, AlertCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { getStandings } from '../api/football';

function GroupTable({ groupName, teams }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden"
    >
      <div className="px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/10">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Trophy size={16} className="text-cyan-400" />
          {groupName}
        </h3>
      </div>
      <div className="overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
        <table className="w-full min-w-[450px] text-sm">
          <thead>
            <tr className="text-gray-500 text-xs uppercase tracking-wider">
              <th className="text-left px-3 py-2.5 w-1/2 sm:w-auto">Team</th>
              <th className="px-2 py-2.5 text-center w-8">P</th>
              <th className="px-2 py-2.5 text-center w-8">W</th>
              <th className="px-2 py-2.5 text-center w-8">D</th>
              <th className="px-2 py-2.5 text-center w-8">L</th>
              <th className="px-2 py-2.5 text-center w-10">GD</th>
              <th className="px-3 py-2.5 text-center font-bold text-cyan-400 w-10">Pts</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, i) => (
              <tr
                key={team.name}
                className={`border-t border-white/5 ${i < 2 ? 'bg-cyan-500/5' : ''}`}
              >
                <td className="px-3 py-2.5">
                  <span className="flex items-center gap-2">
                    <span className="text-lg shrink-0">{team.flag}</span>
                    <span className="font-semibold text-white truncate">{team.name}</span>
                  </span>
                </td>
                <td className="px-2 py-2.5 text-center text-gray-400 shrink-0">{team.played}</td>
                <td className="px-2 py-2.5 text-center text-gray-400 shrink-0">{team.won}</td>
                <td className="px-2 py-2.5 text-center text-gray-400 shrink-0">{team.drawn}</td>
                <td className="px-2 py-2.5 text-center text-gray-400 shrink-0">{team.lost}</td>
                <td className="px-2 py-2.5 text-center text-gray-400 shrink-0">
                  {team.gd > 0 ? `+${team.gd}` : team.gd}
                </td>
                <td className="px-3 py-2.5 text-center font-bold text-cyan-400 shrink-0">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default function Standings() {
  const [standings, setStandings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStandings()
      .then(setStandings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const groupNames = Object.keys(standings).sort();

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">Group Stage</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mt-3">
              Group <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Standings</span>
            </h1>
            <p className="text-gray-400 mt-4 text-lg">
              All 12 groups (A–L) with 48 teams. Top 2 advance + best 8 third-place teams.
            </p>
          </motion.div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white/5 h-64" />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
              <p className="text-gray-400 text-lg">Failed to load standings: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupNames.map((name) => (
                <GroupTable key={name} groupName={name} teams={standings[name]} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
