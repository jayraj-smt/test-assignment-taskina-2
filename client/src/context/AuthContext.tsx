import { createContext } from 'react'

interface User {
  id: number
  username: string
}

interface AuthContextType {
  user: User | null
  setUser: (token: string, user: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
})
