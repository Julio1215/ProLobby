const express = require('express')

const router = express.Router()

const {
  register,
  login,
  getMe,
} = require('../controllers/auth.controller')

const { authenticate } = require('../middlewares/auth.middleware')

// ============================================
// AUTH
// ============================================

// Registro
router.post(
  '/register',
  register
)

// Login
router.post(
  '/login',
  login
)

// Usuário autenticado
router.get(
  '/me',
  authenticate,
  getMe
)

module.exports = router




