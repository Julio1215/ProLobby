require('dotenv').config()
require('express-async-errors')

const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const swaggerUi = require('swagger-ui-express')

const { swaggerSpec } = require('./config/swagger')

const { errorHandler } = require('./middlewares/errorHandler')
const { notFound } = require('./middlewares/notFound')

// ============================================
// ROTAS
// ============================================

const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const newsRoutes = require('./routes/news.routes')
const gamesRoutes = require('./routes/games.routes')
const qcdRoutes = require('./routes/qcd.routes')
const reviewsRoutes = require('./routes/reviews.routes')
const rpgRoutes = require('./routes/rpg.routes')
const adminRoutes = require('./routes/admin.routes')
const communityRoutes = require('./routes/community.routes')

const app = express()

const PORT = process.env.PORT || 3001

// ============================================
// TRUST PROXY
// ============================================

app.set('trust proxy', 1)

// ============================================
// HELMET
// ============================================

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
)

// ============================================
// CORS
// ============================================

app.use(
  cors({
    origin: (origin, callback) => {

      // Permitir requests sem origin
      // Postman / mobile / SSR
      if (!origin) {
        return callback(null, true)
      }

      const allowedOrigins = [
        process.env.FRONTEND_URL,

        'http://localhost:5173',
        'http://127.0.0.1:5173',

        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ]

      // localhost
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      // GitHub Codespaces
      if (/\.app\.github\.dev$/.test(origin)) {
        return callback(null, true)
      }

      // Railway
      if (/\.up\.railway\.app$/.test(origin)) {
        return callback(null, true)
      }

      // Vercel
      if (/\.vercel\.app$/.test(origin)) {
        return callback(null, true)
      }

      console.log('❌ CORS bloqueado:', origin)

      return callback(
        new Error('Bloqueado pelo CORS')
      )
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
)

// Preflight
app.options('*', cors())

// ============================================
// RATE LIMIT
// ============================================

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    error:
      'Muitas requisições. Tente novamente em 15 minutos.',
  },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 10,

  message: {
    error:
      'Muitas tentativas de login. Aguarde 15 minutos.',
  },
})

app.use(globalLimiter)

// ============================================
// BODY PARSER
// ============================================

app.use(
  express.json({
    limit: '10mb',
  })
)

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
)

// ============================================
// STATIC FILES
// ============================================

app.use(
  '/uploads',
  express.static('uploads')
)

// ============================================
// SWAGGER
// ============================================

app.use(
  '/api/docs',

  swaggerUi.serve,

  swaggerUi.setup(swaggerSpec, {
    customCss:
      '.swagger-ui .topbar { background-color: #1a1a2e; }',

    customSiteTitle:
      'HUB GAMER API',
  })
)

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',

    timestamp:
      new Date().toISOString(),

    env: process.env.NODE_ENV,
  })
})

// ============================================
// API ROUTES
// ============================================

app.use(
  '/api/auth',
  authLimiter,
  authRoutes
)

app.use('/api/users', userRoutes)

app.use('/api/news', newsRoutes)

app.use('/api/games', gamesRoutes)

app.use('/api/qcd', qcdRoutes)

app.use('/api/reviews', reviewsRoutes)

app.use('/api/rpg', rpgRoutes)

app.use('/api/admin', adminRoutes)

app.use(
  '/api/community',
  communityRoutes
)

// ============================================
// 404
// ============================================

app.use(notFound)

// ============================================
// ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error('\n❌ ERRO GLOBAL:')
  console.error(err)

  res.status(err.status || 500).json({
    success: false,

    error:
      err.message ||
      'Erro interno do servidor',
  })
})

app.use(errorHandler)

// ============================================
// PROCESS ERRORS
// ============================================

process.on(
  'unhandledRejection',
  (err) => {
    console.error(
      '\n❌ UNHANDLED REJECTION'
    )

    console.error(err)
  }
)

process.on(
  'uncaughtException',
  (err) => {
    console.error(
      '\n❌ UNCAUGHT EXCEPTION'
    )

    console.error(err)
  }
)

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {

  console.log(
    `\n🎮 HUB GAMER API rodando na porta ${PORT}`
  )

  console.log(
    `📖 Swagger: http://localhost:${PORT}/api/docs`
  )

  console.log(
    `🏥 Health: http://localhost:${PORT}/health\n`
  )
})

module.exports = app

