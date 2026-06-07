import { motion } from 'framer-motion';
import { Ticket, MapPin, Plane, Hotel, Car, Utensils, Phone, Clock, Users, Star, Shield, CreditCard, Globe } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const hostCities = [
  { city: 'Atlanta', country: 'USA', flag: '🇺🇸', stadium: 'Mercedes-Benz Stadium', matches: 8, timezone: 'EST (UTC-5)', image: 'from-blue-900 to-cyan-950', highlights: ['Georgia Aquarium', 'World of Coca-Cola', 'Centennial Park'] },
  { city: 'Dallas', country: 'USA', flag: '🇺🇸', stadium: 'AT&T Stadium', matches: 9, timezone: 'CST (UTC-6)', image: 'from-indigo-900 to-purple-950', highlights: ['Reunion Tower', 'Dallas Arts District', 'Fort Worth Stockyards'] },
  { city: 'Los Angeles', country: 'USA', flag: '🇺🇸', stadium: 'SoFi Stadium', matches: 8, timezone: 'PST (UTC-8)', image: 'from-orange-900 to-red-950', highlights: ['Hollywood Sign', 'Santa Monica Beach', 'Griffith Observatory'] },
  { city: 'New York/New Jersey', country: 'USA', flag: '🇺🇸', stadium: 'MetLife Stadium', matches: 9, timezone: 'EST (UTC-5)', image: 'from-slate-900 to-blue-950', highlights: ['Statue of Liberty', 'Times Square', 'Central Park'] },
  { city: 'Mexico City', country: 'Mexico', flag: '🇲🇽', stadium: 'Estadio Azteca', matches: 5, timezone: 'CST (UTC-6)', image: 'from-green-900 to-emerald-950', highlights: ['Zócalo', 'Chapultepec Castle', 'Frida Kahlo Museum'] },
  { city: 'Toronto', country: 'Canada', flag: '🇨🇦', stadium: 'BMO Field', matches: 6, timezone: 'EST (UTC-5)', image: 'from-red-900 to-slate-950', highlights: ['CN Tower', 'Royal Ontario Museum', 'Niagara Falls Day Trip'] },
];

const ticketCategories = [
  { name: 'Opening Match', price: '$150 - $450', availability: 'Limited', icon: Star, color: 'from-yellow-500 to-amber-600' },
  { name: 'Group Stage', price: '$65 - $250', availability: 'Available', icon: Ticket, color: 'from-cyan-500 to-blue-600' },
  { name: 'Round of 16', price: '$180 - $550', availability: 'Available', icon: Shield, color: 'from-green-500 to-emerald-600' },
  { name: 'Quarter Finals', price: '$350 - $900', availability: 'Limited', icon: Users, color: 'from-purple-500 to-pink-600' },
  { name: 'Semi Finals', price: '$750 - $2,200', availability: 'Very Limited', icon: Star, color: 'from-orange-500 to-red-600' },
  { name: 'Final', price: '$1,100 - $5,000+', availability: 'Waitlist', icon: Star, isTrophy: true, color: 'from-yellow-400 to-amber-600' },
];

const travelTips = [
  { icon: Plane, title: 'Flights', desc: 'Book early! Prices surge during tournament. Consider flying into secondary airports.' },
  { icon: Hotel, title: 'Accommodation', desc: 'Official FIFA partner hotels offer packages with match tickets included.' },
  { icon: Car, title: 'Transportation', desc: 'Public transit is recommended. All host cities have expanded services for WC.' },
  { icon: Utensils, title: 'Dining', desc: 'Experience local cuisine! Food festivals in each city during match days.' },
  { icon: Shield, title: 'Safety', desc: 'FIFA Fan Zones are secure areas. Keep valuables safe and stay aware.' },
  { icon: CreditCard, title: 'Currency', desc: 'Cards accepted everywhere. No need to carry large amounts of cash.' },
];

export default function Tickets() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-16">
        {/* Hero Banner */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-950/40 via-black to-amber-950/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.1)_0%,transparent_70%)]" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <Ticket className="text-yellow-400" size={28} />
                <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">Secure Your Spot</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                Tickets & <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">Travel</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl">
                Your complete guide to experiencing FIFA World Cup 2026 live. From ticket categories to travel tips — everything you need.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Ticket Categories */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white">Ticket Categories</h2>
            <p className="text-gray-400 mt-2">Find the perfect match experience for your budget</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ticketCategories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-yellow-500/30 transition-all overflow-hidden"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4`}>
                  {cat.isTrophy ? (
                    <span className="text-2xl">🏆</span>
                  ) : (
                    <cat.icon size={22} className="text-white" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-2xl font-black text-yellow-400 mb-2">{cat.price}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  cat.availability === 'Available' ? 'bg-green-500/20 text-green-400' :
                  cat.availability === 'Limited' || cat.availability === 'Very Limited' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {cat.availability}
                </span>
              </motion.div>
            ))}
          </div>
          
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 text-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(250,204,21,0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl font-bold text-black text-lg shadow-lg shadow-yellow-500/25"
            >
              <Ticket size={20} className="inline mr-2" /> Buy Tickets Now
            </motion.button>
          </motion.div>
        </div>

        {/* Host Cities */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white">Host City Guides</h2>
            <p className="text-gray-400 mt-2">Explore each host city and plan your perfect trip</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostCities.map((city, i) => (
              <motion.div
                key={city.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-all"
              >
                <div className={`h-40 bg-gradient-to-br ${city.image} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{city.flag}</span>
                      <h3 className="font-bold text-white text-lg">{city.city}</h3>
                    </div>
                    <p className="text-gray-300 text-sm">{city.country}</p>
                  </div>
                </div>
                
                <div className="p-5 bg-gradient-to-b from-gray-900 to-black">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin size={14} className="text-cyan-400" /> {city.stadium}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Ticket size={14} className="text-yellow-400" /> {city.matches} Matches
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock size={14} className="text-cyan-400" /> {city.timezone}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Top Attractions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {city.highlights.map(h => (
                        <span key={h} className="px-2 py-1 rounded-md bg-white/5 text-gray-400 text-xs">{h}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Travel Tips */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white">Travel Tips</h2>
            <p className="text-gray-400 mt-2">Everything you need to know before you go</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelTips.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <tip.icon size={18} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">{tip.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{tip.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center p-12 rounded-3xl bg-gradient-to-r from-yellow-900/20 via-amber-900/10 to-yellow-900/20 border border-yellow-500/20"
          >
            <Globe size={48} className="mx-auto text-yellow-400 mb-6" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready for the Journey?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Start planning your ultimate World Cup adventure today. Flights, hotels, tickets — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl font-bold text-black text-lg shadow-lg shadow-yellow-500/25 flex items-center gap-2"
              >
                <Plane size={20} /> Plan Your Trip
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl font-bold text-white border-2 border-white/20 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all flex items-center gap-2"
              >
                <Phone size={20} /> Contact Support
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}