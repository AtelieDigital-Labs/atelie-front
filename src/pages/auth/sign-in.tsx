import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/Button'
import { ButtonGoogle } from '../../components/ui/GoogleButton'

const MOCK_USER = {
  email: 'valdivania@email.com',
  password: '123456',
}

export function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      localStorage.setItem('user', JSON.stringify({ email, name: 'Valdivania', role: 'cliente' }))
      navigate('/')
    } else {
      setError('Email ou senha incorretos.')
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="bg-card rounded-2xl p-8 w-full max-w-md flex flex-col gap-6">

        <div className="text-center">
          <h1 className="font-title text-3xl text-primary">Ateliê Digital</h1>
          <p className="text-sm text-text/60 mt-1">Entre na sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text">Senha</label>
             
            </div>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              error={error}
            />
             <Link to="/forgot-password" className="text-xs text-primary hover:underline text-end m-2">
                Esqueci minha senha
              </Link>
          </div>

          <Button type="submit" fullWidth >
            Entrar
          </Button>
        </form>

        <div className='flex items-center gap-3 my-4'>
          <div className="flex-1 h-px bg-gray-300" />
          <p className="text-sm text-text/60">Ou</p>
          <div className="flex-1 h-px bg-gray-300" />
        </div>


        <ButtonGoogle/>


        <p className="text-center text-sm text-text/60">
          Não tem conta?{' '}
          <Link to="/sign-up" className="text-primary font-semibold hover:underline">
            Criar conta
          </Link>
        </p>

        

      </div>
    </div>
  )
}