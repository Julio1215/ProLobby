const { calculateQcd, getQcdRanking } = require('../services/qcd.service')

// ============================================
// SEARCH GAME — usa o service real (IGDB + CheapShark)
// ============================================
const searchGame = async (req, res) => {
  const { title } = req.query

  if (!title) {
    return res.status(400).json({ error: 'Título é obrigatório' })
  }

  const data = await calculateQcd(title)
  return res.json(data)
}

// ============================================
// RANKING — busca do banco de dados
// ============================================
const getRanking = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const ranking = await getQcdRanking(limit)
  return res.json({ ranking })
}

module.exports = { searchGame, getRanking }
