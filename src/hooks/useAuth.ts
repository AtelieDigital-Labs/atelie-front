import { useContext } from 'react'
import { AuthContext } from '../providers/authProvider'

export function useAuth() {
  return useContext(AuthContext)
}