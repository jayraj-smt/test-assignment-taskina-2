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
    await sequelize.authenticate()
    console.log('Database connection established')

    await sequelize.sync({ alter: true })
    console.log('Database models synchronized')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Unable to start server:', error)
    process.exit(1)
  }
}

startServer()
