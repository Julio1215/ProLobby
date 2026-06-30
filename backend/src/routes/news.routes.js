const { Router } = require('express');
const { getNews } = require('../services/news.service');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { category = 'GAMING', q, page = 1 } = req.query;
    const result = await getNews({ query: q, category, page: parseInt(page) });
    res.json(result);
  } catch (err) {
    console.error('[News]', err.message);
    res.status(500).json({ error: 'Erro ao buscar notícias' });
  }
});

module.exports = router;