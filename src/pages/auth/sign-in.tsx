import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/Button'
import { ButtonGoogle } from '../../components/ui/GoogleButton'
import logo from '../../assets/logo-creme.svg'

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
    <div className="min-h-screen flex">

      <div className="flex-1 flex items-center justify-center px-8 py-12 ">
        <div className="w-full max-w-md flex flex-col gap-6 max-w-2xl mx-auto">
          
          <div className="text-center">
            <h1 className="font-title text-3xl font-bold text-text">
              Acessar conta
            </h1>
            <p className="text-sm text-text/60 mt-2">
              Digite seu e-mail e senha para fazer login
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="exemplo@gmail.com"
              required
            />

            <div className="flex flex-col gap-1.5">
              <Input
                type="password"
                label="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                error={error}
              />
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline mt-1"
              >
                Recuperar senha
              </Link>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              variant="primary"
            >
              Acessar
            </Button>
          </form>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gray-300" />
            <p className="text-sm text-text/60">Ou</p>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <ButtonGoogle />

          <p className="text-center text-sm text-text/60">
            Você não tem uma conta?{' '}
            <Link to="/sign-up" className="text-primary font-semibold hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>

      
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12">
        <div className="text-center ">
          <img 
            src={logo} 
            alt="Ateliê Digital" 
            className="max-w-xs mx-auto max-w-2xl mx-auto "
          />
        </div>
      </div>
    </div>
  )
}