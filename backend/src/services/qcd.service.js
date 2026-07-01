const axios = require('axios');
const NodeCache = require('node-cache');
const prisma = require('../config/database');

const priceCache = new NodeCache({ stdTTL: 7200 });
const gameplayCache = new NodeCache({ stdTTL: 86400 });

// ============================================
// IGDB Token (renova automaticamente)
// ============================================
let igdbToken = null;
let igdbTokenExpiry = null;

const getIgdbToken = async () => {
  if (igdbToken && igdbTokenExpiry && Date.now() < igdbTokenExpiry) return igdbToken;

  const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: process.env.IGDB_CLIENT_ID,
      client_secret: process.env.IGDB_CLIENT_SECRET,
      grant_type: 'client_credentials',
    },
    timeout: 5000,
  });

  igdbToken = response.data.access_token;
  igdbTokenExpiry = Date.now() + (response.data.expires_in - 3600) * 1000;
  console.log('[IGDB] Token renovado');
  return igdbToken;
};

// ============================================
// ALGORITMO QCD
// QCD = (Nota [0-10] x Horas) / Preco (USD)
// ============================================
const calcQcdScore = (avgScore, hoursMain, priceUsd) => {
  if (!priceUsd || priceUsd <= 0) return null;
  if (!hoursMain || hoursMain <= 0) return null;
  if (!avgScore || avgScore <= 0) return null;
  const score = (avgScore * hoursMain) / priceUsd;
  return Math.round(score * 100) / 100;
};

const getQcdCategory = (score) => {
  if (score === null || score === undefined) return null;
  if (score >= 10) return 'EXCELLENT';
  if (score >= 6) return 'GOOD';
  if (score >= 3) return 'REASONABLE';
  return 'NOT_WORTH';
};

const getQcdLabel = (category) => {
  const labels = {
    EXCELLENT: 'Excelente Compra',
    GOOD: 'Boa Compra',
    REASONABLE: 'Compra Razoavel',
    NOT_WORTH: 'Nao Vale a Pena',
  };
  return labels[category] || 'Sem dados suficientes';
};

// ============================================
// IGDB - Busca nota + horas estimadas
// ============================================
const getGameData = async (gameTitle) => {
  const cacheKey = `igdb_${gameTitle.toLowerCase()}`;
  const cached = gameplayCache.get(cacheKey);
  if (cached !== undefined) return cached;

  try {
    const token = await getIgdbToken();

    // Busca dados do jogo incluindo game_modes e heuristics de tempo
    const response = await axios.post(
      'https://api.igdb.com/v4/games',
      `search "${gameTitle}";
       fields name,slug,cover.url,first_release_date,
              total_rating,total_rating_count,
              aggregated_rating,aggregated_rating_count,
              platforms.name,genres.name,
              game_modes.name,
              multiplayer_modes.onlinecoop,
              involved_companies.developer,
              involved_companies.company.name;
       where total_rating_count > 10;
       limit 5;`,
      {
        headers: {
          'Client-ID': process.env.IGDB_CLIENT_ID,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
        timeout: 8000,
      }
    );

    const games = response.data;
    if (!games || !games.length) return null;

    const game = games[0];
    const coverUrl = game.cover && game.cover.url
      ? 'https:' + game.cover.url.replace('t_thumb', 't_cover_big')
      : null;

    const result = {
      igdbId: game.id,
      title: game.name,
      slug: game.slug,
      coverUrl,
      releaseDate: game.first_release_date
        ? new Date(game.first_release_date * 1000).toISOString()
        : null,
      rating: game.total_rating ? game.total_rating / 10 : null,
      criticScore: game.aggregated_rating ? Math.round(game.aggregated_rating) : null,
      platforms: game.platforms ? game.platforms.map(p => p.name) : [],
      genres: game.genres ? game.genres.map(g => g.name) : [],
    };

    gameplayCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.warn('[QCD] IGDB falhou:', err.message);
    return null;
  }
};

// ============================================
// Horas estimadas por genero (fallback quando
// HLTB nao esta disponivel)
// Baseado em medias reais do HowLongToBeat
// ============================================
const estimateHoursByGenre = (genres, platforms) => {
  if (!genres || !genres.length) return { hoursMain: 12, source: 'estimate-generic' };

  const g = genres.map(x => x.toLowerCase()).join(' ');

  if (g.includes('role-playing') || g.includes('rpg')) return { hoursMain: 50, source: 'estimate-rpg' };
  if (g.includes('strategy')) return { hoursMain: 40, source: 'estimate-strategy' };
  if (g.includes('adventure') && g.includes('platform')) return { hoursMain: 20, source: 'estimate-platformadv' };
  if (g.includes('adventure')) return { hoursMain: 15, source: 'estimate-adventure' };
  if (g.includes('platform')) return { hoursMain: 10, source: 'estimate-platform' };
  if (g.includes('shooter')) return { hoursMain: 10, source: 'estimate-shooter' };
  if (g.includes('fighting')) return { hoursMain: 8, source: 'estimate-fighting' };
  if (g.includes('sport') || g.includes('racing')) return { hoursMain: 20, source: 'estimate-sports' };
  if (g.includes('simulation')) return { hoursMain: 30, source: 'estimate-simulation' };
  if (g.includes('puzzle')) return { hoursMain: 8, source: 'estimate-puzzle' };
  if (g.includes('indie')) return { hoursMain: 12, source: 'estimate-indie' };

  return { hoursMain: 12, source: 'estimate-generic' };
};

// ============================================
// CheapShark - Preco atual (gratuito, sem chave)
// ============================================
const getGamePrice = async (gameTitle) => {
  const cacheKey = `price_${gameTitle.toLowerCase()}`;
  const cached = priceCache.get(cacheKey);
  if (cached !== undefined) return cached;

  try {
    const response = await axios.get('https://www.cheapshark.com/api/1.0/games', {
      params: { title: gameTitle, limit: 5 },
      timeout: 5000,
    });

    if (!response.data || !response.data.length) return null;

    const game = response.data[0];
    const result = {
      priceUsd: parseFloat(game.cheapest),
      gameId: game.gameID,
      title: game.external,
      storeUrl: `https://www.cheapshark.com/redirect?dealID=${game.cheapestDealID}`,
    };

    priceCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.warn('[QCD] CheapShark falhou:', err.message);
    return null;
  }
};

// ============================================
// FUNCAO PRINCIPAL: Calcular QCD completo
// ============================================
const calculateQcd = async (gameTitle) => {
  const [priceData, gameData] = await Promise.allSettled([
    getGamePrice(gameTitle),
    getGameData(gameTitle),
  ]);

  const price = priceData.status === 'fulfilled' ? priceData.value : null;
  const rating = gameData.status === 'fulfilled' ? gameData.value : null;

  // Nota: prioriza critica (0-100 dividido por 10), fallback nota geral
  const avgScore = rating && rating.criticScore
    ? rating.criticScore / 10
    : (rating && rating.rating) ? rating.rating : null;

  // Horas: estimativa por genero (HLTB bloqueou acesso programatico)
  const hoursEstimate = rating ? estimateHoursByGenre(rating.genres, rating.platforms) : null;
  const hoursMain = hoursEstimate ? hoursEstimate.hoursMain : null;
  const hoursSource = hoursEstimate ? hoursEstimate.source : null;

  const qcdScore = calcQcdScore(avgScore, hoursMain, price && price.priceUsd);
  const qcdCategory = getQcdCategory(qcdScore);

  const result = {
    title: (rating && rating.title) || gameTitle,
    slug: (rating && rating.slug) || null,
    coverUrl: (rating && rating.coverUrl) || null,
    releaseDate: (rating && rating.releaseDate) || null,
    platforms: (rating && rating.platforms) || [],
    genres: (rating && rating.genres) || [],

    igdbRating: rating && rating.rating ? Math.round(rating.rating * 10) / 10 : null,
    criticScore: (rating && rating.criticScore) || null,
    avgScore: avgScore ? Math.round(avgScore * 10) / 10 : null,

    // Horas com indicacao de que e estimativa
    hoursMain,
    hoursExtra: hoursMain ? Math.round(hoursMain * 1.8) : null,
    hoursComplete: hoursMain ? Math.round(hoursMain * 2.5) : null,
    hoursSource,   // 'estimate-rpg', 'estimate-indie', etc.
    hoursNote: hoursSource && hoursSource.startsWith('estimate')
      ? 'Tempo estimado por genero (HowLongToBeat indisponivel)'
      : null,

    priceUsd: (price && price.priceUsd) || null,
    priceBrl: (price && price.priceUsd) ? Math.round(price.priceUsd * 5.1 * 100) / 100 : null,
    storeUrl: (price && price.storeUrl) || null,

    qcdScore,
    qcdCategory,
    qcdLabel: getQcdLabel(qcdCategory),

    hasAllData: !!(avgScore && hoursMain && price && price.priceUsd),
    missingData: [
      !avgScore && 'nota',
      !hoursMain && 'horas de gameplay',
      !(price && price.priceUsd) && 'preco',
    ].filter(Boolean),
  };

  // Salva no banco se tiver dados completos
  if (result.hasAllData && rating && rating.igdbId) {
    try {
      await prisma.qcdGame.upsert({
        where: { slug: result.slug || String(rating.igdbId) },
        create: {
          igdbId: rating.igdbId,
          title: result.title,
          slug: result.slug || String(rating.igdbId),
          coverUrl: result.coverUrl,
          releaseDate: result.releaseDate ? new Date(result.releaseDate) : null,
          platforms: result.platforms,
          genres: result.genres,
          metacriticScore: result.criticScore,
          rawgRating: result.igdbRating,
          hoursMain: result.hoursMain,
          hoursExtra: result.hoursExtra,
          hoursComplete: result.hoursComplete,
          priceUsd: result.priceUsd,
          qcdScore: result.qcdScore,
          qcdCategory: result.qcdCategory,
          lastPriceCheck: new Date(),
        },
        update: {
          priceUsd: result.priceUsd,
          qcdScore: result.qcdScore,
          qcdCategory: result.qcdCategory,
          lastPriceCheck: new Date(),
        },
      });
    } catch (e) {
      console.warn('[QCD] Erro ao salvar no banco:', e.message);
    }
  }

  return result;
};

// Ranking dos melhores QCDs salvos no banco
// Ranking dos melhores QCDs salvos no banco
const getQcdRanking = async (limit) => {
  try {
    const rankingLimit = limit || 20;

    // Busca os jogos com maior qcdScore que possuem dados válidos
    const ranking = await prisma.qcdGame.findMany({
      where: {
        qcdScore: {
          not: null,
        },
      },
      orderBy: {
        qcdScore: 'desc', // Traz os maiores scores primeiro
      },
      take: rankingLimit,
    });

    return ranking;
  } catch (err) {
    console.error('[QCD] Erro ao buscar ranking:', err.message);
    throw err;
  }
};

module.exports = { calculateQcd, getQcdRanking, getQcdLabel, getQcdCategory };