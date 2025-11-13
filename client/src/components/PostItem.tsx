import React, { useState } from 'react'
import OperationItem from './OperationItem'
import OperationForm from './OperationForm'
import './PostItem.css'

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

interface PostItemProps {
  post: Post
  onUpdate: () => void
}

const PostItem: React.FC<PostItemProps> = ({ post, onUpdate }) => {
  const [showOperationForm, setShowOperationForm] = useState(false)
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day}.${month}.${year}, ${hours}:${minutes}`
  }

  const handleReply = (parentId: number | null) => {
    setSelectedParentId(parentId)
    setShowOperationForm(true)
  }

  const handleOperationCreated = () => {
    setShowOperationForm(false)
    setSelectedParentId(null)
    onUpdate()
  }

  return (
    <div className='post-item'>
      <div className='post-header'>
        <div className='post-user'>
          <div className='user-avatar'>
            {post.user.username[0].toUpperCase()}
          </div>
          <div className='user-name'>{post.user.username}</div>
        </div>
        <div className='post-content'>
          <div className='post-date'>{formatDate(post.createdAt)}</div>
          <div className='post-number'>
            <strong>
              Starting Number: {parseFloat(post.startingNumber.toString())}
            </strong>
          </div>
          <button onClick={() => handleReply(null)} className='reply-btn'>
            Reply
          </button>
        </div>
      </div>

      {showOperationForm && selectedParentId === null && (
        <OperationForm
          postId={post.id}
          parentId={null}
          leftOperand={parseFloat(post.startingNumber.toString())}
          onOperationCreated={handleOperationCreated}
          onCancel={() => {
            setShowOperationForm(false)
            setSelectedParentId(null)
          }}
        />
      )}

      {post.operations && post.operations.length > 0 && (
        <div className='operations-tree'>
          {post.operations.map((operation) => (
            <OperationItem
              key={operation.id}
              operation={operation}
              postId={post.id}
              onOperationCreated={handleOperationCreated}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PostItem
