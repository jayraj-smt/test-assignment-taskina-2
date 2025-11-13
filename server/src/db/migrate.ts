import { sequelize } from './sequelize'
import '../models/User'
import '../models/Post'
import '../models/Operation'

const migrate = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connection established')

    await sequelize.sync({ force: false, alter: true })
    console.log('Database migration completed')
    process.exit(0)
  } catch (error) {
    console.error('Migration error:', error)
    process.exit(1)
  }
}

migrate()
