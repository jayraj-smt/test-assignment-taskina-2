import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const dbConfig: any = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {},
}

if (process.env.DB_SSL === 'require' || process.env.DB_SSL === 'true') {
  dbConfig.dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: false,
  }
}

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'number_discussion',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  dbConfig
)
