const axios = require('axios');
const NodeCache = require('node-cache');

// Cache de 30 minutos — economiza as cotas das APIs gratuitas
const newsCache = new NodeCache({ stdTTL: 1800 });

const CURRENTS_CATEGORY = {
  GAMING:      'gaming',
  CONSOLE:     'gaming',
  RPG:         'gaming',
  ESPORTS:     'gaming',
  INDUSTRY:    'technology',
  PLAYSTATION: 'gaming',
  XBOX:        'gaming',
  NINTENDO:    'gaming',
  RETRO:       'gaming',
};

// ============================================
// GNews API (100 req/dia grátis)
// ATENÇÃO: espaço = AND no GNews; usar OR explícito entre termos
// ============================================
const fetchFromGNews = async ({ query = 'videogame OR gamer', page = 1 }) => {
  const cacheKey = `gnews_${query}_${page}`;
  const cached = newsCache.get(cacheKey);
  if (cached) return cached;

  const response = await axios.get('https://gnews.io/api/v4/search', {
    params: {
      q: query,
      lang: 'pt',
      max: 10,
      page,
      apikey: process.env.GNEWS_API_KEY,
    },
    timeout: 8000,
  });

  const articles = response.data?.articles?.map(a => ({
    id: a.url,
    title: a.title,
    description: a.description,
    url: a.url,
    imageUrl: a.image,
    source: a.source?.name || 'GNews',
    publishedAt: a.publishedAt,
    category: 'GAMING',
  })) || [];

  newsCache.set(cacheKey, articles);
  return articles;
};

// ============================================
// Currents API (1000 req/dia grátis — fallback)
// ============================================
const fetchFromCurrents = async ({ query = 'videogame', category = 'gaming', page = 1 }) => {
  const cacheKey = `currents_${query}_${category}_${page}`;
  const cached = newsCache.get(cacheKey);
  if (cached) return cached;

  const response = await axios.get('https://api.currentsapi.services/v1/search', {
    params: {
      keywords: query,
      language: 'pt',
      category,
      page_number: page,
      apiKey: process.env.CURRENTS_API_KEY,
    },
    timeout: 8000,
  });

  const articles = response.data?.news?.map(a => ({
    id: a.url,
    title: a.title,
    description: a.description,
    url: a.url,
    imageUrl: a.image,
    source: a.author || 'Currents',
    publishedAt: a.published,
    category: 'GAMING',
  })) || [];

  newsCache.set(cacheKey, articles);
  return articles;
};

// ============================================
// FUNÇÃO PRINCIPAL com fallback automático
// ============================================
const getNews = async ({ query, category = 'GAMING', page = 1 }) => {
  const searchQuery = query || buildQueryForCategory(category);

  try {
    if (process.env.GNEWS_API_KEY) {
      const articles = await fetchFromGNews({ query: searchQuery, page });
      if (articles.length > 0) return { articles, source: 'gnews', total: articles.length };
    }
  } catch (err) {
    console.warn('[News] GNews falhou, tentando Currents...', err.message);
  }

  try {
    if (process.env.CURRENTS_API_KEY) {
      const currentsCategory = CURRENTS_CATEGORY[category] || 'gaming';
      const articles = await fetchFromCurrents({ query: searchQuery, category: currentsCategory, page });
      return { articles, source: 'currents', total: articles.length };
    }
  } catch (err) {
    console.warn('[News] Currents falhou:', err.message);
  }

  return { articles: [], source: null, total: 0, error: 'APIs de notícias indisponíveis' };
};

// Termos em OR — nunca espaço simples (GNews trata espaço como AND)
const buildQueryForCategory = (category) => {
  const queries = {
    GAMING:      'videogame OR "video game" OR gamer OR playstation OR xbox OR nintendo',
    RPG:         '"role-playing" OR pathfinder OR "dungeons and dragons" OR "Final Fantasy" OR "Baldur\'s Gate" OR "Elden Ring" OR "jogo de RPG"',
    ESPORTS:     'esports OR "esportes eletronicos" OR "campeonato de games"',
    INDUSTRY:    '"industria de games" OR estudio OR desenvolvedora OR ubisoft OR "electronic arts"',
    PLAYSTATION: 'playstation OR PS5 OR PS4 OR "sony interactive" OR "exclusivo PlayStation"',
    XBOX:        'xbox OR "xbox series" OR "game pass" OR "xbox game studios" OR microsoft games',
    NINTENDO:    'nintendo OR switch OR "nintendo switch" OR mario OR zelda OR pokemon',
    RETRO:       '"jogo retro" OR retrogaming OR "console classico" OR "jogos antigos" OR snes OR "playstation 2" OR "nintendo 64"',
  };
  return queries[category] || queries.GAMING;
};

const getCacheStats = () => ({
  keys: newsCache.keys().length,
  stats: newsCache.getStats(),
});

module.exports = { getNews, getCacheStats };
