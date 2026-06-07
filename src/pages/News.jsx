import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, TrendingUp, Clock, ArrowRight, Play, Image as ImageIcon, ChevronRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  const categories = ['all', 'match-report', 'preview', 'interview', 'analysis', 'feature'];

  useEffect(() => {
    fetch(`/api/news?category=${category === 'all' ? '' : category}`)
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="text-cyan-400" size={28} />
              <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">Latest Updates</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white">
              News & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Media</span>
            </h1>
          </motion.div>

          {/* Category tabs */}
          <div className="flex gap-2 mt-8 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-cyan-500 text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Story */}
        {!loading && news.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
            >
              <div className="grid md:grid-cols-2">
                <div className="aspect-video md:aspect-auto bg-gradient-to-br from-cyan-800 to-blue-950 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play size={64} className="text-white/50 group-hover:text-cyan-400 group-hover:scale-110 transition-all" />
                  </div>
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center gap-1.5">
                    <TrendingUp size={12} /> Featured
                  </span>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-b from-gray-900 to-black">
                  <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-3">Featured Story</span>
                  <h2 className="text-2xl md:text-4xl font-black text-white mb-4 group-hover:text-cyan-400 transition-colors leading-tight">
                    {news[0]?.title || 'Breaking: FIFA 2026 Preparations Reach Final Stage'}
                  </h2>
                  <p className="text-gray-400 leading-relaxed mb-6 line-clamp-3">
                    {news[0]?.excerpt || 'As we approach the biggest World Cup in history, host cities are putting the finishing touches on stadiums.'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(news[0]?.published_at).toLocaleDateString() || 'Today'}</span>
                    <span className="capitalize">{news[0]?.category || 'Feature'}</span>
                  </div>
                  <button className="mt-6 flex items-center gap-2 text-cyan-400 font-semibold group/link">
                    Read Full Story <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.article>
          </div>
        )}

        {/* News Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white/5 h-72" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(news.slice(1) || Array.from({ length: 11 }, (_, i) => ({
                id: i,
                title: [
                  'Squad Announcements: Who Made the Cut?',
                  'Stadium Tour: Inside MetLife Stadium',
                  'Rising Stars: 5 Players to Watch in 2026',
                  'Tactical Analysis: How Teams Will Adapt',
                  'Fan Guide: Everything You Need to Know',
                  'Interview: Legends Share Their Predictions',
                  'Technology: VAR Innovations for 2026',
                  'Host Cities: Travel & Accommodation Tips',
                  'History: The Greatest Finals Ever Played',
                  'Preview: Group Stage Must-Watch Matches',
                  'Analysis: Dark Horses of Tournament',
                ][i],
                excerpt: 'In-depth coverage of the upcoming tournament with expert analysis and exclusive insights.',
                category: ['match-report', 'preview', 'interview', 'analysis', 'feature'][i % 5],
                published_at: new Date(Date.now() - i * 86400000).toISOString(),
                image_url: null,
              }))).map((article, i) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="group rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer bg-gradient-to-b from-white/[0.05] to-transparent"
                >
                  {/* Thumbnail */}
                  <div className={`aspect-video bg-gradient-to-br ${[
                    'from-cyan-900 to-blue-950',
                    'from-purple-900 to-indigo-950',
                    'from-green-900 to-teal-950',
                    'from-orange-900 to-red-950',
                    'from-pink-900 to-purple-950',
                    'from-yellow-900 to-orange-950',
                  ][i % 6]} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Newspaper size={40} className="text-white/20" />
                    </div>
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider">
                      {article.category?.replace('-', ' ') || 'News'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-xs flex items-center gap-1.5">
                        <Clock size={12} />
                        {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <ChevronRight size={14} className="text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
