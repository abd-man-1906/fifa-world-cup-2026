import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Star, 
  Zap, 
  Target, 
  Shield, 
  TrendingUp, 
  Award,
  Globe,
  Activity,
  History
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { getPlayerById } from '../api/football';

function StatCircle({ value, label, color }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className="stroke-white/5 fill-none"
            strokeWidth="8"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            className={`fill-none ${color}`}
            strokeWidth="8"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * value) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-xl md:text-2xl font-black text-white">{value}</span>
      </div>
      <span className="mt-2 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export default function PlayerDetail() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    getPlayerById(id).then(data => {
      setPlayer(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-black pt-32 text-center">
        <h1 className="text-4xl font-black text-white mb-4">Player Not Found</h1>
        <Link to="/players" className="text-cyan-400 hover:underline">Back to Players</Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pb-20">
        {/* Hero Section */}
        <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden flex items-end">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-black/80 to-black z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(6,182,212,0.15)_0%,transparent_70%)]" />
          
          <div className="max-w-7xl mx-auto px-4 md:px-12 w-full pb-12 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12"
            >
              {/* Profile Image/Placeholder */}
              <div className="relative group">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center overflow-hidden shadow-2xl">
                  <span className="text-9xl opacity-20 group-hover:scale-110 transition-transform duration-500">👤</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 inset-x-0 text-center">
                    <span className="text-5xl md:text-6xl drop-shadow-lg">{player.team.flag}</span>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-cyan-500 flex items-center justify-center text-black font-black text-3xl shadow-xl rotate-12">
                  #{player.number}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <Link to="/players" className="inline-flex items-center gap-2 text-cyan-400 font-bold mb-6 hover:gap-3 transition-all">
                  <ChevronLeft size={20} /> Featured Players
                </Link>
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h1 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase">
                    {player.name.split(' ').map((n, i) => (
                      <span key={i} className={i === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 block' : 'block'}>
                        {n}
                      </span>
                    ))}
                  </h1>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                  <span className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-md text-white font-bold flex items-center gap-2 border border-white/10">
                    <Target size={18} className="text-cyan-400" /> {player.position}
                  </span>
                  <span className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-md text-white font-bold flex items-center gap-2 border border-white/10">
                    <Globe size={18} className="text-blue-400" /> {player.team.name}
                  </span>
                  <span className="px-6 py-2 rounded-full bg-cyan-500 text-black font-black uppercase tracking-widest text-sm shadow-lg shadow-cyan-500/20">
                    Rating {player.rating}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-4 md:px-12 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Stats */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <Activity className="text-cyan-400" /> Performance Profile
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 p-10 rounded-3xl bg-white/5 border border-white/10">
                <StatCircle value={player.pace} label="Pace" color="stroke-cyan-500" />
                <StatCircle value={player.shooting} label="Shooting" color="stroke-blue-500" />
                <StatCircle value={player.passing} label="Passing" color="stroke-indigo-500" />
                <StatCircle value={player.defense} label="Defense" color="stroke-purple-500" />
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <History className="text-cyan-400" /> Career Highlights
              </h3>
              <div className="space-y-4">
                {[
                  { icon: <Award className="text-yellow-400" />, label: 'International Goals', value: player.goals },
                  { icon: <TrendingUp className="text-green-400" />, label: 'International Assists', value: player.assists },
                  { icon: <Star className="text-cyan-400" />, label: 'Major Trophies', value: player.trophies },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <span className="font-bold text-gray-300">{item.label}</span>
                    </div>
                    <span className="text-2xl font-black text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 text-black">
              <Zap size={40} className="mb-4" />
              <h3 className="text-2xl font-black mb-2">2026 Outlook</h3>
              <p className="font-bold opacity-90 leading-relaxed">
                Expected to be a pivotal figure for {player.team.name}. Current form suggests {player.name} will be 
                contending for the Golden Ball in North America.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <h4 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-6">Player Details</h4>
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-gray-400">Nationality</span>
                  <span className="text-white font-bold">{player.team.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-gray-400">Position</span>
                  <span className="text-white font-bold">{player.position}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-gray-400">Age (2026)</span>
                  <span className="text-white font-bold">38</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Preferred Foot</span>
                  <span className="text-white font-bold">Left</span>
                </div>
              </div>
            </div>

            {/* AdSense Placeholder */}
            <div className="aspect-[3/4] rounded-3xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <Activity size={24} className="text-gray-500" />
              </div>
              <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Advertisement</span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
