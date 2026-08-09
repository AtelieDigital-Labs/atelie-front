import React, {createContext, useState} from 'react'


type User = {
  name: string
  role: 'client' | 'artisan'
}
type AuthContextType = {
  user: User | null
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user:null,
  isLoading:false
})

export function AuthProvider({children}:{children: React.ReactNode}){
  const [user] = useState<User | null>({
    name:'Valdivania',
    role:'client'
  })

  // DEPOIS — com session real
  // const [user, setUser] = useState<User | null>(null)

  // useEffect(() => {
  //   const stored = localStorage.getItem('user')
  //   if (stored) setUser(JSON.parse(stored))
  // }, [])

  return (
    <AuthContext.Provider value={{user, isLoading: false}}>
      {children}
    </AuthContext.Provider>
  )
}

