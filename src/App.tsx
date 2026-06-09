import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Components
import { ThemeProvider } from './contexts/ThemeContext';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';

// Pages
import Home from './pages/Home';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import Matches from './pages/Matches';
import Stadiums from './pages/Stadiums';
import Players from './pages/Players';
import PlayerDetail from './pages/PlayerDetail';
import LiveScores from './pages/LiveScores';
import FanZone from './pages/FanZone';
import History from './pages/History';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Standings from './pages/Standings';
import Bracket from './pages/Bracket';
import MatchDetail from './pages/MatchDetail';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Profile from './pages/Profile';

function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-black text-white antialiased selection:bg-cyan-500/30 selection:text-cyan-300">
          <CustomCursor />
          <LoadingScreen />
          
          <Navbar />
          
          <main>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<><ScrollToTop /><PageTransition><Home /></PageTransition></>} />
                <Route path="/teams" element={<><ScrollToTop /><PageTransition><Teams /></PageTransition></>} />
                <Route path="/teams/:slug" element={<><ScrollToTop /><PageTransition><TeamDetail /></PageTransition></>} />
                <Route path="/matches" element={<><ScrollToTop /><PageTransition><Matches /></PageTransition></>} />
                <Route path="/stadiums" element={<><ScrollToTop /><PageTransition><Stadiums /></PageTransition></>} />
                <Route path="/players" element={<><ScrollToTop /><PageTransition><Players /></PageTransition></>} />
                <Route path="/players/:id" element={<><ScrollToTop /><PageTransition><PlayerDetail /></PageTransition></>} />
                <Route path="/live-scores" element={<><ScrollToTop /><PageTransition><LiveScores /></PageTransition></>} />
                <Route path="/fanzone" element={<><ScrollToTop /><PageTransition><FanZone /></PageTransition></>} />
                <Route path="/history" element={<><ScrollToTop /><PageTransition><History /></PageTransition></>} />
                <Route path="/news" element={<><ScrollToTop /><PageTransition><News /></PageTransition></>} />
                <Route path="/news/:slug" element={<><ScrollToTop /><PageTransition><NewsDetail /></PageTransition></>} />
                <Route path="/standings" element={<><ScrollToTop /><PageTransition><Standings /></PageTransition></>} />
                <Route path="/bracket" element={<><ScrollToTop /><PageTransition><Bracket /></PageTransition></>} />
                <Route path="/match/:id" element={<><ScrollToTop /><PageTransition><MatchDetail /></PageTransition></>} />
                <Route path="/login" element={<><ScrollToTop /><PageTransition><Auth /></PageTransition></>} />
                <Route path="/profile" element={<><ScrollToTop /><PageTransition><Profile /></PageTransition></>} />
                <Route path="/about" element={<><ScrollToTop /><PageTransition><About /></PageTransition></>} />
                <Route path="/privacy" element={<><ScrollToTop /><PageTransition><Privacy /></PageTransition></>} />
                <Route path="/contact" element={<><ScrollToTop /><PageTransition><Contact /></PageTransition></>} />
              </Routes>
            </AnimatePresence>
          </main>
          
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
