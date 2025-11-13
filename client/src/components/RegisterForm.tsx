import React, { useState, useEffect, useCallback } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../utils/api'
import PasswordToggleIcon from './PasswordToggleIcon'
import './Form.css'

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const { setUser } = useContext(AuthContext)

  const checkUsername = useCallback(async (usernameToCheck: string) => {
    if (!usernameToCheck || usernameToCheck.length < 3) {
      setUsernameError('')
      return
    }

    setCheckingUsername(true)
    try {
      const response = await api.get(`/auth/check-username/${usernameToCheck}`)
      if (response.data.exists) {
        setUsernameError('Username already exists')
      } else {
        setUsernameError('')
      }
    } catch (err) {
      setUsernameError('')
    } finally {
      setCheckingUsername(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username) {
        checkUsername(username)
      } else {
        setUsernameError('')
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [username, checkUsername])

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError('Passwords do not match')
    } else if (password && password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
    } else {
      setPasswordError('')
    }
  }, [password, confirmPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    if (usernameError) {
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/auth/register', { username, password })
      setUser(response.data.token, response.data.user)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='form'>
      <h2>Register</h2>
      {error && <div className='error-message'>{error}</div>}
      <div className='form-group'>
        <label htmlFor='reg-username'>Username</label>
        <input
          type='text'
          id='reg-username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={usernameError ? 'error' : ''}
          required
        />
        {checkingUsername && <div className='checking-text'>Checking...</div>}
        {usernameError && <div className='field-error'>{usernameError}</div>}
      </div>
      <div className='form-group'>
        <label htmlFor='reg-password'>Password</label>
        <div className='password-input-wrapper'>
          <input
            type={showPassword ? 'text' : 'password'}
            id='reg-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={passwordError ? 'error' : ''}
            required
          />
          <button
            type='button'
            className='password-toggle'
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <PasswordToggleIcon show={showPassword} />
          </button>
        </div>
      </div>
      <div className='form-group'>
        <label htmlFor='reg-confirm-password'>Confirm Password</label>
        <div className='password-input-wrapper'>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id='reg-confirm-password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={passwordError ? 'error' : ''}
            required
          />
          <button
            type='button'
            className='password-toggle'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            <PasswordToggleIcon show={showConfirmPassword} />
          </button>
        </div>
        {passwordError && <div className='field-error'>{passwordError}</div>}
      </div>
      <button
        type='submit'
        disabled={loading || !!usernameError || checkingUsername}
        className='submit-btn'
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}

export default RegisterForm
