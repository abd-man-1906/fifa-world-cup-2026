import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Target, Users, Zap, Shield, ChevronRight, MessageSquare, Heart } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { getLiveMatches } from '../api/football';
import supabase from '../lib/supabase';

function PredictorCard({ match, onPredict }) {
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (homeScore === '' || awayScore === '') return;
    onPredict(match.id, parseInt(homeScore), parseInt(awayScore));
    setSubmitted(true);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Target size={100} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">Group {match.group}</span>
        <span className="text-[10px] font-bold text-gray-500">{new Date(match.match_date).toLocaleDateString()}</span>
      </div>

      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex flex-col items-center gap-2 flex-1">
          <span className="text-4xl">{match.home_team.flag}</span>
          <span className="text-xs font-black text-white uppercase text-center">{match.home_team.name}</span>
        </div>
        <div className="text-2xl font-black text-white/20">VS</div>
        <div className="flex flex-col items-center gap-2 flex-1">
          <span className="text-4xl">{match.away_team.flag}</span>
          <span className="text-xs font-black text-white uppercase text-center">{match.away_team.name}</span>
        </div>
      </div>

      {submitted ? (
        <div className="text-center py-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
          <p className="text-cyan-400 font-bold text-sm">Prediction Saved!</p>
          <p className="text-white text-xl font-black mt-1">{homeScore} - {awayScore}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <input
              type="number"
              min="0"
              placeholder="0"
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              className="w-16 h-16 bg-black/40 border border-white/10 rounded-2xl text-center text-2xl font-black text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <span className="text-gray-600 font-black">-</span>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              className="w-16 h-16 bg-black/40 border border-white/10 rounded-2xl text-center text-2xl font-black text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-2xl shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            LOCK PREDICTION
          </button>
        </form>
      )}
    </motion.div>
  );
}

export default function FanZone() {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      const matches = await getLiveMatches();
      setUpcomingMatches(matches.slice(0, 3));
      setLoading(false);
    };
    init();
  }, []);

  const handlePredict = async (matchId, home, away) => {
    if (!user) {
      alert('Please sign in to save your predictions!');
      return;
    }
    
    const { error } = await supabase
      .from('predictions')
      .upsert({
        user_id: user.id,
        match_id: matchId,
        home_score: home,
        away_score: away,
        created_at: new Date().toISOString()
      });

    if (error) console.error('Prediction error:', error);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
            >
              <Zap size={12} className="fill-current" /> Interactive Experience
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              Fan <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Zone</span>
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto font-bold uppercase tracking-widest text-sm">
              Predict scores, earn badges, and compete with fans across the globe.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content: Predictor */}
            <div className="lg:col-span-2 space-y-12">
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <Target className="text-red-500" /> Match Predictor
                  </h2>
                  <div className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    Win +50 Points
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcomingMatches.map(match => (
                      <PredictorCard key={match.id} match={match} onPredict={handlePredict} />
                    ))}
                  </div>
                )}
              </section>

              <section className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-[2.5rem] p-8 md:p-12 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Shield size={150} />
                </div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-black text-white mb-4">Digital Collectibles</h2>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-8">Unlock exclusive badges as you engage with the World Cup.</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { icon: Heart, label: 'True Fan', color: 'text-red-500' },
                      { icon: Zap, label: 'First Goal', color: 'text-yellow-500' },
                      { icon: Star, label: 'Predictor', color: 'text-cyan-400' },
                      { icon: Trophy, label: 'Champion', color: 'text-purple-500' },
                    ].map(badge => (
                      <div key={badge.label} className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-black/40 border border-white/5 group hover:border-white/20 transition-all">
                        <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${badge.color} group-hover:scale-110 transition-transform`}>
                          <badge.icon size={24} />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest text-center">{badge.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar: Leaderboard & Community */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                  <Trophy className="text-yellow-500" /> Top Predictors
                </h3>
                <div className="space-y-6">
                  {[
                    { name: 'Alex_Futbol', points: 1250, rank: 1, avatar: '⚽' },
                    { name: 'Maria_2026', points: 1100, rank: 2, avatar: '🏆' },
                    { name: 'John_Doe', points: 950, rank: 3, avatar: '🧤' },
                    { name: 'Fanatic_US', points: 880, rank: 4, avatar: '🏟️' },
                  ].map(fan => (
                    <div key={fan.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                          {fan.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{fan.name}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">{fan.points} PTS</p>
                        </div>
                      </div>
                      <span className={`text-lg font-black ${fan.rank === 1 ? 'text-yellow-500' : 'text-gray-700'}`}>#{fan.rank}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-10 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 font-bold text-xs uppercase tracking-widest transition-all">
                  View Full Rankings
                </button>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-[2.5rem] p-8 relative overflow-hidden group">
                <MessageSquare className="absolute -bottom-4 -right-4 text-cyan-500/10 group-hover:scale-110 transition-transform" size={120} />
                <h3 className="text-xl font-black text-white mb-2">Fan Chat</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Join the global conversation.</p>
                <button className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  JOIN COMMUNITY <ChevronRight size={16} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
