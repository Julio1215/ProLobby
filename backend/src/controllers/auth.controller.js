const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// ============================================
// REGISTER
// ============================================

const register = async (req, res) => {
  try {
    const { email, username, password, displayName } = req.body

    if (!email || !username || !password) {
      return res.status(400).json({
        error: 'Email, username e senha são obrigatórios',
      })
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    })

    if (existingUser) {
      return res.status(400).json({
        error: 'Email ou username já estão em uso',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        displayName: displayName || username,
        password: hashedPassword,
      },
    })

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(201).json({
      token,
      user: {
        id:          user.id,
        email:       user.email,
        username:    user.username,
        displayName: user.displayName,
        avatarUrl:   user.avatarUrl,
        role:        user.role,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erro ao registrar usuário' })
  }
}

// ============================================
// LOGIN
// ============================================

const login = async (req, res) => {
  try {
    const { login, password } = req.body

    if (!login || !password) {
      return res.status(400).json({ error: 'Login e senha obrigatórios' })
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { username: login }],
      },
    })

    if (!user) {
      return res.status(401).json({ error: 'Email/username ou senha incorretos' })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).json({ error: 'Email/username ou senha incorretos' })
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({
      token,
      user: {
        id:          user.id,
        email:       user.email,
        username:    user.username,
        displayName: user.displayName,
        avatarUrl:   user.avatarUrl,
        role:        user.role,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erro ao fazer login' })
  }
}

// ============================================
// GET ME
// ============================================

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id:          true,
        email:       true,
        username:    true,
        displayName: true,
        avatarUrl:   true,
        role:        true,
        createdAt:   true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    return res.json(user)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erro ao buscar usuário' })
  }
}

module.exports = { register, login, getMe }