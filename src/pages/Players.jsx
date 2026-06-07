import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Target, Shield, Zap, Award } from 'lucide-react';
import PageTransition from '../components/PageTransition';

function SkillBar({ label, value, color = 'cyan' }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className={`font-bold text-${color}-400`}>{value}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r from-${color}-500 to-${color}-400`}
        />
      </div>
    </div>
  );
}

function PlayerCard({ player, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-all duration-500"
    >
      {/* Gradient header */}
      <div className={`h-48 bg-gradient-to-br ${player.team?.gradient || 'from-cyan-900 to-blue-900'} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Player number watermark */}
        <span className="absolute bottom-2 right-4 text-[120px] font-black text-white/5 leading-none select-none">
          {player.number || (index + 1)}
        </span>
        
        {/* Position badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs font-bold text-white border border-white/20">
            {player.position}
          </span>
        </div>
        
        {/* Rating badge */}
        <div className="absolute top-4 right-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <span className="text-lg font-black text-white">{player.rating}</span>
          </div>
        </div>
        
        {/* Star player indicator */}
        {player.is_featured && (
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-yellow-400">Featured</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
              {player.name}
            </h3>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
              <span>{player.team?.flag || '🏳️'}</span>
              {player.team?.name || 'National Team'}
            </p>
          </div>
        </div>
        
        {/* Skills */}
        <div className="space-y-3">
          <SkillBar label="Pace" value={player.pace || 85} color="cyan" />
          <SkillBar label="Shooting" value={player.shooting || 80} color="green" />
          <SkillBar label="Passing" value={player.passing || 82} color="blue" />
          <SkillBar label="Defense" value={player.defense || 70} color="purple" />
        </div>
        
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/5">
          <div className="text-center">
            <Target size={14} className="mx-auto text-cyan-400 mb-1" />
            <p className="text-white font-bold text-sm">{player.goals || 0}</p>
            <p className="text-gray-600 text-[10px] uppercase">Goals</p>
          </div>
          <div className="text-center">
            <Zap size={14} className="mx-auto text-yellow-400 mb-1" />
            <p className="text-white font-bold text-sm">{player.assists || 0}</p>
            <p className="text-gray-600 text-[10px] uppercase">Assists</p>
          </div>
          <div className="text-center">
            <Award size={14} className="mx-auto text-purple-400 mb-1" />
            <p className="text-white font-bold text-sm">{player.trophies || 0}</p>
            <p className="text-gray-600 text-[10px] uppercase">Trophies</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/players?featured=true')
      .then(res => res.json())
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