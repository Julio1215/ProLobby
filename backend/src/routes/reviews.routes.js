const { Router } = require('express');
const router = Router();
// TODO: implementar rotas de reviews
router.get('/', (req, res) => res.json({ module: 'reviews', status: 'em desenvolvimento' }));
module.exports = router;
