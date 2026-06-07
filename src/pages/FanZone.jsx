import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, MessageCircle, Share2, Download, Image as ImageIcon, Vote, Music, Heart, Flame } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const wallpapers = [
  { id: 1, title: 'Glory Awaits', gradient: 'from-cyan-600 to-blue-800', downloads: 125000 },
  { id: 2, title: 'United We Stand', gradient: 'from-purple-600 to-pink-700', downloads: 98000 },
  { id: 3, title: 'Champions Rise', gradient: 'from-yellow-600 to-orange-700', downloads: 156000 },
  { id: 4, title: 'The Beautiful Game', gradient: 'from-green-600 to-teal-700', downloads: 89000 },
  { id: 5, title: 'Night Under Lights', gradient: 'from-indigo-700 to-purple-900', downloads: 112000 },
  { id: 6, title: 'Golden Moment', gradient: 'from-amber-500 to-red-700', downloads: 134000 },
];

const memes = [
  { id: 1, emoji: '😂', text: 'When you finally understand offside rule', likes: 15420 },
  { id: 2, emoji: '⚽', text: 'Me watching World Cup instead of working', likes: 12300 },
  { id: 3, emoji: '🐐', text: 'GOAT debates at 3am', likes: 18900 },
  { id: 4, emoji: '😭', text: 'When your team loses in penalties', likes: 22100 },
  { id: 5, emoji: '🎉', text: 'Me after my team scores', likes: 16700 },
  { id: 6, emoji: '🤡', text: 'VAR decisions be like', likes: 19800 },
];

function PollCard({ poll, onVote }) {
  const [hasVoted, setHasVoted] = useState(false);
  const totalVotes = poll.votes?.reduce((a, b) => a + b, 0) || 1;

  const handleVote = (index) => {
    if (!hasVoted) {
      onVote(poll.id, index);
      setHasVoted(true);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <Vote className="text-purple-400" size={20} />
        <h3 className="font-bold text-white">{poll.question}</h3>
      </div>
      
      <div className="space-y-3">
        {(poll.options || []).map((option, i) => {
          const voteCount = poll.votes?.[i] || 0;
          const percentage = hasVoted ? ((voteCount / totalVotes) * 100).toFixed(0) : 0;
          
          return (
            <button
              key={i}
              onClick={() => handleVote(i)}
              disabled={hasVoted}
              className={`relative w-full text-left p-3 rounded-xl border transition-all overflow-hidden ${
                hasVoted
                  ? 'border-white/10 cursor-default'
                  : 'border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 cursor-pointer'
              }`}
            >
              {hasVoted && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500/20 to-purple-500/10`}
                />
              )}
              <div className="relative flex justify-between">
                <span className="text-sm font-medium text-white">{option}</span>
                {hasVoted && <span className="text-sm text-purple-400 font-bold">{percentage}%</span>}
              </div>
            </button>
          );
        })}
      </div>
      
      <p className="text-xs text-gray-500 mt-4">{totalVotes.toLocaleString()} votes</p>
    </motion.div>
  );
}

export default function FanZone() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('polls');

  useEffect(() => {
    fetch('/api/polls')
      .then(res => res.json())
      .then(data => {
        setPolls(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    try {
      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poll_id: pollId, option_index: optionIndex }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPolls(polls.map(p => p.id === updated.id ? updated : p));
      }
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const tabs = [
    { id: 'polls', label: '📊 Polls & Quizzes', icon: Vote },
    { id: 'wallpapers', label: '🖼️ Wallpapers', icon: ImageIcon },
    { id: 'memes', label: '😂 Meme Gallery', icon: MessageCircle },
    { id: 'chants', label: '🎵 Fan Chants', icon: Music },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <Flame className="text-orange-500" size={28} />
              <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">For The Fans</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white">
              Fan <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Zone</span>
            </h1>
            <p className="text-gray-400 mt-4 text-lg max-w-2xl">
              Join millions of fans worldwide. Vote, share, download, and celebrate the beautiful game together.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mt-8 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Polls Tab */}
          {activeTab === 'polls' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {loading ? (
                <div className="col-span-2 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse rounded-2xl bg-white/5 h-48" />
                  ))}
                </div>
              ) : polls.length > 0 ? (
                polls.map(poll => (
                  <PollCard key={poll.id} poll={poll} onVote={handleVote} />
                ))
              ) : (
                <p className="text-gray-500 col-span-2 text-center py-10">No polls available yet.</p>
              )}
            </div>
          )}

          {/* Wallpapers Tab */}
          {activeTab === 'wallpapers' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wallpapers.map(wallpaper => (
                <motion.div
                  key={wallpaper.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative rounded-2xl overflow-hidden aspect-video cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${wallpaper.gradient}`} />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    <ImageIcon size={32} className="text-white/50 mb-3" />
                    <h3 className="font-bold text-white text-lg">{wallpaper.title}</h3>
                    <p className="text-white/60 text-sm mt-1">FIFA 2026 Official Wallpaper</p>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm flex items-center gap-1.5">
                        <Download size={14} /> {wallpaper.downloads.toLocaleString()} downloads
                      </span>
                      <button className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors flex items-center gap-1.5">
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Memes Tab */}
          {activeTab === 'memes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memes.map(meme => (
                <motion.div
                  key={meme.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-yellow-500/30 transition-all"
                >
                  <span className="text-5xl block mb-4">{meme.emoji}</span>
                  <p className="text-white font-medium leading-relaxed">{meme.text}</p>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm transition-colors">
                      <Heart size={16} className="fill-red-400" /> {meme.likes.toLocaleString()}
                    </button>
                    <button className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                      <Share2 size={16} /> Share
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Chants Tab */}
          {activeTab === 'chants' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {[{ country: 'Brazil', flag: '🇧🇷', chant: 'Eu sou brasileiro, com muito orgulho, com muito amor!', color: 'from-green-600 to-yellow-600' },
                { country: 'Argentina', flag: '🇦🇷', chant: 'Vamos, vamos Argentina!', color: 'from-blue-600 to-white/20' },
                { country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', chant: "It's coming home, it's coming home!", color: 'from-red-600 to-white/20' },
                { country: 'Germany', flag: '🇩🇪', chant: 'Oh wie ist das schön! Deutschland!', color: 'from-black to-yellow-600/40' },
                { country: 'Spain', flag: '🇪🇸', chant: 'A por ellos, oé! Vamos España!', color: 'from-red-600 to-yellow-600' },
                { country: 'France', flag: '🇫🇷', chant: 'Allez les Bleus! On va gagner!', color: 'from-blue-600 to-red-600' },
              ].map((item, i) => (
                <motion.div
                  key={item.country}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className={`relative p-6 rounded-2xl bg-gradient-to-br ${item.color} border border-white/10 overflow-hidden group cursor-pointer`}
                >
                  <div className="absolute top-4 right-4 text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                    {item.flag}
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{item.flag}</span>
                      <h3 className="font-bold text-white text-lg">{item.country}</h3>
                    </div>
                    <p className="text-white/80 italic text-lg leading-relaxed">"{item.chant}"</p>
                    <button className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors">
                      <Music size={16} /> Play Chant
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}