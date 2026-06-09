import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function Privacy() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Privacy Policy</h1>
            <p className="text-gray-500 text-sm mb-8">Last updated: June 8, 2026</p>
            <div className="space-y-6 text-gray-400 leading-relaxed">
              <section>
                <h2 className="text-white font-bold text-lg mb-2">Information We Collect</h2>
                <p>
                  We may use cookies and similar technologies for analytics and advertising (e.g. Google AdSense).
                  We do not collect personal information unless you voluntarily contact us via the Contact page.
                </p>
              </section>
              <section>
                <h2 className="text-white font-bold text-lg mb-2">Third-Party Services</h2>
                <p>
                  Third-party advertisers may use cookies to serve ads based on your visits. You can opt out of
                  personalized advertising through your browser settings or Google&apos;s Ads Settings.
                </p>
              </section>
              <section>
                <h2 className="text-white font-bold text-lg mb-2">Data Storage</h2>
                <p>
                  Match data is loaded from public JSON datasets. No account registration is required to use this site.
                </p>
              </section>
              <section>
                <h2 className="text-white font-bold text-lg mb-2">Contact</h2>
                <p>
                  Questions about this policy? Visit our <a href="/contact" className="text-cyan-400 hover:underline">Contact page</a>.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
