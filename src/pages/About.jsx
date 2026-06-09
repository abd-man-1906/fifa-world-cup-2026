import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function About() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
              About <span className="text-cyan-400">FIFA 2026</span>
            </h1>
            <div className="prose prose-invert max-w-none space-y-4 text-gray-400 leading-relaxed">
              <p>
                Welcome to FIFA World Cup 2026™ — your hub for live scores, match schedules, group standings,
                knockout brackets, and everything you need to follow the biggest tournament on Earth.
              </p>
              <p>
                Hosted across the United States, Canada, and Mexico, the 2026 World Cup features 48 nations,
                104 matches, and 16 world-class stadiums — the largest edition in history.
              </p>
              <p>
                Match data is sourced from the open{' '}
                <a
                  href="https://github.com/openfootball/worldcup.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  openfootball/worldcup.json
                </a>{' '}
                dataset (CC0 public domain). Scores and standings update as results become available.
              </p>
              <p>
                This site is an independent fan project and is not affiliated with FIFA or any official
                World Cup organizer.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
