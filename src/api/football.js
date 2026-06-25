const DATA_BASE = '/data';

let cache = {
  worldcup: null,
  teams: null,
  stadiums: null,
  news: null,
};

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

export async function fetchAPI() {
  if (cache.worldcup && cache.teams && cache.stadiums && cache.news) return cache;

  const [worldcup, teams, stadiums, news] = await Promise.all([
    loadJSON(`${DATA_BASE}/worldcup.json`),
    loadJSON(`${DATA_BASE}/worldcup.teams.json`),
    loadJSON(`${DATA_BASE}/worldcup.stadiums.json`),
    loadJSON(`${DATA_BASE}/news.json`).catch(() => []), // Fallback to empty if news.json missing
  ]);

  cache = { worldcup, teams, stadiums, news };
  return cache;
}

function buildTeamLookup(teams) {
  const map = new Map();
  for (const team of teams) {
    map.set(team.name, team);
    if (team.name_normalised) map.set(team.name_normalised, team);
  }
  return map;
}

function getTeamInfo(name, teamLookup) {
  if (!name) return { name: 'TBD', flag: '🏳️', code: 'TBD' };
  const team = teamLookup.get(name);
  if (team) {
    return {
      name: team.name,
      flag: team.flag_icon || '🏳️',
      code: team.fifa_code || name.slice(0, 3).toUpperCase(),
      group: team.group,
      confed: team.confed,
    };
  }
  return { name, flag: '🏳️', code: name.slice(0, 3).toUpperCase() };
}

function parseMatchDateTime(date, time) {
  if (!date) return new Date().toISOString();
  const timePart = (time || '12:00').split(' ')[0];
  const [hours, minutes] = timePart.split(':').map(Number);
  const utcOffset = (time || '').match(/UTC([+-]?\d+)/);
  const offsetHours = utcOffset ? Number(utcOffset[1]) : 0;
  const utcHours = (hours || 12) - offsetHours;
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCHours(utcHours, minutes || 0, 0, 0);
  return d.toISOString();
}

function mapStage(round) {
  if (!round) return 'group';
  const r = round.toLowerCase();
  if (r.includes('matchday')) return 'group';
  if (r.includes('round of 32')) return 'round_of_32';
  if (r.includes('round of 16')) return 'round_of_16';
  if (r.includes('quarter')) return 'quarter_finals';
  if (r.includes('semi')) return 'semi_finals';
  if (r.includes('third')) return 'third_place';
  if (r === 'final') return 'final';
  return 'group';
}

function getMatchStatus(matchDate, score) {
  if (score?.ft) return 'completed';
  const now = new Date();
  const start = new Date(matchDate);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  if (now >= start && now <= end) return 'live';
  if (now > end) return 'completed';
  return 'upcoming';
}

function findStadium(ground, stadiums) {
  if (!ground) return { name: 'Stadium TBD', city: '' };
  const list = stadiums?.stadiums || [];
  const match = list.find(
    (s) =>
      s.city === ground ||
      ground.includes(s.city) ||
      s.city.includes(ground.split('(')[0].trim())
  );
  if (match) return normalizeStadium(match);
  return { name: ground, city: ground };
}

function normalizeStadium(s) {
  const countryMap = {
    us: 'USA',
    mx: 'Mexico',
    ca: 'Canada',
  };

  return {
    ...s,
    id: s.id || s.name.toLowerCase().replace(/\s+/g, '-'),
    country: s.country || countryMap[s.cc?.toLowerCase()] || 'TBD',
    opened: s.opened || 'N/A',
    capacity: s.capacity || 0,
  };
}

export function normalizeMatch(raw, index, teamLookup, stadiums) {
  const matchDate = parseMatchDateTime(raw.date, raw.time);
  const home = getTeamInfo(raw.team1, teamLookup);
  const away = getTeamInfo(raw.team2, teamLookup);
  const stadium = findStadium(raw.ground, stadiums);
  const status = getMatchStatus(matchDate, raw.score);

  return {
    id: raw.num ?? index + 1,
    num: raw.num,
    home_team: home,
    away_team: away,
    stadium,
    match_date: matchDate,
    stage: mapStage(raw.round),
    round: raw.round,
    group: raw.group || null,
    status,
    home_score: raw.score?.ft?.[0] ?? null,
    away_score: raw.score?.ft?.[1] ?? null,
    ht_home: raw.score?.ht?.[0] ?? null,
    ht_away: raw.score?.ht?.[1] ?? null,
    goals1: raw.goals1 || [],
    goals2: raw.goals2 || [],
    time: raw.time,
    date: raw.date,
  };
}

export async function getAllMatches() {
  const { worldcup, teams, stadiums } = await fetchAPI();
  const teamLookup = buildTeamLookup(teams);
  return worldcup.matches.map((m, i) => normalizeMatch(m, i, teamLookup, stadiums));
}

export async function getLiveMatches() {
  const matches = await getAllMatches();
  const today = new Date().toDateString();
  const todayMatches = matches.filter(
    (m) => new Date(m.match_date).toDateString() === today || m.status === 'live'
  );
  if (todayMatches.length > 0) return todayMatches;
  const now = Date.now();
  return matches
    .filter((m) => new Date(m.match_date).getTime() >= now - 3 * 60 * 60 * 1000)
    .slice(0, 6);
}

function mapApiFootballStats(statsArray) {
  if (!statsArray || statsArray.length !== 2) return null;
  const home = statsArray[0].statistics;
  const away = statsArray[1].statistics;
  const getStat = (arr, type) => {
    const s = arr.find((x) => x.type === type);
    if (!s || s.value === null) return 0;
    if (typeof s.value === 'string' && s.value.includes('%')) return parseInt(s.value);
    return s.value;
  };
  return {
    possession_home: getStat(home, 'Ball Possession'),
    possession_away: getStat(away, 'Ball Possession'),
    shots_home: getStat(home, 'Total Shots'),
    shots_away: getStat(away, 'Total Shots'),
    sot_home: getStat(home, 'Shots on Goal'),
    sot_away: getStat(away, 'Shots on Goal'),
    corners_home: getStat(home, 'Corner Kicks'),
    corners_away: getStat(away, 'Corner Kicks'),
  };
}

function mapApiFootballMatch(apiMatch) {
  return {
    id: apiMatch.fixture.id,
    num: apiMatch.fixture.id,
    home_team: { name: apiMatch.teams.home.name, flag: '⚽', logo: apiMatch.teams.home.logo },
    away_team: { name: apiMatch.teams.away.name, flag: '⚽', logo: apiMatch.teams.away.logo },
    stadium: { name: apiMatch.fixture.venue.name || 'Stadium', city: apiMatch.fixture.venue.city || '' },
    match_date: apiMatch.fixture.date,
    stage: apiMatch.league.round || 'group',
    round: apiMatch.league.round,
    status: apiMatch.fixture.status.short === 'FT' ? 'completed' : ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(apiMatch.fixture.status.short) ? 'live' : 'upcoming',
    minute: apiMatch.fixture.status.elapsed,
    home_score: apiMatch.goals.home,
    away_score: apiMatch.goals.away,
    events: apiMatch.events || [],
    stats: mapApiFootballStats(apiMatch.statistics) || null,
    goals1: (apiMatch.events || []).filter(e => e.type === 'Goal' && e.team.id === apiMatch.teams.home.id).map(e => ({ min: e.time.elapsed, scorer: e.player.name })),
    goals2: (apiMatch.events || []).filter(e => e.type === 'Goal' && e.team.id === apiMatch.teams.away.id).map(e => ({ min: e.time.elapsed, scorer: e.player.name }))
  };
}

export async function getLiveScores() {
  const apiKey = import.meta.env.VITE_API_FOOTBALL_KEY;
  
  if (apiKey) {
    try {
      const res = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
        headers: {
          'x-apisports-key': apiKey,
          'x-rapidapi-key': apiKey
        }
      });
      const data = await res.json();
      if (data.response && data.response.length > 0) {
        return data.response.map(mapApiFootballMatch);
      }
    } catch (e) {
      console.warn('Live API fetch failed, falling back to static data', e);
    }
  }

  // Return all matches with their static status
  const matches = await getAllMatches();
  return matches;
}

export async function getMatchById(id) {
  const numId = Number(id);
  const apiKey = import.meta.env.VITE_API_FOOTBALL_KEY;
  
  if (apiKey && numId > 1000) { // API-Football IDs are usually very large, static are 1-104
    try {
      const res = await fetch(`https://v3.football.api-sports.io/fixtures?id=${id}`, {
        headers: {
          'x-apisports-key': apiKey,
          'x-rapidapi-key': apiKey
        }
      });
      const data = await res.json();
      if (data.response && data.response.length > 0) {
        return mapApiFootballMatch(data.response[0]);
      }
    } catch (e) {
      console.warn('API Match fetch failed', e);
    }
  }

  const matches = await getAllMatches();
  return matches.find((m) => m.id === numId || m.num === numId) || null;
}

export async function getTeams() {
  const { teams } = await fetchAPI();
  return teams;
}

export async function getTeamBySlug(slug) {
  const { teams } = await fetchAPI();
  return teams.find(t => t.name.toLowerCase().replace(/\s+/g, '-') === slug) || null;
}

export async function getTeamMatches(teamName) {
  const matches = await getAllMatches();
  return matches.filter(m => m.home_team.name === teamName || m.away_team.name === teamName);
}

export async function getStadiums() {
  try {
    const { stadiums } = await fetchAPI();
    const list = stadiums.stadiums || [];
    return list.map(normalizeStadium);
  } catch (error) {
    console.error('[Football API] Failed to fetch stadiums:', error);
    throw error;
  }
}

export async function getNews() {
  const { news } = await fetchAPI();
  return news;
}

export async function getNewsBySlug(slug) {
  const { news } = await fetchAPI();
  return news.find(n => n.slug === slug) || null;
}

export async function getPlayers() {
  const { teams } = await fetchAPI();
  const players = [
    {
      id: 1,
      name: 'Lionel Messi',
      position: 'Forward',
      rating: 94,
      number: 10,
      is_featured: true,
      pace: 89,
      shooting: 92,
      passing: 94,
      defense: 40,
      goals: 838,
      assists: 374,
      trophies: 46,
      team: teams.find(t => t.name === 'Argentina') || { name: 'Argentina', flag: '🇦🇷' }
    },
    {
      id: 2,
      name: 'Kylian Mbappé',
      position: 'Forward',
      rating: 92,
      number: 7,
      is_featured: true,
      pace: 97,
      shooting: 89,
      passing: 80,
      defense: 38,
      goals: 330,
      assists: 130,
      trophies: 17,
      team: teams.find(t => t.name === 'France') || { name: 'France', flag: '🇫🇷' }
    },
    {
      id: 3,
      name: 'Erling Haaland',
      position: 'Forward',
      rating: 91,
      number: 9,
      is_featured: true,
      pace: 89,
      shooting: 93,
      passing: 66,
      defense: 45,
      goals: 250,
      assists: 50,
      trophies: 10,
      team: teams.find(t => t.name === 'Norway') || { name: 'Norway', flag: '🇳🇴' }
    },
    {
      id: 4,
      name: 'Kevin De Bruyne',
      position: 'Midfielder',
      rating: 91,
      number: 17,
      is_featured: true,
      pace: 74,
      shooting: 86,
      passing: 95,
      defense: 63,
      goals: 150,
      assists: 280,
      trophies: 20,
      team: teams.find(t => t.name === 'Belgium') || { name: 'Belgium', flag: '🇧🇪' }
    },
    {
      id: 5,
      name: 'Jude Bellingham',
      position: 'Midfielder',
      rating: 88,
      number: 5,
      is_featured: true,
      pace: 82,
      shooting: 78,
      passing: 85,
      defense: 78,
      goals: 79,
      assists: 40,
      trophies: 6,
      team: teams.find(t => t.name === 'England') || { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }
    },
    {
      id: 6,
      name: 'Vinícius Júnior',
      position: 'Forward',
      rating: 89,
      number: 7,
      is_featured: true,
      pace: 95,
      shooting: 82,
      passing: 78,
      defense: 34,
      goals: 80,
      assists: 70,
      trophies: 12,
      team: teams.find(t => t.name === 'Brazil') || { name: 'Brazil', flag: '🇧🇷' }
    },
    {
      id: 7,
      name: 'Cristiano Ronaldo',
      position: 'Forward',
      rating: 93,
      number: 7,
      is_featured: true,
      pace: 87,
      shooting: 94,
      passing: 82,
      defense: 35,
      goals: 895,
      assists: 250,
      trophies: 35,
      team: teams.find(t => t.name === 'Portugal') || { name: 'Portugal', flag: '🇵🇹' }
    },
    {
      id: 8,
      name: 'Pelé',
      position: 'Forward',
      rating: 98,
      number: 10,
      is_featured: true,
      pace: 93,
      shooting: 96,
      passing: 90,
      defense: 45,
      goals: 1279,
      assists: 300,
      trophies: 25,
      team: teams.find(t => t.name === 'Brazil') || { name: 'Brazil', flag: '🇧🇷' }
    },
    {
      id: 9,
      name: 'Diego Maradona',
      position: 'Midfielder',
      rating: 97,
      number: 10,
      is_featured: true,
      pace: 88,
      shooting: 91,
      passing: 95,
      defense: 42,
      goals: 345,
      assists: 200,
      trophies: 12,
      team: teams.find(t => t.name === 'Argentina') || { name: 'Argentina', flag: '🇦🇷' }
    },
    {
      id: 10,
      name: 'Zinedine Zidane',
      position: 'Midfielder',
      rating: 96,
      number: 10,
      is_featured: true,
      pace: 75,
      shooting: 85,
      passing: 96,
      defense: 60,
      goals: 156,
      assists: 130,
      trophies: 15,
      team: teams.find(t => t.name === 'France') || { name: 'France', flag: '🇫🇷' }
    },
    {
      id: 11,
      name: 'Ronaldinho',
      position: 'Midfielder',
      rating: 94,
      number: 10,
      is_featured: true,
      pace: 92,
      shooting: 87,
      passing: 92,
      defense: 38,
      goals: 299,
      assists: 160,
      trophies: 13,
      team: teams.find(t => t.name === 'Brazil') || { name: 'Brazil', flag: '🇧🇷' }
    }
  ];
  return players;
}

export async function getPlayerById(id) {
  const players = await getPlayers();
  return players.find(p => p.id === parseInt(id)) || null;
}

export async function getStandings() {
  const { teams } = await fetchAPI();
  const matches = await getAllMatches();
  const groupMatches = matches.filter((m) => m.stage === 'group');

  const groups = {};
  for (const team of teams) {
    const key = `Group ${team.group}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push({
      name: team.name,
      flag: team.flag_icon || '🏳️',
      code: team.fifa_code,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0,
    });
  }

  for (const match of groupMatches) {
    if (match.status !== 'completed' || match.home_score == null) continue;
    const groupKey = match.group;
    if (!groupKey || !groups[groupKey]) continue;

    const updateTeam = (name, gf, ga, result) => {
      const row = groups[groupKey].find((t) => t.name === name);
      if (!row) return;
      row.played += 1;
      row.gf += gf;
      row.ga += ga;
      row.gd = row.gf - row.ga;
      if (result === 'win') {
        row.won += 1;
        row.points += 3;
      } else if (result === 'draw') {
        row.drawn += 1;
        row.points += 1;
      } else {
        row.lost += 1;
      }
    };

    const hs = match.home_score;
    const as = match.away_score;
    if (hs > as) {
      updateTeam(match.home_team.name, hs, as, 'win');
      updateTeam(match.away_team.name, as, hs, 'loss');
    } else if (hs < as) {
      updateTeam(match.home_team.name, hs, as, 'loss');
      updateTeam(match.away_team.name, as, hs, 'win');
    } else {
      updateTeam(match.home_team.name, hs, as, 'draw');
      updateTeam(match.away_team.name, as, hs, 'draw');
    }
  }

  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
  }

  return groups;
}

const KNOCKOUT_STAGES = [
  'round_of_32',
  'round_of_16',
  'quarter_finals',
  'semi_finals',
  'third_place',
  'final',
];

const KNOCKOUT_LABELS = {
  round_of_32: 'Round of 32',
  round_of_16: 'Round of 16',
  quarter_finals: 'Quarter-finals',
  semi_finals: 'Semi-finals',
  third_place: 'Third Place',
  final: 'Final',
};

export async function getBracketMatches() {
  const matches = await getAllMatches();
  const bracket = {};
  for (const stage of KNOCKOUT_STAGES) {
    bracket[stage] = {
      label: KNOCKOUT_LABELS[stage],
      matches: matches.filter((m) => m.stage === stage),
    };
  }
  return bracket;
}

export async function searchGlobal(query) {
  if (!query || query.length < 2) return { teams: [], players: [], news: [] };
  
  const q = query.toLowerCase();
  const [teams, players, news] = await Promise.all([
    getTeams(),
    getPlayers(),
    getNews()
  ]);

  return {
    teams: teams.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.fifa_code.toLowerCase().includes(q)
    ).slice(0, 5),
    players: players.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.position.toLowerCase().includes(q)
    ).slice(0, 5),
    news: news.filter(n => 
      n.title.toLowerCase().includes(q) || 
      n.excerpt.toLowerCase().includes(q)
    ).slice(0, 5)
  };
}

