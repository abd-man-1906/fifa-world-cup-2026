import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, MapPin, Calendar, Users, Trophy, Zap, ChevronRight, Star, Sparkles, Globe, Clock } from 'lucide-react';
import LiveTicker from '../components/LiveTicker';
import MatchCard from '../components/MatchCard';
import { getAllMatches, getLiveMatches, getNews } from '../api/football';

// Countdown to June 11, 2026 (World Cup kickoff)
const KICKOFF_DATE = new Date('2026-06-11T19:00:00-05:00');

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = KICKOFF_DATE - now;
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { value: timeLeft.days, label: 'DAYS' },
    { value: timeLeft.hours, label: 'HOURS' },
    { value: timeLeft.minutes, label: 'MINS' },
    { value: timeLeft.seconds, label: 'SECS' },
  ];

  return (
    <div className="flex gap-3 md:gap-6">
      {timeUnits.map((unit) => (
        <div key={unit.label} className="relative group">
          <div className="relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-3 md:p-6 min-w-[70px] md:min-w-[100px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <motion.span
              key={unit.value}
          className="block text-3xl md:text-6xl font-black text-white tabular-nums"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {String(unit.value).padStart(2, '0')}
        </motion.span>
            <span className="block text-[10px] md:text-xs text-cyan-400 font-bold tracking-widest mt-1">
              {unit.label}
            </span>
            {/* Glow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Floating particle component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? 'rgba(6, 182, 212, 0.6)' : i % 3 === 1 ? 'rgba(59, 130, 246, 0.6)' : 'rgba(250, 204, 21, 0.6)',
          }}
          animate={{
            y: [null, -Math.random() * 100 - 50],
            x: [null, (Math.random() - 0.5) * 100],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Stats counter animation
function AnimatedStat({ value, label, suffix = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const count = useTransform(scrollYProgress, [0, 1], [0, value]);

  return (
    <motion.div ref={ref} className="text-center">
      <motion.span className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
        {count.toFixed(suffix && value < 100 ? 0 : 0)}{suffix}
      </motion.span>
      <p className="text-gray-400 mt-2 font-medium">{label}</p>
    </motion.div>
  );
}

const features = [
  { icon: Globe, title: '3 Host Nations', desc: 'USA · Canada · Mexico united for the first time', color: 'from-green-500 to-emerald-600' },
  { icon: MapPin, title: '16 Host Cities', desc: 'From Vancouver to Mexico City, coast to coast', color: 'from-blue-500 to-cyan-500' },
  { icon: Users, title: '48 Teams', desc: 'Biggest World Cup ever with expanded format', color: 'from-purple-500 to-pink-500' },
  { icon: Calendar, title: '104 Matches', desc: '39 days of pure football magic', color: 'from-orange-500 to-red-500' },
  { icon: Trophy, title: '$1.1 Billion', desc: 'Record prize money for participating teams', color: 'from-yellow-500 to-orange-500' },
  { icon: Zap, title: '5.5M Fans', desc: 'Expected attendance across all stadiums', color: 'from-cyan-400 to-blue-600' },
];

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.1]);

  const [featuredMatches, setFeaturedMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingLive, setLoadingLive] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [matchError, setMatchError] = useState(null);

  useEffect(() => {
    setLoadingMatches(true);
    setLoadingLive(true);
    setLoadingNews(true);
    
    Promise.all([getAllMatches(), getLiveMatches(), getNews()])
      .then(([all, live, newsData]) => {
        const groupMatches = all.filter((m) => m.stage === 'group').slice(0, 2);
        const finalMatch = all.find((m) => m.stage === 'final');
        const list = [...groupMatches];
        if (finalMatch) list.push(finalMatch);
        setFeaturedMatches(list.slice(0, 3));
        setLiveMatches(live);
        setNews(newsData.slice(0, 3));
        setLoadingMatches(false);
        setLoadingLive(false);
        setLoadingNews(false);
      })
      .catch((err) => {
        setMatchError(err.message);
        setLoadingMatches(false);
        setLoadingLive(false);
        setLoadingNews(false);
      });
  }, []);


  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <LiveTicker />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[500px] lg:min-h-screen flex items-start justify-center overflow-hidden pt-20 lg:pt-0">
        {/* Background layers */}
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          {/* Gradient base */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
          
          {/* Stadium lights effect */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.15)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.1)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGF0b20+PHBhdHRlcm4gaWQ9ImciIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L2F0b20+PC9zdmc+')]" />
          
          {/* Animated gradient orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]"
            animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]"
            animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <FloatingParticles />

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-4 max-w-6xl mx-auto pt-10 sm:pt-20 md:pt-32"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 backdrop-blur-sm mb-8"
          >
            <Sparkles size={16} className="text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-300 tracking-wide">UNITED BY FOOTBALL • UNITED 2026</span>
            <Sparkles size={16} className="text-cyan-400" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-tight sm:leading-none tracking-tighter"
          >
            <span className="block text-white">FIFA WORLD</span>
            <span className="block mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">CUP</span>
            </span>
            <motion.span
              className="block mt-2 text-3xl sm:text-5xl md:text-7xl lg:text-8xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1, type: 'spring', stiffness: 100 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600">2026™</span>
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            The greatest show on earth returns. <span className="text-white font-semibold">48 nations.</span>{' '}
            <span className="text-cyan-400 font-semibold">16 cities.</span> One dream.
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12"
          >
            <p className="text-sm font-bold text-gray-500 tracking-widest uppercase mb-4">Kickoff In</p>
            <CountdownTimer />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/teams">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(6,182,212,0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold text-white text-lg overflow-hidden transition-all"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Teams <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </Link>
            <Link to="/matches">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl font-bold text-white text-lg border-2 border-white/20 hover:border-cyan-500/50 hover:bg-cyan-500/10 backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <Calendar size={20} /> View Schedule
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5"
          >
            <motion.div
              animate={{ height: [8, 16, 8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 rounded-full bg-cyan-400"
            />
          </motion.div>
        </motion.div>
      </section>



      {/* Today's Matches */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-red-400 font-bold text-sm tracking-widest uppercase">Live & Upcoming</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-3">
              Today&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Matches</span>
            </h2>
          </motion.div>

          {loadingLive ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white/5 h-40" />
              ))}
            </div>
          ) : matchError ? (
            <p className="text-center text-gray-500">Could not load matches: {matchError}</p>
          ) : liveMatches.length === 0 ? (
            <p className="text-center text-gray-500">No matches scheduled for today.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveMatches.map((match, i) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <MatchCard match={match} compact />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/matches">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl text-sm transition-colors inline-flex items-center gap-2"
              >
                View All Matches <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">Why 2026 Is Different</span>
            <h2 className="text-4xl md:text-6xl font-black text-white mt-4">
              History in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Making</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-8 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon size={26} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Matches Section */}
      <section className="relative py-24 bg-gradient-to-b from-black to-gray-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">Opening Fixtures & Finals</span>
            <h2 className="text-4xl md:text-6xl font-black text-white mt-4">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Matchups</span>
            </h2>
          </motion.div>

          {loadingMatches ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-3xl bg-white/5 h-48" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(featuredMatches.length > 0 ? featuredMatches : [
                {
                  id: 1,
                  home_team: { name: 'Argentina', flag: '🇦🇷' },
                  away_team: { name: 'Japan', flag: '🇯🇵' },
                  stadium: { name: 'Gillette Stadium', city: 'Foxborough' },
                  match_date: '2026-06-12T01:00:00+00:00',
                  stage: 'Group Stage'
                },
                {
                  id: 2,
                  home_team: { name: 'USA', flag: '🇺🇸' },
                  away_team: { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
                  stadium: { name: 'SoFi Stadium', city: 'Inglewood' },
                  match_date: '2026-06-12T20:00:00+00:00',
                  stage: 'Group Stage'
                },
                {
                  id: 25,
                  home_team: { name: 'Argentina', flag: '🇦🇷' },
                  away_team: { name: 'France', flag: '🇫🇷' },
                  stadium: { name: 'MetLife Stadium', city: 'East Rutherford' },
                  match_date: '2026-07-19T18:00:00+00:00',
                  stage: 'Final'
                }
              ]).map((match, i) => {
                const matchDate = new Date(match.match_date);
                const formattedDate = matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
                return (
                  <motion.div
                    key={match.id || i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold tracking-wider uppercase">
                          {match.stage?.replace(/_/g, ' ')}
                        </span>
                        <span className="text-gray-400 text-sm font-semibold">{formattedDate}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex flex-col items-center gap-2 flex-1">
                          <span className="text-4xl">{match.home_team?.flag || '🏳️'}</span>
                          <span className="text-white font-bold text-center text-sm">{match.home_team?.name || 'TBD'}</span>
                        </div>
                        <div className="px-3 py-1 bg-black/40 border border-white/10 rounded-xl text-xs font-black text-gray-400">VS</div>
                        <div className="flex flex-col items-center gap-2 flex-1">
                          <span className="text-4xl">{match.away_team?.flag || '🏳️'}</span>
                          <span className="text-white font-bold text-center text-sm">{match.away_team?.name || 'TBD'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-gray-500 text-xs">
                      <MapPin size={12} className="text-cyan-500" />
                      <span className="truncate">{match.stadium?.name || 'Stadium TBD'}, {match.stadium?.city || ''}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/matches">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 mx-auto"
              >
                View Full Match Schedule <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
          >
            <div>
              <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">Inside the Tournament</span>
              <h2 className="text-4xl md:text-6xl font-black text-white mt-4">
                Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">News</span>
              </h2>
            </div>
            <Link to="/news">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2"
              >
                Explore All News <ArrowRight size={16} />
              </motion.button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingNews ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-3xl bg-white/5 h-80" />
              ))
            ) : (
              news.map((article, i) => (
                <Link key={article.id} to={`/news/${article.slug}`}>
                  <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-all bg-gradient-to-b from-white/[0.03] to-transparent h-full"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={article.image_url} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                          {article.category}
                        </span>
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <Clock size={12} /> {new Date(article.published_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 mb-3">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
                        Read More <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Host Nations Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/30 via-black to-purple-950/30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">United 2026</span>
            <h2 className="text-4xl md:text-6xl font-black text-white mt-4">
              Three Nations, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">One Tournament</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'United States', flag: '🇺🇸', matches: 11, cities: 'Atlanta, Boston, Dallas, Houston, LA, Miami, NY/NJ, Philadelphia, San Francisco, Seattle', color: 'from-red-500/20 to-blue-500/20', accent: 'border-red-500/30' },
              { name: 'Mexico', flag: '🇲🇽', matches: 11, cities: 'Guadalajara, Mexico City, Monterrey', color: 'from-green-500/20 to-red-500/20', accent: 'border-green-500/30' },
              { name: 'Canada', flag: '🇨🇦', matches: 7, cities: 'Toronto, Vancouver', color: 'from-red-500/20 to-white/20', accent: 'border-red-500/30' },
            ].map((nation, i) => (
              <motion.div
                key={nation.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ scale: 1.03 }}
                className={`relative p-8 rounded-3xl bg-gradient-to-b ${nation.color} border ${nation.accent} backdrop-blur-sm overflow-hidden group cursor-pointer`}
              >
                <div className="absolute top-0 right-0 text-8xl opacity-10 group-hover:opacity-20 transition-opacity">
                  {nation.flag}
                </div>
                <div className="relative">
                  <span className="text-6xl mb-4 block">{nation.flag}</span>
                  <h3 className="text-2xl font-bold text-white mb-2">{nation.name}</h3>
                  <p className="text-cyan-400 font-semibold mb-4">{nation.matches} Stadiums • {nation.cities.split(', ').length} Host Cities</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{nation.cities}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/40 via-black to-blue-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 text-center relative"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 mx-auto mb-8 relative"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
              <defs>
                <radialGradient id="ctaBall" cx="30%" cy="30%">
                  <stop offset="0%" stopColor="#fff" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill="url(#ctaBall)" stroke="#06b6d4" strokeWidth="2" />
              <path d="M50 15 L62 35 L50 55 L38 35 Z" fill="#1e293b" />
              <path d="M22 40 L38 35 L35 58 L18 60 Z" fill="#1e293b" />
              <path d="M78 40 L62 35 L65 58 L82 60 Z" fill="#1e293b" />
              <path d="M35 58 L50 75 L50 55 Z" fill="#1e293b" />
              <path d="M65 58 L50 75 L50 55 Z" fill="#1e293b" />
            </svg>
            <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-xl" />
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Ready for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Magic?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Don't miss a moment of the biggest World Cup in history. Follow your favorite teams, track live scores, and be part of something extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/matches">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold text-white text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow flex items-center gap-2"
              >
                <Calendar size={22} /> View Schedule
              </motion.button>
            </Link>
            <Link to="/live-scores">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 rounded-2xl font-bold text-white text-lg border-2 border-cyan-500/50 hover:bg-cyan-500/10 transition-all flex items-center gap-2"
              >
                <Play size={22} /> Watch Live Scores
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}