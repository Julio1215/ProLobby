const express = require('express')
const multer  = require('multer')
const path    = require('path')
const fs      = require('fs')

const router = express.Router()

const { authenticate } = require('../middlewares/auth.middleware')

const {
  getPosts,
  createPost,
  likePost,
  deletePost,
} = require('../controllers/community.controller')

// ============================================
// MULTER — upload de imagens de posts
// ============================================
const postsDir = path.join(__dirname, '../../uploads/community')
fs.mkdirSync(postsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, postsDir),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `post-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Formato inválido'))
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })

// ============================================
// ROUTES
// ============================================

router.get('/', getPosts)

router.post('/', authenticate, upload.single('image'), createPost)

router.post('/:id/like', authenticate, likePost)

router.delete('/:id', authenticate, deletePost)

module.exports = router
