const express = require('express')

const router = express.Router()

const { authenticate } = require('../middlewares/auth.middleware')

const {
  getProfile,
  updateProfile,
} = require('../controllers/user.controller')

// ============================================
// USER
// ============================================

// Perfil do usuário logado
router.get(
  '/me',
  authenticate,
  getProfile
)

// Atualizar perfil
router.patch(
  '/me',
  authenticate,
  updateProfile
)

module.exports = router

