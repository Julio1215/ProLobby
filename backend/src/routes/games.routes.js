const { Router } = require('express');
const router = Router();
// TODO: implementar rotas de games
router.get('/', (req, res) => res.json({ module: 'games', status: 'em desenvolvimento' }));
module.exports = router;
