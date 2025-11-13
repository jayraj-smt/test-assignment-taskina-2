import express from 'express'
import Post from '../models/Post'
import Operation from '../models/Operation'
import User from '../models/User'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
        {
          model: Operation,
          as: 'operations',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username'],
            },
          ],
          order: [['createdAt', 'ASC']],
        },
      ],
      order: [['createdAt', 'DESC']],
    })

    const postsWithTree = posts.map((post: any) => {
      const operations = (post.operations || []) as Operation[]
      const operationMap = new Map()
      const rootOperations: any[] = []

      operations.forEach((op: Operation) => {
        operationMap.set(op.id, {
          ...op.toJSON(),
          children: [],
        })
      })

      operations.forEach((op: Operation) => {
        const operationNode = operationMap.get(op.id)
        if (op.parentId === null) {
          rootOperations.push(operationNode)
        } else {
          const parent = operationMap.get(op.parentId)
          if (parent) {
            parent.children.push(operationNode)
          }
        }
      })

      return {
        ...post.toJSON(),
        operations: rootOperations,
      }
    })

    res.json(postsWithTree)
  } catch (error) {
    console.error('Error fetching posts:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { startingNumber } = req.body

    if (typeof startingNumber !== 'number') {
      return res
        .status(400)
        .json({ error: 'Starting number must be a valid number' })
    }

    const post = await Post.create({
      startingNumber,
      userId: req.userId!,
    })

    const postWithUser = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
      ],
    })

    res.status(201).json(postWithUser)
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
