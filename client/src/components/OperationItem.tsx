import React, { useState } from 'react'
import OperationForm from './OperationForm'
import './OperationItem.css'

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

interface OperationItemProps {
  operation: Operation
  postId: number
  onOperationCreated: () => void
}

const OperationItem: React.FC<OperationItemProps> = ({
  operation,
  postId,
  onOperationCreated,
}) => {
  const [showOperationForm, setShowOperationForm] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day}.${month}.${year}, ${hours}:${minutes}`
  }

  const getOperationSymbol = (type: string) => {
    switch (type) {
      case 'add':
        return '+'
      case 'subtract':
        return '-'
      case 'multiply':
        return '×'
      case 'divide':
        return '÷'
      default:
        return type
    }
  }

  const handleOperationCreated = () => {
    setShowOperationForm(false)
    onOperationCreated()
  }

  return (
    <div className='operation-item'>
      <div className='operation-header'>
        <div className='operation-user'>
          <div className='user-avatar'>
            {operation.user.username[0].toUpperCase()}
          </div>
          <div className='user-name'>{operation.user.username}</div>
        </div>
        <div className='operation-content'>
          <div className='operation-date'>
            {formatDate(operation.createdAt)}
          </div>
          <div className='operation-text'>
            {getOperationSymbol(operation.type)}{' '}
            {parseFloat(operation.rightOperand.toString())} ={' '}
            {parseFloat(operation.result.toString())}
          </div>
          <button
            onClick={() => setShowOperationForm(!showOperationForm)}
            className='reply-btn'
          >
            Reply
          </button>
        </div>
      </div>

      {showOperationForm && (
        <OperationForm
          postId={postId}
          parentId={operation.id}
          leftOperand={parseFloat(operation.result.toString())}
          onOperationCreated={handleOperationCreated}
          onCancel={() => setShowOperationForm(false)}
        />
      )}

      {operation.children && operation.children.length > 0 && (
        <div className='operations-tree'>
          {operation.children.map((child) => (
            <OperationItem
              key={child.id}
              operation={child}
              postId={postId}
              onOperationCreated={onOperationCreated}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default OperationItem
