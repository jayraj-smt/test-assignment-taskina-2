import React, { useState } from 'react'
import api from '../utils/api'
import './OperationForm.css'

interface OperationFormProps {
  postId: number
  parentId: number | null
  leftOperand: number
  onOperationCreated: () => void
  onCancel: () => void
}

const OperationForm: React.FC<OperationFormProps> = ({
  postId,
  parentId,
  leftOperand,
  onOperationCreated,
  onCancel,
}) => {
  const [type, setType] = useState('add')
  const [rightOperand, setRightOperand] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const calculateResult = (): number | null => {
    const right = parseFloat(rightOperand)
    if (isNaN(right) || rightOperand === '') {
      return null
    }

    switch (type) {
      case 'add':
        return leftOperand + right
      case 'subtract':
        return leftOperand - right
      case 'multiply':
        return leftOperand * right
      case 'divide':
        if (right === 0) return null
        return leftOperand / right
      default:
        return null
    }
  }

  const result = calculateResult()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const right = parseFloat(rightOperand)
    if (isNaN(right)) {
      setError('Please enter a valid number')
      setLoading(false)
      return
    }

    try {
      await api.post('/operations', {
        type,
        rightOperand: right,
        parentId,
        postId,
      })
      setRightOperand('')
      onOperationCreated()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create operation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='operation-form'>
      <form onSubmit={handleSubmit}>
        {error && <div className='error-message'>{error}</div>}
        <div className='operation-form-row'>
          <div className='operation-display'>
            <span className='left-operand'>{leftOperand}</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className='operation-select'
            >
              <option value='add'>+</option>
              <option value='subtract'>-</option>
              <option value='multiply'>×</option>
              <option value='divide'>÷</option>
            </select>
            <div className='right-operand-wrapper'>
              <input
                type='number'
                step='any'
                value={rightOperand}
                onChange={(e) => setRightOperand(e.target.value)}
                placeholder='Number'
                className='right-operand-input'
                required
              />
              {result !== null && (
                <span className='result-preview'>= {result}</span>
              )}
            </div>
          </div>
          <div className='operation-form-actions'>
            <button type='submit' disabled={loading} className='submit-btn'>
              {loading ? 'Calculating...' : 'Calculate'}
            </button>
            <button type='button' onClick={onCancel} className='cancel-btn'>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default OperationForm
