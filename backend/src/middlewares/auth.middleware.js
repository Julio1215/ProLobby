const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// ============================================
// AUTHENTICATE
// ============================================

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token de autenticação ausente',
      })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        error: 'Token inválido',
      })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Sessão expirada. Faça login novamente.',
          code: 'TOKEN_EXPIRED',
        })
      }
      return res.status(401).json({
        error: 'Token inválido',
        code: 'TOKEN_INVALID',
      })
    }

    // Verify user still exists in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        role: true,
        email: true,
        username: true,
      },
    })

    if (!user) {
      return res.status(401).json({
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND',
      })
    }

    req.user = user
    next()
  } catch (err) {
    console.error('Auth middleware error:', err)
    return res.status(500).json({
      error: 'Erro de autenticação',
    })
  }
}

// ============================================
// OPTIONAL AUTH (doesn't block, just attaches user if token present)
// ============================================

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) return next()

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, username: true },
    })

    if (user) req.user = user
  } catch (_) {
    // Silent - optional auth never blocks
  }
  next()
}

// ============================================
// REQUIRE ADMIN
// ============================================

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Acesso negado. Requer privilégios de administrador.',
    })
  }
  next()
}

module.exports = {
  authenticate,
  optionalAuth,
  requireAdmin,
}
