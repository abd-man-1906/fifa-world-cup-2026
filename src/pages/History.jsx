import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, MapPin, Star, Medal, Crown, Target } from 'lucide-react';
import PageTransition from '../components/PageTransition';

function TimelineItem({ event, index, isLeft }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className={`relative flex items-center gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
    >
      {/* Content card */}
      <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'} text-left`}>
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="inline-block p-6 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all max-w-md"
        >
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 ${
            event.type === 'winner' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            event.type === 'milestone' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
            'bg-purple-500/20 text-purple-400 border border-purple-500/30'
          }`}>
            {event.type === 'winner' ? <Trophy size={12} /> : event.type === 'milestone' ? <Star size={12} /> : <Medal size={12} />}
            {event.type === 'winner' ? 'Winner' : event.type === 'milestone' ? 'Milestone' : 'Historic Moment'}
          </span>
          <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{event.description}</p>
          {event.winner && (
            <div className="mt-3 flex items-center gap-2 text-yellow-400 font-semibold">
              <Crown size={14} /> {event.winner}
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Center dot */}
      <div className="hidden md:flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + 0.2, type: 'spring' }}
          className={`w-5 h-5 rounded-full border-4 z-10 ${
            event.type === 'winner' ? 'bg-yellow-500 border-yellow-400 shadow-lg shadow-yellow-500/50' :
            event.type === 'milestone' ? 'bg-cyan-500 border-cyan-400 shadow-lg shadow-cyan-500/50' :
            'bg-purple-500 border-purple-400 shadow-lg shadow-purple-500/50'
          }`}
        />
      </div>
      
      {/* Year spacer (for alternating layout) */}
      <div className="flex-1 hidden md:block">
        <span className="text-5xl font-black text-white/10 tabular-nums">{event.year}</span>
      </div>
    </motion.div>
  );
}

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Build timeline events from history data + legendary moments
  const timelineEvents = [
    ...history.map(h => ({
      year: h.year,
      type: 'winner',
      title: `${h.year} FIFA World Cup™`,
      description: `Hosted by ${h.host_country}. ${h.winner} claimed the trophy in a historic final.`,
      winner: h.winner,
      runner_up: h.runner_up,
    })),
    { year: 1930, type: 'milestone', title: 'The First World Cup', description: 'Uruguay hosts the inaugural FIFA World Cup with 13 nations competing for glory.', winner: null },
    { year: 1950, type: 'moment', title: 'Maracanazo', description: 'Uruguay stuns Brazil at Maracanã Stadium in front of 200,000 spectators.', winner: null },
    { year: 1958, type: 'moment', title: 'Pelé Emerges', description: 'A 17-year-old Pelé announces himself on the world stage, scoring twice in the final.', winner: null },
    { year: 1974, type: 'milestone', title: 'Total Football Era', description: 'The Netherlands introduces Total Football, changing the game forever.', winner: null },
    { year: 1986, type: 'moment', title: 'Hand of God & Goal of the Century', description: 'Diego Maradona writes his name into football folklore in one match.', winner: null },
    { year: 2014, type: 'moment', title: 'The 7-1', description: 'Germany dismantles Brazil 7-1 in one of the most shocking semifinals ever.', winner: null },
  ].sort((a, b) => a.year - b.year);

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="text-yellow-400" size={28} />
              <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">94 Years of Glory</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white">
              World Cup <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">History</span>
            </h1>
            <p className="text-gray-400 mt-4 text-lg max-w-2xl">
              From Uruguay 1930 to USA 2026 — relive every moment that shaped the beautiful game.
            </p>
          </motion.div>
        </div>

        {/* Trophy Showcase */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Most <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Decorated</span> Nations
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { country: 'Brazil', flag: '🇧🇷', wins: 5, years: '1958, 1962, 1970, 1994, 2002' },
              { country: 'Germany', flag: '🇩🇪', wins: 4, years: '1954, 1974, 1990, 2014' },
              { country: 'Italy', flag: '🇮🇹', wins: 4, years: '1934, 1938, 1982, 2006' },
              { country: 'Argentina', flag: '🇦🇷', wins: 3, years: '1978, 1986, 2022' },
            ].map((nation, i) => (
              <motion.div
                key={nation.country}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group relative p-6 rounded-2xl bg-gradient-to-b from-yellow-900/20 to-black border border-yellow-500/20 hover:border-yellow-500/50 text-center transition-all"
              >
                <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform inline-block">{nation.flag}</span>
                <h3 className="font-bold text-white text-lg">{nation.country}</h3>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Trophy size={18} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-3xl font-black text-yellow-400">{nation.wins}</span>
                </div>
                <p className="text-gray-500 text-xs mt-2">World Cup Wins</p>
                <p className="text-gray-600 text-[10px] mt-1">{nation.years}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Timeline</span>
            </h2>
          </motion.div>

          {loading ? (
            <div className="space-y-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white/5 h-32" />
              ))}
            </div>
          ) : (
            <div className="relative">
              {/* Center line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500 hidden md:block" />
              
              <div className="space-y-12">
                {timelineEvents.map((event, i) => (
                  <TimelineItem key={`${event.year}-${i}`} event={event} index={i} isLeft={i % 2 === 0} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}