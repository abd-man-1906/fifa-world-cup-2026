import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Twitter, Instagram, Youtube, Facebook, Heart } from 'lucide-react';

const footerLinks = {
  tournament: [
    { label: 'About FIFA 2026', href: '/about' },
    { label: 'Host Cities', href: '/stadiums' },
    { label: 'Stadiums', href: '/stadiums' },
    { label: 'Match Schedule', href: '/matches' },
    { label: 'Tickets', href: '/tickets' },
  ],
  teams: [
    { label: 'All Teams', href: '/teams' },
    { label: 'Players', href: '/players' },
    { label: 'Rankings', href: '/teams' },
    { label: 'Statistics', href: '/live-scores' },
  ],
  fans: [
    { label: 'Fan Zone', href: '/fan-zone' },
    { label: 'Wallpapers', href: '/fan-zone' },
    { label: 'Polls & Quizzes', href: '/fan-zone' },
    { label: 'Social Hub', href: '/fan-zone' },
  ],
  info: [
    { label: 'News', href: '/news' },
    { label: 'History', href: '/history' },
    { label: 'Live Scores', href: '/live-scores' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
  { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-400' },
  { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-400' },
  { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-500' },
];

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/10 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/20 via-transparent to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-2xl font-black text-white">F</span>
              </div>
              <div>
                <span className="text-xl font-black text-white">FIFA<span className="text-cyan-400">2026</span></span>
                <span className="block text-xs text-gray-500 tracking-widest uppercase">World Cup</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              The biggest sporting event on Earth. United by football. United by passion.
            </p>
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 ${social.color} transition-colors`}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-400 text-sm hover:text-cyan-400 transition-colors inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 h-px bg-cyan-400 group-hover:w-3 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm flex items-center gap-1">
              © 2026 FIFA World Cup™. All rights reserved. Made with{' '}
              <Heart size={14} className="text-red-500 fill-red-500" /> and passion for football.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Globe size={14} />
              <span>United 2026™ — USA · Canada · Mexico</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated bottom line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 via-purple-500 to-pink-500"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
    </footer>
  );
}