import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Building2, ArrowUpRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { getStadiums } from '../api/football';

export default function Stadiums() {
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    getStadiums()
      .then(data => {
        setStadiums(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">16 Iconic Venues</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mt-3">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Stadiums</span>
            </h1>
            <p className="text-gray-400 mt-4 text-lg max-w-2xl">
              From the bright lights of MetLife to the historic Azteca — explore the cathedrals of football that will host the world's best.
            </p>
          </motion.div>
        </div>

        {/* Stadiums Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-3xl bg-white/5 h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stadiums.map((stadium, i) => (
                <motion.div
                  key={stadium.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onMouseEnter={() => setHoveredId(stadium.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  whileHover={{ y: -8 }}
                  className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-all duration-500 cursor-pointer"
                >
                  {/* Background gradient based on stadium */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    stadium.country === 'USA' ? 'from-blue-950/80 to-gray-900' :
                    stadium.country === 'Mexico' ? 'from-green-950/80 to-red-950/40' :
                    'from-red-950/80 to-gray-900'
                  }`} />
                  
                  {/* Night light effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,rgba(255,220,100,0.08)_0%,transparent_60%)]" />
                  
                  {/* Floodlight beams */}
                  <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-yellow-400/20 to-transparent origin-top" 
                    style={{ transform: hoveredId === stadium.id ? 'rotate(-15deg)' : 'rotate(-10deg)', transition: 'transform 0.5s' }}
                  />
                  <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-yellow-400/20 to-transparent origin-top"
                    style={{ transform: hoveredId === stadium.id ? 'rotate(15deg)' : 'rotate(10deg)', transition: 'transform 0.5s' }}
                  />
                  
                  <div className="relative p-6 md:p-8 min-h-[280px] md:min-h-[320px] flex flex-col justify-between">
                    <div>
                      {/* Country badge */}
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-bold mb-3 md:mb-4 ${
                        stadium.country === 'USA' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        stadium.country === 'Mexico' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        📍 {stadium.country}
                      </span>
                      
                      <h3 className="text-xl md:text-3xl font-black text-white mb-1 md:mb-2 group-hover:text-cyan-400 transition-colors">
                        {stadium.name}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-400 text-xs md:text-base">
                        <MapPin size={14} className="text-cyan-500" />
                        <span>{stadium.city}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between mt-4">
                      <div className="space-y-1 md:space-y-2">
                        <div className="flex items-center gap-2 text-gray-400 text-[10px] md:text-sm">
                          <Users size={14} className="text-cyan-500" />
                          <span>{stadium.capacity.toLocaleString()} Capacity</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-[10px] md:text-sm">
                          <Building2 size={14} className="text-cyan-500" />
                          <span>Opened {stadium.opened}</span>
                        </div>
                      </div>
                      
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors"
                      >
                        <ArrowUpRight size={18} className="text-cyan-400" />
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Hover glow */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}