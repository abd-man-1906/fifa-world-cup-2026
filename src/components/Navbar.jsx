import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Trophy, Globe, Search, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SearchModal from './SearchModal';
import supabase from '../lib/supabase';

const navLinks = [
  { path: '/', label: 'Home', icon: '⚽' },
  { path: '/teams', label: 'Teams', icon: '🏆' },
  { path: '/matches', label: 'Matches', icon: '📅' },
  { path: '/stadiums', label: 'Stadiums', icon: '🏟️' },
  { path: '/players', label: 'Players', icon: '⭐' },
  { path: '/live-scores', label: 'Live', icon: '🔴' },
  { path: '/standings', label: 'Standings', icon: '📊' },
  { path: '/bracket', label: 'Bracket', icon: '🏅' },
  { path: '/fan-zone', label: 'Fan Zone', icon: '🎉' },
  { path: '/history', label: 'History', icon: '📜' },
  { path: '/news', label: 'News', icon: '📰' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-cyan-500/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 md:w-12 md:h-12 relative"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                  <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="45" fill="url(#logoGrad)" />
                  <text x="50" y="58" textAnchor="middle" fill="white" fontSize="32" fontWeight="bold">F</text>
                </svg>
                <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-lg md:text-xl font-black text-white tracking-tight">
                  FIFA<span className="text-cyan-400">2026</span>
                </span>
                <span className="block text-[10px] text-gray-400 tracking-[0.3em] uppercase -mt-1">World Cup</span>
              </div>
            </Link>

            {/* Desktop Navigation - Scrollable and more compact */}
            <div className="hidden xl:flex items-center gap-0.5 overflow-x-auto scrollbar-hide px-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-2 2xl:px-3 py-2 rounded-xl text-[13px] font-bold transition-all group flex items-center gap-1.5 whitespace-nowrap ${
                    location.pathname === link.path
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  <span className="hidden 2xl:inline">{link.label}</span>
                  <span className="xl:inline 2xl:hidden">{link.label.slice(0, 10)}</span>
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl -z-10"
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 md:p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 md:gap-3 px-3 md:px-4"
              >
                <Search size={20} />
                <span className="hidden lg:inline text-xs font-bold uppercase tracking-widest">Search</span>
                <span className="hidden xl:inline px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] opacity-50">⌘K</span>
              </button>

              <button
                onClick={toggleTheme}
                className="hidden md:flex p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <Link
                to={user ? "/profile" : "/login"}
                className={`p-2 md:p-2.5 rounded-xl border transition-all flex items-center gap-2 px-3 md:px-4 ${
                  user 
                    ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <User size={20} />
                <span className="hidden lg:inline text-xs font-bold uppercase tracking-widest">
                  {user ? "Profile" : "Sign In"}
                </span>
              </Link>
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="xl:hidden p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-[280px] bg-black border-l border-white/10 z-50 lg:hidden flex flex-col shadow-2xl"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <span className="font-black text-white">MENU</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-all mb-4 border border-white/5 bg-white/5"
                  >
                    <Search size={20} className="text-cyan-400" />
                    Search Hub
                  </button>

                  <Link
                    to={user ? "/profile" : "/login"}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-all mb-4 border border-white/5 bg-white/5"
                  >
                    <User size={20} className="text-blue-400" />
                    {user ? "My Profile" : "Sign In / Join"}
                  </Link>

                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                          location.pathname === link.path
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="text-xl">{link.icon}</span>
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 border-t border-white/10 bg-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Theme</span>
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-xl bg-black/40 border border-white/10 text-gray-300 flex items-center gap-2 px-4"
                    >
                      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                      <span className="text-sm font-semibold capitalize">{theme}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}