const express = require('express')

const router = express.Router()

const { authenticate } = require('../middlewares/auth.middleware')

const {
  getCharacters,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  duplicateCharacter,
} = require('../controllers/rpg.controller')

// ============================================
// RPG
// ============================================

// Listar fichas
router.get(
  '/characters',
  authenticate,
  getCharacters
)

// Criar ficha
router.post(
  '/characters',
  authenticate,
  createCharacter
)

// Atualizar ficha
router.put(
  '/characters/:id',
  authenticate,
  updateCharacter
)

// Deletar ficha
router.delete(
  '/characters/:id',
  authenticate,
  deleteCharacter
)

// Duplicar ficha
router.post(
  '/characters/:id/duplicate',
  authenticate,
  duplicateCharacter
)

module.exports = router

