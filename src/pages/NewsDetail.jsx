import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, Share2, Calendar, User, Tag, ChevronRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { getNewsBySlug, getNews } from '../api/football';

export default function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    Promise.all([
      getNewsBySlug(slug),
      getNews()
    ]).then(([data, allNews]) => {
      setArticle(data);
      if (data) {
        setRelated(allNews.filter(n => n.id !== data.id).slice(0, 3));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black pt-32 text-center">
        <h1 className="text-4xl font-black text-white mb-4">Article Not Found</h1>
        <Link to="/news" className="text-cyan-400 hover:underline">Back to News</Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pb-20">
        {/* Hero Header */}
        <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden">
          <img 
            src={article.image_url || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000'} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link 
                to="/news" 
                className="inline-flex items-center gap-2 text-cyan-400 font-bold mb-6 hover:gap-3 transition-all"
              >
                <ArrowLeft size={20} /> Back to News
              </Link>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider">
                  {article.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5">
                  <Clock size={14} /> {Math.ceil(article.content.split(' ').length / 200)} min read
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm md:text-base">
                <span className="flex items-center gap-2">
                  <Calendar size={18} className="text-cyan-400" /> 
                  {new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-2">
                  <User size={18} className="text-cyan-400" /> By FIFA Editorial Team
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid lg:grid-cols-[1fr_350px] gap-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="prose prose-invert prose-cyan max-w-none"
          >
            <p className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed mb-10 italic border-l-4 border-cyan-500 pl-6">
              {article.excerpt}
            </p>
            
            <div className="text-gray-400 leading-relaxed text-lg space-y-8 whitespace-pre-line">
              {article.content}
            </div>

            {/* Share Section */}
            <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Share this story</span>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-cyan-500 hover:text-black transition-all">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-cyan-400" />
                <span className="text-sm text-gray-400">FIFA 2026, World Cup, Football</span>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <aside className="space-y-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                Related <span className="text-cyan-400">Stories</span>
              </h3>
              <div className="space-y-6">
                {related.map((item) => (
                  <Link 
                    key={item.id} 
                    to={`/news/${item.slug}`}
                    className="group block"
                  >
                    <div className="aspect-video rounded-xl overflow-hidden mb-3 border border-white/10">
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <span className="text-xs text-gray-500 mt-2 block">
                      {new Date(item.published_at).toLocaleDateString()}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter AdSense Placeholder */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-center">
              <h3 className="text-xl font-bold text-white mb-4">Join the Hub</h3>
              <p className="text-gray-400 text-sm mb-6">Get the latest World Cup updates delivered to your inbox.</p>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm mb-4 focus:outline-none focus:border-cyan-500/50"
              />
              <button className="w-full py-3 bg-cyan-500 text-black font-bold rounded-xl text-sm hover:bg-cyan-400 transition-colors">
                Subscribe Now
              </button>
            </div>
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
