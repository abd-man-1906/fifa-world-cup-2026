import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Users, Trophy, Activity, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLiveScores } from '../api/football';

export default function LiveDashboard() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const data = await getLiveScores();
        setLiveMatches(data.filter(m => m.status === 'live').slice(0, 2));
      } catch (error) {
        console.error('Dashboard fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLive();
    const interval = setInterval(fetchLive, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
      {/* Tournament Stats Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="md:col-span-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="text-yellow-500" size={20} />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tournament Pulse</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-bold">Goals Scored</span>
              <span className="text-xl font-black text-white">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-bold">Attendance</span>
              <span className="text-xl font-black text-white">225,482</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-bold">Avg. Goals</span>
              <span className="text-xl font-black text-white">3.0</span>
            </div>
          </div>
        </div>
        <Link to="/standings" className="mt-6 flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold text-cyan-400 transition-all">
          View Full Standings <ArrowRight size={14} />
        </Link>
      </motion.div>

      {/* Live Matches Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:col-span-2 bg-gradient-to-br from-red-500/10 to-transparent backdrop-blur-xl border border-red-500/20 rounded-3xl p-6 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity size={120} className="text-red-500" />
        </div>

        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-[10px] font-black uppercase tracking-widest">Live Now</span>
            </div>
          </div>
          <Link to="/live" className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
            View All Live <Zap size={12} className="text-yellow-500" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          <AnimatePresence mode="wait">
            {liveMatches.length > 0 ? (
              liveMatches.map((match) => (
                <Link
                  key={match.id}
                  to={`/match/${match.id}`}
                  className="bg-black/40 border border-white/5 rounded-2xl p-4 hover:border-red-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-red-500">{match.minute}'</span>
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">{match.stage?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <span className="text-2xl">{match.home_team.flag}</span>
                      <span className="text-[10px] font-black text-white uppercase truncate w-full text-center">{match.home_team.code}</span>
                    </div>
                    <div className="text-xl font-black text-white px-3 py-1 bg-white/5 rounded-lg">
                      {match.home_score} - {match.away_score}
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <span className="text-2xl">{match.away_team.flag}</span>
                      <span className="text-[10px] font-black text-white uppercase truncate w-full text-center">{match.away_team.code}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center bg-black/20 rounded-2xl border border-dashed border-white/10">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">No matches currently live</p>
                <p className="text-[10px] text-gray-600 mt-1 uppercase">Next kickoff in 2 hours</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
