import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Contact Us</h1>
            <p className="text-gray-400 mb-8">
              Have feedback, corrections, or partnership inquiries? Send us a message.
            </p>

            {submitted ? (
              <div className="text-center py-12 rounded-2xl bg-green-500/10 border border-green-500/30">
                <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
                <p className="text-white font-semibold text-lg">Message received!</p>
                <p className="text-gray-400 mt-2">We&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-500/50 focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-500/50 focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-500/50 focus:outline-none resize-none"
                    placeholder="Your message..."
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white"
                >
                  <Send size={18} /> Send Message
                </motion.button>
              </form>
            )}

            <div className="mt-10 flex items-center gap-3 text-gray-500 text-sm">
              <Mail size={16} />
              <span>Or email: contact@fifa2026fan.com</span>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
