import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import PostList from './components/PostList'
import CreatePostForm from './components/CreatePostForm'
import { AuthContext } from './context/AuthContext'
import { getAuthToken, setAuthToken, removeAuthToken } from './utils/auth'

interface User {
  id: number
  username: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [showRegister, setShowRegister] = useState(false)
  const [loading, setLoading] = useState(true)
  const postListRef = useRef<{ refresh: () => void } | null>(null)

  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({ id: payload.userId, username: payload.username })
      } catch (error) {
        removeAuthToken()
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (token: string, userData: User) => {
    setAuthToken(token)
    setUser(userData)
  }

  const handleLogout = () => {
    removeAuthToken()
    setUser(null)
  }

  if (loading) {
    return <div className='app-loading'>Loading...</div>
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser: handleLogin, logout: handleLogout }}
    >
      <div className='app'>
        <header className='app-header'>
          <h1>Number Discussion</h1>
          {user ? (
            <div className='user-info'>
              <span>Welcome, {user.username}</span>
              <button onClick={handleLogout} className='logout-btn'>
                Logout
              </button>
            </div>
          ) : (
            <div className='auth-toggle'>
              <button
                onClick={() => setShowRegister(false)}
                className={!showRegister ? 'active' : ''}
              >
                Login
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className={showRegister ? 'active' : ''}
              >
                Register
              </button>
            </div>
          )}
        </header>

        <main className='app-main'>
          {!user ? (
            <div className='auth-container'>
              {showRegister ? <RegisterForm /> : <LoginForm />}
            </div>
          ) : (
            <CreatePostForm
              onPostCreated={() => postListRef.current?.refresh()}
            />
          )}
          <PostList ref={postListRef} />
        </main>
      </div>
    </AuthContext.Provider>
  )
}

export default App
