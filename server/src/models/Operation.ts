import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../db/sequelize'
import User from './User'
import Post from './Post'

export enum OperationType {
  ADD = 'add',
  SUBTRACT = 'subtract',
  MULTIPLY = 'multiply',
  DIVIDE = 'divide',
}

interface OperationAttributes {
  id: number
  type: OperationType
  rightOperand: number
  result: number
  parentId: number | null
  postId: number
  userId: number
  createdAt?: Date
  updatedAt?: Date
}

interface OperationCreationAttributes
  extends Optional<OperationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Operation
  extends Model<OperationAttributes, OperationCreationAttributes>
  implements OperationAttributes
{
  public id!: number
  public type!: OperationType
  public rightOperand!: number
  public result!: number
  public parentId!: number | null
  public postId!: number
  public userId!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Operation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(OperationType)),
      allowNull: false,
    },
    rightOperand: {
      type: DataTypes.DECIMAL(20, 10),
      allowNull: false,
    },
    result: {
      type: DataTypes.DECIMAL(20, 10),
      allowNull: false,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'operations',
        key: 'id',
      },
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id',
      },
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
    modelName: 'Operation',
    tableName: 'operations',
  }
)

Operation.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Operation.belongsTo(Post, { foreignKey: 'postId', as: 'post' })
Operation.belongsTo(Operation, { foreignKey: 'parentId', as: 'parent' })
Operation.hasMany(Operation, { foreignKey: 'parentId', as: 'children' })

User.hasMany(Operation, { foreignKey: 'userId', as: 'operations' })
Post.hasMany(Operation, { foreignKey: 'postId', as: 'operations' })

export default Operation
