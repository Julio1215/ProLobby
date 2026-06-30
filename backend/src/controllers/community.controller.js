const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ============================================
// GET POSTS
// ============================================
const getPosts = async (req, res) => {
  try {
    const page  = parseInt(req.query.page  || '1')
    const limit = parseInt(req.query.limit || '18')
    const type  = req.query.type || undefined
    const skip  = (page - 1) * limit

    const where = type ? { type } : {}

    const [posts, total] = await Promise.all([
      prisma.communityPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
      }),
      prisma.communityPost.count({ where }),
    ])

    return res.json({
      posts,
      total,
      page,
      hasMore: skip + posts.length < total,
    })
  } catch (err) {
    console.error('[Community] getPosts:', err)
    return res.status(500).json({ error: 'Erro ao buscar posts' })
  }
}

// ============================================
// CREATE POST
// ============================================
const createPost = async (req, res) => {
  try {
    const { title, content, type, gameTitle, rating } = req.body

    if (!type) {
      return res.status(400).json({ error: 'Tipo do post é obrigatório' })
    }

    // Imagem vem do multer (req.file) ou como URL direta (req.body.imageUrl)
    let imageUrl = null
    if (req.file) {
      imageUrl = `/uploads/community/${req.file.filename}`
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl
    }

    const post = await prisma.communityPost.create({
      data: {
        title:     title     || null,
        content:   content   || null,
        imageUrl,
        type,
        gameTitle: gameTitle || null,
        rating:    rating    ? parseFloat(rating) : null,
        userId:    req.user.id,
      },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    })

    return res.status(201).json({ post })
  } catch (err) {
    console.error('[Community] createPost:', err)
    return res.status(500).json({ error: 'Erro ao criar post' })
  }
}

// ============================================
// LIKE POST
// ============================================
const likePost = async (req, res) => {
  try {
    const post = await prisma.communityPost.update({
      where: { id: req.params.id },
      data:  { likesCount: { increment: 1 } },
    })
    return res.json(post)
  } catch (err) {
    console.error('[Community] likePost:', err)
    return res.status(500).json({ error: 'Erro ao curtir post' })
  }
}

// ============================================
// DELETE POST
// ============================================
const deletePost = async (req, res) => {
  try {
    const post = await prisma.communityPost.findUnique({ where: { id: req.params.id } })
    if (!post) return res.status(404).json({ error: 'Post não encontrado' })
    if (post.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Sem permissão' })
    }
    await prisma.communityPost.delete({ where: { id: req.params.id } })
    return res.json({ success: true })
  } catch (err) {
    console.error('[Community] deletePost:', err)
    return res.status(500).json({ error: 'Erro ao deletar post' })
  }
}

module.exports = { getPosts, createPost, likePost, deletePost }
