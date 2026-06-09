const DATA_BASE = '/data';

let cache = {
  worldcup: null,
  teams: null,
  stadiums: null,
};

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

export async function fetchAPI() {
  if (cache.worldcup && cache.teams && cache.stadiums) return cache;

  const [worldcup, teams, stadiums] = await Promise.all([
    loadJSON(`${DATA_BASE}/worldcup.json`),
    loadJSON(`${DATA_BASE}/worldcup.teams.json`),
    loadJSON(`${DATA_BASE}/worldcup.stadiums.json`),
  ]);

  cache = { worldcup, teams, stadiums };
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
  if (now > end) return 'upcoming';
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
  if (match) return { name: match.name, city: match.city, capacity: match.capacity };
  return { name: ground, city: ground };
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

export async function getMatchById(id) {
  const matches = await getAllMatches();
  const numId = Number(id);
  return matches.find((m) => m.id === numId || m.num === numId) || null;
}

export async function getTeams() {
  const { teams } = await fetchAPI();
  return teams;
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

export async function getStadiums() {
  const { stadiums } = await fetchAPI();
  return stadiums.stadiums || [];
}
