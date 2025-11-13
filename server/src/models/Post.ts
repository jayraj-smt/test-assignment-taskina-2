import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../db/sequelize'
import User from './User'

interface PostAttributes {
  id: number
  startingNumber: number
  userId: number
  createdAt?: Date
  updatedAt?: Date
}

interface PostCreationAttributes
  extends Optional<PostAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  public id!: number
  public startingNumber!: number
  public userId!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    startingNumber: {
      type: DataTypes.DECIMAL(20, 10),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
  }
)

Post.belongsTo(User, { foreignKey: 'userId', as: 'user' })
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' })

export default Post
