import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Trophy, User, Newspaper, ArrowRight, Command } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { searchGlobal } from '../api/football';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ teams: [], players: [], news: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults({ teams: [], players: [], news: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        const data = await searchGlobal(query);
        setResults(data);
        setLoading(false);
      } else {
        setResults({ teams: [], players: [], news: [] });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const hasResults = results.teams.length > 0 || results.players.length > 0 || results.news.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-6 lg:px-8 bg-black/90 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Search Input Area */}
            <div className="p-6 border-b border-white/5 bg-white/5">
              <div className="relative flex items-center">
                <Search className="absolute left-4 text-cyan-500" size={24} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for teams, players, or news..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent pl-14 pr-12 py-4 text-xl md:text-2xl text-white placeholder-gray-600 focus:outline-none font-bold"
                />
                <button
                  onClick={onClose}
                  className="absolute right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 flex items-center gap-1">
                    <Command size={10} /> K
                  </span>
                  <span>to search</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10">ESC</span>
                  <span>to close</span>
                </div>
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {!query && (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="text-gray-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Start typing to search</h3>
                  <p className="text-gray-500 max-w-xs mx-auto">Find players, teams, and the latest World Cup news in seconds.</p>
                </div>
              )}

              {query && query.length < 2 && (
                <div className="p-12 text-center text-gray-500 font-bold">
                  Keep typing...
                </div>
              )}

              {loading && (
                <div className="p-12 flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Searching Hub...</span>
                </div>
              )}

              {!loading && query.length >= 2 && !hasResults && (
                <div className="p-12 text-center">
                  <p className="text-gray-500 font-bold">No results found for "{query}"</p>
                </div>
              )}

              {!loading && hasResults && (
                <div className="p-4 space-y-8 pb-8">
                  {/* Teams */}
                  {results.teams.length > 0 && (
                    <div>
                      <h4 className="px-4 text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <Trophy size={12} /> Qualified Nations
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {results.teams.map((team) => (
                          <Link
                            key={team.name}
                            to={`/teams/${team.name.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={onClose}
                            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                          >
                            <span className="text-3xl">{team.flag_icon}</span>
                            <div className="flex-1">
                              <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">{team.name}</div>
                              <div className="text-[10px] text-gray-500 font-bold uppercase">Group {team.group} • {team.fifa_code}</div>
                            </div>
                            <ArrowRight size={16} className="text-gray-700 group-hover:text-cyan-500 transition-colors" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Players */}
                  {results.players.length > 0 && (
                    <div>
                      <h4 className="px-4 text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <User size={12} /> Star Players
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {results.players.map((player) => (
                          <Link
                            key={player.id}
                            to={`/players/${player.id}`}
                            onClick={onClose}
                            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-xl border border-white/10">
                              {player.team.flag}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{player.name}</div>
                              <div className="text-[10px] text-gray-500 font-bold uppercase">{player.position} • {player.team.name}</div>
                            </div>
                            <div className="text-lg font-black text-white/20 group-hover:text-cyan-400 transition-colors">#{player.number}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* News */}
                  {results.news.length > 0 && (
                    <div>
                      <h4 className="px-4 text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <Newspaper size={12} /> Latest Updates
                      </h4>
                      <div className="space-y-2">
                        {results.news.map((item) => (
                          <Link
                            key={item.slug}
                            to={`/news/${item.slug}`}
                            onClick={onClose}
                            className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                          >
                            <div className="w-16 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 border border-white/5">
                              {item.image && <img src={item.image} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">{item.title}</div>
                              <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">{item.date} • {item.category}</div>
                            </div>
                            <ArrowRight size={16} className="text-gray-700 group-hover:text-purple-500 transition-colors mt-1" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <span>FIFA World Cup 2026 Data Hub</span>
              <div className="flex items-center gap-4">
                <span>{results.teams.length + results.players.length + results.news.length} results</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
