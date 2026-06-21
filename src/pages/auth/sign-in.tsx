import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, type SignInPayload } from '../../schemas/auth'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { ButtonGoogle } from '../../components/ui/GoogleButton'
import logo from '../../assets/logo-creme.svg'




const MOCK_USER = {
  email: 'valdivania@email.com',
  password: '123456',
}

export function SignIn() {
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    setError,
    clearErrors, 
    formState: { errors, isSubmitting },
  } = useForm<SignInPayload>({
    resolver: zodResolver(signInSchema),
     mode: 'onBlur',  // Valida quando sai do campo (padrão)
  })

  async function onSubmit(data: SignInPayload) {

    clearErrors()

    // Simula delay da API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (data.email === MOCK_USER.email && data.password === MOCK_USER.password) {
      localStorage.setItem('user', JSON.stringify({ 
        email: data.email, 
        name: 'Valdivania', 
        role: 'cliente' 
      }))
      navigate('/')
    } else {
      setError('password', { 
        type: 'manual',
        message: 'Email ou senha incorretos.' 
      })
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md flex flex-col gap-6">
          
          <div className="text-center">
            <h1 className="font-title text-3xl font-bold text-text">
              Acessar conta
            </h1>
            <p className="text-sm text-text/60 mt-2">
              Digite seu e-mail e senha para fazer login
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="exemplo@gmail.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="flex flex-col gap-1.5">
              <Input
                type="password"
                label="Senha"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Acessar'}
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
        <div className="text-center max-w-2xl mx-auto">
          <img 
            src={logo} 
            alt="Ateliê Digital" 
            className="max-w-xs mx-auto"
          />
        </div>
      </div>
    </div>
  )
}