import express from 'express'
import Operation, { OperationType } from '../models/Operation'
import Post from '../models/Post'
import User from '../models/User'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = express.Router()

const calculateResult = (
  leftOperand: number,
  operationType: OperationType,
  rightOperand: number
): number => {
  switch (operationType) {
    case OperationType.ADD:
      return leftOperand + rightOperand
    case OperationType.SUBTRACT:
      return leftOperand - rightOperand
    case OperationType.MULTIPLY:
      return leftOperand * rightOperand
    case OperationType.DIVIDE:
      if (rightOperand === 0) {
        throw new Error('Division by zero is not allowed')
      }
      return leftOperand / rightOperand
    default:
      throw new Error('Invalid operation type')
  }
}

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { type, rightOperand, parentId, postId } = req.body

    if (!type || !Object.values(OperationType).includes(type)) {
      return res.status(400).json({ error: 'Valid operation type is required' })
    }

    if (typeof rightOperand !== 'number') {
      return res
        .status(400)
        .json({ error: 'Right operand must be a valid number' })
    }

    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' })
    }

    const post = await Post.findByPk(postId)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    let leftOperand: number

    if (parentId) {
      const parentOperation = await Operation.findByPk(parentId)
      if (!parentOperation) {
        return res.status(404).json({ error: 'Parent operation not found' })
      }
      if (parentOperation.postId !== postId) {
        return res
          .status(400)
          .json({ error: 'Parent operation must belong to the same post' })
      }
      leftOperand = parseFloat(parentOperation.result.toString())
    } else {
      leftOperand = parseFloat(post.startingNumber.toString())
    }

    const result = calculateResult(leftOperand, type, rightOperand)

    const operation = await Operation.create({
      type,
      rightOperand,
      result,
      parentId: parentId || null,
      postId,
      userId: req.userId!,
    })

    const operationWithRelations = await Operation.findByPk(operation.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
        {
          model: Post,
          as: 'post',
          attributes: ['id', 'startingNumber'],
        },
      ],
    })

    res.status(201).json(operationWithRelations)
  } catch (error: any) {
    console.error('Error creating operation:', error)
    if (error.message === 'Division by zero is not allowed') {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
