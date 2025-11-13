import React, { useState } from 'react'
import api from '../utils/api'
import './CreatePostForm.css'

interface CreatePostFormProps {
  onPostCreated?: () => void
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
  const [startingNumber, setStartingNumber] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const number = parseFloat(startingNumber)
    if (isNaN(number)) {
      setError('Please enter a valid number')
      setLoading(false)
      return
    }

    try {
      await api.post('/posts', { startingNumber: number })
      setStartingNumber('')
      if (onPostCreated) {
        onPostCreated()
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='create-post-form'>
      <h2>Create New Discussion</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className='error-message'>{error}</div>}
        <div className='form-group'>
          <label htmlFor='starting-number'>Starting Number</label>
          <input
            type='number'
            id='starting-number'
            step='any'
            value={startingNumber}
            onChange={(e) => setStartingNumber(e.target.value)}
            placeholder='Enter a starting number'
            required
          />
        </div>
        <button type='submit' disabled={loading} className='submit-btn'>
          {loading ? 'Creating...' : 'Create Discussion'}
        </button>
      </form>
    </div>
  )
}

export default CreatePostForm
