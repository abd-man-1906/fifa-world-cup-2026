import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Settings, Heart, Trophy, Bell, Shield, ChevronRight } from 'lucide-react';
import supabase from '../lib/supabase';
import { getTeams } from '../api/football';
import PageTransition from '../components/PageTransition';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [favTeam, setFavTeam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    getTeams().then(setTeams);
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
    } else {
      setUser(user);
      // In a real app, fetch fav team from user_metadata or a separate profiles table
      const savedTeam = localStorage.getItem(`fav_team_${user.id}`);
      if (savedTeam) setFavTeam(JSON.parse(savedTeam));
    }
    setLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  function handleSelectFavTeam(team) {
    setFavTeam(team);
    if (user) {
      localStorage.setItem(`fav_team_${user.id}`, JSON.stringify(team));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Sidebar / Info */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-4xl mb-6 shadow-xl shadow-cyan-500/20">
                    <User size={40} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-1">
                    {user?.user_metadata?.full_name || 'Fan Account'}
                  </h2>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-8">
                    {user?.email}
                  </p>
                  
                  <div className="w-full space-y-2">
                    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all group">
                      <div className="flex items-center gap-3">
                        <Settings size={18} className="text-gray-400 group-hover:text-cyan-400" />
                        Account Settings
                      </div>
                      <ChevronRight size={16} className="text-gray-700" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all group">
                      <div className="flex items-center gap-3">
                        <Bell size={18} className="text-gray-400 group-hover:text-yellow-400" />
                        Notifications
                      </div>
                      <ChevronRight size={16} className="text-gray-700" />
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <LogOut size={18} />
                        Sign Out
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>

              {favTeam && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-8 rounded-[2.5rem] bg-gradient-to-br ${favTeam.gradient || 'from-cyan-600 to-blue-700'} relative overflow-hidden group`}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <Trophy size={120} className="text-white" />
                  </div>
                  <div className="relative z-10">
                    <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em] mb-4 block">My National Team</span>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-5xl drop-shadow-lg">{favTeam.flag_icon}</span>
                      <div>
                        <h3 className="text-3xl font-black text-white leading-none">{favTeam.name}</h3>
                        <p className="text-white/70 font-bold mt-1 uppercase tracking-widest text-xs">Group {favTeam.group}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/teams/${favTeam.name.toLowerCase().replace(/\s+/g, '-')}`)}
                      className="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      Team Hub <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-white flex items-center gap-3">
                    <Heart className="text-cyan-400" /> Select Favorite Team
                  </h3>
                  <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    48 Nations
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {teams.map((team) => (
                    <button
                      key={team.name}
                      onClick={() => handleSelectFavTeam(team)}
                      className={`group p-4 rounded-3xl border transition-all flex flex-col items-center justify-center gap-3 ${
                        favTeam?.name === team.name
                          ? 'bg-cyan-500/10 border-cyan-500 shadow-lg shadow-cyan-500/10'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="text-4xl group-hover:scale-110 transition-transform">{team.flag_icon}</span>
                      <span className={`font-bold text-sm text-center ${favTeam?.name === team.name ? 'text-cyan-400' : 'text-gray-400 group-hover:text-white'}`}>
                        {team.name}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                    <Shield className="text-yellow-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white">Fan Passport</h4>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Digital Rewards & Badges</p>
                  </div>
                </div>
                <div className="p-10 border border-dashed border-white/10 rounded-3xl text-center">
                  <p className="text-gray-500 font-bold italic">
                    Earn rewards by participating in the Fan Zone and predicting match outcomes. 
                    Badges will be unlocked closer to the tournament kickoff!
                  </p>
                </div>
              </section>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
