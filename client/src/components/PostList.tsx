import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import api from '../utils/api'
import PostItem from './PostItem'
import './PostList.css'

interface User {
  id: number
  username: string
}

interface Operation {
  id: number
  type: string
  rightOperand: number
  result: number
  parentId: number | null
  user: User
  children: Operation[]
  createdAt: string
}

interface Post {
  id: number
  startingNumber: number
  user: User
  operations: Operation[]
  createdAt: string
}

interface PostListRef {
  refresh: () => void
}

const PostList = forwardRef<PostListRef>((props, ref) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/posts')
      setPosts(response.data)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    refresh: fetchPosts,
  }))

  useEffect(() => {
    fetchPosts()
  }, [])

  if (loading) {
    return <div className='loading'>Loading posts...</div>
  }

  if (error) {
    return <div className='error-message'>{error}</div>
  }

  if (posts.length === 0) {
    return (
      <div className='no-posts'>
        No discussions yet. Create one to get started!
      </div>
    )
  }

  return (
    <div className='post-list'>
      <h2>All Discussions</h2>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} onUpdate={fetchPosts} />
      ))}
    </div>
  )
})

PostList.displayName = 'PostList'

export default PostList
