# ⚽ FIFA World Cup 2026 Hub

A comprehensive, modern, and interactive hub for the 2026 FIFA World Cup! Built with React, TypeScript, and Vite.

## ✨ Features

### 🏆 Tournament Content
- **Live Scores & Results**: Real-time updates from all matches
- **Groups & Standings**: Complete group stage tables with automatic qualification logic
- **48 Teams**: Full list of all qualified nations
- **16 Stadiums**: Venue information for all host cities in USA, Canada, and Mexico
- **Knockout Bracket**: Visual representation of the knockout stages
- **20+ News Articles**: Tournament news, match previews, and post-game analysis

### 🎮 Fan Zone
- **Match Predictor**: Predict scores for upcoming matches
- **Leaderboard**: Compete with other fans (coming soon!)
- **Digital Collectibles**: Unlock badges for your predictions (coming soon!)

### 📱 User Experience
- **Fully Responsive**: Perfect on mobile, tablet, and desktop
- **Smooth Animations**: Powered by Framer Motion
- **Lightning Fast**: Built with Vite
- **Global Search**: Instantly search for teams, players, and news
- **User Authentication**: Powered by Supabase
- **Personalization**: Save your favorite team

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/abd-man-1906/fifa-world-cup-2026.git
   cd fifa-world-cup-2026
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   # Optional: for live API data
   VITE_API_FOOTBALL_KEY=your-football-api-key
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🔧 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Routing** | React Router DOM |
| **Authentication** | Supabase |
| **Database** | Supabase (PostgreSQL) |
| **Hosting** | Vercel |

## 📦 Project Structure

```
fifa-world-cup-2026/
├── public/
│   ├── data/           # Static tournament data (JSON)
│   ├── ads.txt        # Google AdSense verification
│   └── robots.txt     # SEO configuration
├── src/
│   ├── api/           # API layer (football.js)
│   ├── components/    # Reusable UI components
│   ├── lib/           # Utilities & Supabase client
│   ├── pages/         # Page components
│   └── App.tsx        # Main app & routing
├── index.html
└── package.json
```

## 🌐 Deployment

This project is configured for **Vercel deployment**:
- Push to GitHub and Vercel will automatically deploy your changes!
- Don't forget to set your **environment variables** in Vercel Project Settings!

## 📊 Data Sources

The hub currently uses static data files in `/public/data/`. To switch to live real-time data, add your API key to `.env`.

## 🛡️ Security

- All user data is stored securely via Supabase Auth
- Row Level Security (RLS) enabled on all database tables
- No passwords stored in plain text!

## 📄 License

MIT License. Feel free to use this project for your own World Cup excitement!

## 🤝 Contributing

PRs welcome! Let's make this the best World Cup hub on the internet! 🌍

---
Built with ❤️ for football fans everywhere! ⚽🏆
