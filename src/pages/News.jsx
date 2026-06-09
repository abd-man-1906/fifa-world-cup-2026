import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Newspaper, TrendingUp, Clock, ArrowRight, Play, ChevronRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { getNews } from '../api/football';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  const categories = ['all', 'match-report', 'preview', 'interview', 'analysis', 'feature'];

  useEffect(() => {
    setLoading(true);
    getNews()
      .then(data => {
        const filtered = category === 'all' ? data : data.filter(n => n.category === category);
        setNews(filtered);
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
          <div className="flex gap-2 mt-8 overflow-x-auto pb-2 scrollbar-hide">
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
            <Link to={`/news/${news[0].slug}`}>
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
              >
                <div className="grid md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto bg-gray-900 relative overflow-hidden">
                    <img 
                      src={news[0].image_url} 
                      alt={news[0].title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center gap-1.5">
                      <TrendingUp size={12} /> Featured
                    </span>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-b from-gray-900 to-black">
                    <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-3">{news[0].category}</span>
                    <h2 className="text-2xl md:text-4xl font-black text-white mb-4 group-hover:text-cyan-400 transition-colors leading-tight">
                      {news[0].title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed mb-6 line-clamp-3">
                      {news[0].excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(news[0].published_at).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-cyan-400 font-semibold group/link">
                      Read Full Story <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.article>
            </Link>
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
              {news.slice(1).map((article, i) => (
                <Link key={article.id} to={`/news/${article.slug}`}>
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -6 }}
                    className="group h-full rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer bg-gradient-to-b from-white/[0.05] to-transparent"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gray-900 relative overflow-hidden">
                      <img 
                        src={article.image_url} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider">
                        {article.category?.replace('-', ' ')}
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
