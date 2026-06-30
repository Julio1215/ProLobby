const { Router } = require('express');
const router = Router();
// TODO: implementar rotas de admin
router.get('/', (req, res) => res.json({ module: 'admin', status: 'em desenvolvimento' }));
module.exports = router;
