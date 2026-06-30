const express = require('express')

const router = express.Router()

const {
  searchGame,
  getRanking,
} = require('../controllers/qcd.controller')

// ============================================
// QCD
// ============================================

// Buscar jogo
router.get(
  '/search',
  searchGame
)

// Ranking
router.get(
  '/ranking',
  getRanking
)

module.exports = router

