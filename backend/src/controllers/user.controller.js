const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// ============================================
// GET PROFILE
// ============================================

const getProfile = async (req, res) => {

  try {

    const user =
      await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },

        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
          role: true,
          createdAt: true,
        },
      })

    return res.json(user)

  } catch (err) {

    console.error(err)

    return res.status(500).json({
      error: 'Erro ao buscar perfil',
    })
  }
}

// ============================================
// UPDATE PROFILE
// ============================================

const updateProfile = async (req, res) => {

  try {

    const {
      displayName,
      bio,
      avatarUrl,
    } = req.body

    const user =
      await prisma.user.update({
        where: {
          id: req.user.id,
        },

        data: {
          displayName,
          bio,
          avatarUrl,
        },

        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
          role: true,
        },
      })

    return res.json(user)

  } catch (err) {

    console.error(err)

    return res.status(500).json({
      error: 'Erro ao atualizar perfil',
    })
  }
}

module.exports = {
  getProfile,
  updateProfile,
}

