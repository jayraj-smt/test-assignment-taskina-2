import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const router = express.Router()

router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params
    const user = await User.findOne({ where: { username } })
    res.json({ exists: !!user })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' })
    }

    const existingUser = await User.findOne({ where: { username } })
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    const user = await User.create({ username, password })

    const jwtSecret: string = process.env.JWT_SECRET || 'secret'
    const expiresIn: string = process.env.JWT_EXPIRES_IN || '7d'
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      jwtSecret,
      { expiresIn } as jwt.SignOptions
    )

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' })
    }

    const user = await User.findOne({ where: { username } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isValidPassword = await user.validatePassword(password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const jwtSecret: string = process.env.JWT_SECRET || 'secret'
    const expiresIn: string = process.env.JWT_EXPIRES_IN || '7d'
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      jwtSecret,
      { expiresIn } as jwt.SignOptions
    )

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
