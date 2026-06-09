import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Star, User, Trophy, ChevronDown } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { getTeams } from '../api/football';

const continents = ['All', 'Europe', 'South America', 'Africa', 'Asia', 'North America', 'Oceania'];
const groups = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

function TeamModal({ team, onClose }) {
  if (!team) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Header gradient */}
        <div className={`h-32 bg-gradient-to-r ${team.gradient || 'from-cyan-600 to-blue-700'} relative`}>
          <div className="absolute inset-0 bg-black/30" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center text-5xl shadow-2xl">
              {team.flag_icon || '🏳️'}
            </div>
          </div>
        </div>
        
        <div className="pt-16 p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-white">{team.name}</h2>
              <p className="text-gray-400 mt-1">Group {team.group} • {team.continent}</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-cyan-400">{team.fifa_code}</span>
              <p className="text-xs text-gray-500 uppercase tracking-wider">FIFA Code</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <User size={18} className="text-cyan-400 mb-2" />
              <p className="text-xs text-gray-500 uppercase">Coach</p>
              <p className="text-white font-semibold">{team.coach || 'TBD'}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <Trophy size={18} className="text-yellow-400 mb-2" />
              <p className="text-xs text-gray-500 uppercase">Confederation</p>
              <p className="text-white font-semibold">{team.confed || 'TBD'}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Star size={16} className="text-yellow-400" /> Information
            </h3>
            <p className="text-gray-400 text-sm">
              {team.name} has qualified for the FIFA World Cup 2026 and will compete in Group {team.group}.
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <p className="text-gray-300 text-sm italic">"{team.tagline || `The pride of ${team.name} returns to the world stage.`}"</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getTeams()
      .then(data => {
        setTeams(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(search.toLowerCase());
    const matchesContinent = selectedContinent === 'All' || team.continent === selectedContinent;
    const matchesGroup = selectedGroup === 'All' || team.group === selectedGroup;
    return matchesSearch && matchesContinent && matchesGroup;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">48 Qualified Teams</span>
            <h1 className="text-3xl md:text-6xl font-black text-white mt-3">
              Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Champions</span>
            </h1>
            <p className="text-gray-400 mt-4 text-base md:text-lg max-w-2xl">
              From defending champions to first-time qualifiers — discover every nation competing for glory in 2026.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <div className="mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 md:py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm md:text-base"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-6 py-3 md:py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors text-sm md:text-base"
              >
                <Filter size={18} /> Filters
                <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-400 block mb-3">Continent</label>
                      <div className="flex flex-wrap gap-2">
                        {continents.map(c => (
                          <button
                            key={c}
                            onClick={() => setSelectedContinent(c)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                              selectedContinent === c
                                ? 'bg-cyan-500 text-black'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-400 block mb-3">Group</label>
                      <div className="flex flex-wrap gap-2">
                        {groups.map(g => (
                          <button
                            key={g}
                            onClick={() => setSelectedGroup(g)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                              selectedGroup === g
                                ? 'bg-cyan-500 text-black'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white/5 aspect-square" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredTeams.map((team, i) => (
                <motion.div
                  key={team.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  onClick={() => setSelectedTeam(team)}
                  className="group relative aspect-square rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/50 hover:bg-white/10 transition-all overflow-hidden"
                >
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Flag Container */}
                  <div className="relative mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-5xl md:text-6xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                      {team.flag_icon || '🏳️'}
                    </span>
                    {/* Small overlay flag for secondary identification if needed */}
                  </div>

                  <span className="text-white font-bold text-center text-sm md:text-base group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {team.name}
                  </span>
                  <span className="text-[10px] md:text-xs text-gray-500 mt-1 uppercase tracking-widest font-mono">
                    {team.fifa_code}
                  </span>

                  {/* Group Badge */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-[10px] font-black text-cyan-400 shadow-lg">
                    {team.group}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedTeam && (
            <TeamModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}