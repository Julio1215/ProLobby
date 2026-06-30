const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// ============================================
// GET CHARACTERS
// ============================================

const getCharacters = async (req, res) => {

  try {

    const characters =
      await prisma.rPGCharacter.findMany({
        where: {
          userId: req.user.id,
        },

        orderBy: {
          createdAt: 'desc',
        },
      })

    return res.json({
      characters,
    })

  } catch (err) {

    console.error(err)

    return res.status(500).json({
      error:
        'Erro ao buscar fichas',
    })
  }
}

// ============================================
// CREATE
// ============================================

const createCharacter = async (req, res) => {

  try {

    const character =
      await prisma.rPGCharacter.create({
        data: {
          ...req.body,
          userId: req.user.id,
        },
      })

    return res.status(201).json(character)

  } catch (err) {

    console.error(err)

    return res.status(500).json({
      error:
        'Erro ao criar ficha',
    })
  }
}

// ============================================
// UPDATE
// ============================================

const updateCharacter = async (req, res) => {

  try {

    const { id } = req.params

    const character =
      await prisma.rPGCharacter.update({
        where: {
          id,
        },

        data: req.body,
      })

    return res.json(character)

  } catch (err) {

    console.error(err)

    return res.status(500).json({
      error:
        'Erro ao atualizar ficha',
    })
  }
}

// ============================================
// DELETE
// ============================================

const deleteCharacter = async (req, res) => {

  try {

    const { id } = req.params

    await prisma.rPGCharacter.delete({
      where: {
        id,
      },
    })

    return res.json({
      success: true,
    })

  } catch (err) {

    console.error(err)

    return res.status(500).json({
      error:
        'Erro ao deletar ficha',
    })
  }
}

// ============================================
// DUPLICATE
// ============================================

const duplicateCharacter = async (req, res) => {

  try {

    const { id } = req.params

    const original =
      await prisma.rPGCharacter.findUnique({
        where: {
          id,
        },
      })

    if (!original) {
      return res.status(404).json({
        error:
          'Ficha não encontrada',
      })
    }

    const copy =
      await prisma.rPGCharacter.create({
        data: {
          name:
            `${original.name} (Cópia)`,

          system:
            original.system,

          data:
            original.data,

          isPublic:
            original.isPublic,

          userId:
            req.user.id,
        },
      })

    return res.json(copy)

  } catch (err) {

    console.error(err)

    return res.status(500).json({
      error:
        'Erro ao duplicar ficha',
    })
  }
}

module.exports = {
  getCharacters,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  duplicateCharacter,
}

