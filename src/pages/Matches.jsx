import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import MatchCard from '../components/MatchCard';
import { getAllMatches } from '../api/football';

const stages = [
  { id: 'all', label: 'All Matches' },
  { id: 'group', label: 'Group Stage' },
  { id: 'round_of_32', label: 'Round of 32' },
  { id: 'round_of_16', label: 'Round of 16' },
  { id: 'quarter_finals', label: 'Quarter Finals' },
  { id: 'semi_finals', label: 'Semi Finals' },
  { id: 'third_place', label: 'Third Place' },
  { id: 'final', label: 'Final' },
];

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStage, setActiveStage] = useState('all');

  useEffect(() => {
    setLoading(true);
    getAllMatches()
      .then((data) => {
        setMatches(
          activeStage === 'all' ? data : data.filter((m) => m.stage === activeStage)
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [activeStage]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">Full Schedule</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mt-3">
              Match <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Schedule</span>
            </h1>
            <p className="text-gray-400 mt-4 text-lg">
              All 104 matches across 16 stadiums. Never miss a moment.
            </p>
          </motion.div>

          {/* Stage Tabs */}
          <div className="mt-8 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              {stages.map(stage => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    activeStage === stage.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Matches List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white/5 h-36" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
              <p className="text-gray-500 text-xl">Failed to load matches: {error}</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-20">
              <Calendar size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-500 text-xl">No matches found for this stage.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match, i) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <MatchCard match={match} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}