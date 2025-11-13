import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { sequelize } from './db/sequelize'
import authRoutes from './routes/auth'
import postRoutes from './routes/posts'
import operationRoutes from './routes/operations'

dotenv.config()

const app = express()
const PORT = process.env.SERVER_PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/operations', operationRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

const startServer = async () => {
  try {
    console.log('Attempting to connect to database...')
    console.log(`Host: ${process.env.DB_HOST || 'localhost'}`)
    console.log(`Database: ${process.env.DB_NAME || 'number_discussion'}`)

    const authenticatePromise = sequelize.authenticate()
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error('Database connection timeout after 10 seconds')),
        10000
      )
    )

    await Promise.race([authenticatePromise, timeoutPromise])
    console.log('✓ Database connection established')

    console.log('Synchronizing database models...')
    const syncPromise = sequelize.sync({ alter: false })
    const syncTimeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error('Database sync timeout after 15 seconds')),
        15000
      )
    )

    await Promise.race([syncPromise, syncTimeoutPromise])
    console.log('✓ Database models synchronized')

    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`)
    })
  } catch (error: any) {
    console.error('✗ Unable to start server:')
    console.error('Error message:', error.message)
    if (error.original) {
      console.error('Original error:', error.original.message)
    }
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
    process.exit(1)
  }
}

startServer()
