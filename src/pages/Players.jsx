import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Target, Shield, Zap, Award, ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { getPlayers } from '../api/football';

function SkillBar({ label, value, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
        <span className="text-gray-500">{label}</span>
        <span className="text-white">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

function PlayerCard({ player, index }) {
  return (
    <Link to={`/players/${player.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -8 }}
        className="group relative rounded-3xl bg-white/5 border border-white/10 p-6 hover:border-cyan-500/50 transition-all overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <span className="text-8xl font-black text-white">#{player.number}</span>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-3xl shadow-lg border border-white/10 group-hover:scale-110 transition-transform">
              {player.team?.flag}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                {player.name}
              </h3>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest">{player.position}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <SkillBar label="Pace" value={player.pace} color="bg-cyan-500" />
            <SkillBar label="Shot" value={player.shooting} color="bg-blue-500" />
            <SkillBar label="Pass" value={player.passing} color="bg-indigo-500" />
            <SkillBar label="Def" value={player.defense} color="bg-purple-500" />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="text-lg font-black text-white">{player.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-cyan-400 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
              Details <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlayers()
      .then(data => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <Star className="text-yellow-400" size={28} />
              <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">Superstars of 2026</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white">
              Legendary <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Players</span>
            </h1>
            <p className="text-gray-400 mt-4 text-lg max-w-2xl">
              The world's finest footballers converge. Witness greatness up close.
            </p>
          </motion.div>
        </div>

        {/* Players Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-3xl bg-white/5 h-[600px]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {players.map((player, i) => (
                <PlayerCard key={player.id} player={player} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}