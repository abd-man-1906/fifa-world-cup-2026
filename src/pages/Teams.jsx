import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Star, MapPin, User, Trophy, ChevronDown } from 'lucide-react';
import PageTransition from '../components/PageTransition';

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
              {team.flag}
            </div>
          </div>
        </div>
        
        <div className="pt-16 p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-white">{team.name}</h2>
              <p className="text-gray-400 mt-1">Group {team.group_letter} • {team.continent}</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-cyan-400">#{team.ranking}</span>
              <p className="text-xs text-gray-500 uppercase tracking-wider">FIFA Rank</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <User size={18} className="text-cyan-400 mb-2" />
              <p className="text-xs text-gray-500 uppercase">Coach</p>
              <p className="text-white font-semibold">{team.coach}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <Trophy size={18} className="text-yellow-400 mb-2" />
              <p className="text-xs text-gray-500 uppercase">World Cups Won</p>
              <p className="text-white font-semibold">{team.world_cups_won || 0}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Star size={16} className="text-yellow-400" /> Key Players
            </h3>
          <div className="flex flex-wrap gap-2">
            {(team.star_players || []).map((player) => (
              <span key={player} className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium">
                {player}
              </span>
            ))}
          </div>
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
    fetch('/api/teams')
      .then(res => res.json())
      .then(data => {
        setTeams(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(search.toLowerCase());
    const matchesContinent = selectedContinent === 'All' || team.continent === selectedContinent;
    const matchesGroup = selectedGroup === 'All' || team.group_letter === selectedGroup;
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
            <h1 className="text-4xl md:text-6xl font-black text-white mt-3">
              Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Champions</span>
            </h1>
            <p className="text-gray-400 mt-4 text-lg max-w-2xl">
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
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                <Filter size={18} /> Filters
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="hidden sm:flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors"
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
                            Group {g}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white/5 h-64" />
              ))}
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">No teams found matching your criteria.</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredTeams.map((team, i) => (
                  <motion.div
                    key={team.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => setSelectedTeam(team)}
                    className={`group cursor-pointer relative rounded-2xl overflow-hidden border transition-all duration-300 ${
                      team.gradient ? `bg-gradient-to-b ${team.gradient}` : 'bg-gradient-to-b from-gray-800 to-gray-900'
                    } border-white/10 hover:border-cyan-500/50`}
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative p-6">
                      {/* Flag & Ranking */}
                      <div className="flex items-start justify-between mb-4">
                        <motion.span
                          whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                          className="text-5xl block drop-shadow-lg"
                        >
                          {team.flag}
                        </motion.span>
                        <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-xs font-bold text-cyan-400">
                          #{team.ranking}
                        </span>
                      </div>
                      
                      {/* Team Info */}
                      <h3 className="text-lg font-bold text-white mb-1">{team.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{team.continent}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold text-white">
                          Group {team.group_letter}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <User size={12} /> {team.coach?.split(' ')[0]}
                        </span>
                      </div>
                      
                      {/* Hover arrow */}
                      <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <ChevronDown size={16} className="text-cyan-400 rotate[-90deg]" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Team Modal */}
        <AnimatePresence>
          {selectedTeam && (
            <TeamModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}