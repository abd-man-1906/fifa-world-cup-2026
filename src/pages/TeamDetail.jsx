import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Trophy, 
  Users, 
  Calendar, 
  Star, 
  TrendingUp, 
  Info,
  MapPin,
  Clock
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { getTeamBySlug, getTeamMatches, getStandings } from '../api/football';
import MatchCard from '../components/MatchCard';

export default function TeamDetail() {
  const { slug } = useParams();
  const [team, setTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [groupStandings, setGroupStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('fixtures');

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    getTeamBySlug(slug).then(teamData => {
      if (teamData) {
        setTeam(teamData);
        
        Promise.all([
          getTeamMatches(teamData.name),
          getStandings()
        ]).then(([matchData, allStandings]) => {
          setMatches(matchData);
          const groupKey = `Group ${teamData.group}`;
          setGroupStandings(allStandings[groupKey] || []);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-black pt-32 text-center">
        <h1 className="text-4xl font-black text-white mb-4">Team Not Found</h1>
        <Link to="/teams" className="text-cyan-400 hover:underline">Back to Teams</Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pb-20">
        {/* Hero Header */}
        <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${team.gradient || 'from-cyan-900 via-blue-950 to-black'}`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)]" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10"
            >
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-white/10 backdrop-blur-xl border-2 border-white/20 flex items-center justify-center text-7xl md:text-9xl shadow-2xl">
                {team.flag_icon}
              </div>
              <div className="text-center md:text-left pb-2">
                <Link to="/teams" className="inline-flex items-center gap-2 text-cyan-400 font-bold mb-4 hover:gap-3 transition-all">
                  <ChevronLeft size={20} /> All Teams
                </Link>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tighter">
                  {team.name.toUpperCase()}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                  <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white font-bold flex items-center gap-2 border border-white/10">
                    <Trophy size={18} className="text-yellow-400" /> Group {team.group}
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white font-bold flex items-center gap-2 border border-white/10">
                    <Star size={18} className="text-cyan-400" /> {team.confed}
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-cyan-500 text-black font-black uppercase tracking-widest text-sm">
                    {team.fifa_code}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-8">
              {[
                { id: 'fixtures', label: 'Fixtures & Results', icon: <Calendar size={18} /> },
                { id: 'standings', label: 'Standings', icon: <TrendingUp size={18} /> },
                { id: 'squad', label: 'Squad', icon: <Users size={18} /> },
                { id: 'info', label: 'Team Info', icon: <Info size={18} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-6 text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-all relative ${
                    activeTab === tab.id ? 'text-cyan-400' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {tab.icon} {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 mt-12">
          {activeTab === 'fixtures' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
              {matches.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-white/10">
                  <Calendar size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No matches found for this team.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'standings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 bg-white/5">
                <h3 className="text-xl font-bold text-white">Group {team.group} Standings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/40 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4 text-left">Pos</th>
                      <th className="px-6 py-4 text-left">Team</th>
                      <th className="px-6 py-4 text-center">P</th>
                      <th className="px-6 py-4 text-center">W</th>
                      <th className="px-6 py-4 text-center">D</th>
                      <th className="px-6 py-4 text-center">L</th>
                      <th className="px-6 py-4 text-center">GD</th>
                      <th className="px-6 py-4 text-center">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {groupStandings.map((row, idx) => (
                      <tr 
                        key={row.name} 
                        className={`transition-colors ${row.name === team.name ? 'bg-cyan-500/10' : 'hover:bg-white/5'}`}
                      >
                        <td className="px-6 py-5 font-bold text-white">{idx + 1}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{row.flag}</span>
                            <span className={`font-bold ${row.name === team.name ? 'text-cyan-400' : 'text-white'}`}>
                              {row.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center text-gray-300">{row.played}</td>
                        <td className="px-6 py-5 text-center text-gray-300">{row.won}</td>
                        <td className="px-6 py-5 text-center text-gray-300">{row.drawn}</td>
                        <td className="px-6 py-5 text-center text-gray-300">{row.lost}</td>
                        <td className="px-6 py-5 text-center font-bold text-white">
                          {row.gd > 0 ? `+${row.gd}` : row.gd}
                        </td>
                        <td className="px-6 py-5 text-center font-black text-cyan-400">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'squad' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="col-span-full mb-8">
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  <Users className="text-cyan-400" /> Projected Squad
                </h3>
              </div>
              
              {/* Mock squad for MVP if not in database */}
              {[
                { name: 'Star Forward', pos: 'FW', num: 10, rating: 92 },
                { name: 'Captain Midfielder', pos: 'MF', num: 8, rating: 88 },
                { name: 'Rock Solid Defender', pos: 'DF', num: 4, rating: 85 },
                { name: 'Wall Goalkeeper', pos: 'GK', num: 1, rating: 87 },
              ].map((player, i) => (
                <div key={i} className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-black text-xl">
                      {player.num}
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{player.pos}</div>
                      <div className="text-lg font-black text-white">{player.rating}</div>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {player.name}
                  </h4>
                  <div className="mt-4 flex gap-2">
                    <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold text-gray-400 uppercase">Key Player</span>
                  </div>
                </div>
              ))}
              
              <div className="col-span-full mt-10 p-10 text-center bg-cyan-500/5 rounded-3xl border border-cyan-500/20">
                <p className="text-cyan-400/80 font-bold">
                  Official squad announcements will be updated as the tournament approaches.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'info' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="md:col-span-2 space-y-8">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <h3 className="text-2xl font-black text-white mb-6">Tournament Strategy</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    {team.name} enters the 2026 FIFA World Cup with a clear objective: dominance in Group {team.group}. 
                    Under the leadership of {team.coach || 'their national head coach'}, the team has been refining a tactical 
                    approach that blends their traditional style with modern analytical insights.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                    <MapPin className="text-cyan-400 mb-4" />
                    <h4 className="font-bold text-white mb-2">Training Base</h4>
                    <p className="text-gray-400 text-sm">To be announced based on final regional allocations.</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                    <Clock className="text-cyan-400 mb-4" />
                    <h4 className="font-bold text-white mb-2">Qualifying Path</h4>
                    <p className="text-gray-400 text-sm">Qualified through the {team.confed} qualifiers as a top-ranked nation.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 text-black">
                  <Trophy size={40} className="mb-4" />
                  <h3 className="text-2xl font-black mb-2">Championship Odds</h3>
                  <p className="font-bold opacity-80 mb-6">One of the favorites to progress deep into the knockout rounds.</p>
                  <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-black w-[75%]" />
                  </div>
                </div>
                
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <h4 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-4">Social Media</h4>
                  <div className="flex gap-4">
                    {['Twitter', 'Instagram', 'Facebook'].map(s => (
                      <div key={s} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-cyan-500 hover:text-black cursor-pointer transition-all">
                        {s[0]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
