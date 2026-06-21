import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, type SignUpPayload } from '../../schemas/auth'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { formatCPF, formatPhone, unformatCPF, unformatPhone } from '../../utils/formatters'
import logo from '../../assets/logo-creme.svg'

export function SignUp() {
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpPayload>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
  })

  async function onSubmit(data: SignUpPayload) {
  clearErrors()
  
  // Remove formatação antes de enviar para API
  const payload = {
    ...data,
    cpf: data.cpf ? unformatCPF(data.cpf) : '',
    phone_number: data.phone_number ? unformatPhone(data.phone_number) : '',
  }
  
  // Simula delay da API
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  
  // Simula sucesso (
  localStorage.setItem('user', JSON.stringify({
    email: payload.email,
    username: payload.username,
    first_name: payload.first_name,
    last_name: payload.last_name,
    cpf: payload.cpf,
    phone_number: payload.phone_number,
    role: 'cliente',
  }))
  
  navigate('/')
  }

  function handleCPFChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCPF(e.target.value)
    setValue('cpf', formatted, { shouldValidate: true })
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhone(e.target.value)
    setValue('phone_number', formatted, { shouldValidate: true })
  }

  return (
    <div className="min-h-screen flex">
   
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md flex flex-col gap-6">
          
          <div className="text-center">
            <h1 className="font-title text-3xl font-bold text-text">
              Criar conta
            </h1>
            <p className="text-sm text-text/60 mt-2">
              Preencha os dados abaixo para se cadastrar
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nome"
                placeholder="João"
                error={errors.first_name?.message}
                {...register('first_name')}
              />
              <Input
                label="Sobrenome"
                placeholder="Silva"
                error={errors.last_name?.message}
                {...register('last_name')}
              />
            </div>

            
            <Input
              label="Username"
              placeholder="joao_silva"
              error={errors.username?.message}
              {...register('username')}
            />

           
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="CPF"
                placeholder="000.000.000-00"
                maxLength={14}
                error={errors.cpf?.message}
                {...register('cpf', {
                  onChange: handleCPFChange,
                })}
              />
              <Input
                label="Telefone"
                type="tel"
                placeholder="(00) 00000-0000"
                maxLength={15}
                error={errors.phone_number?.message}
                {...register('phone_number', {
                  onChange: handlePhoneChange,
                })}
              />
            </div>

            
            <Input
              label="Data de nascimento"
              type="date"
              error={errors.date_of_birth?.message}
              {...register('date_of_birth')}
            />

           
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              error={errors.password1?.message}
              {...register('password1')}
            />
            <Input
              label="Confirmar senha"
              type="password"
              placeholder="••••••••"
              error={errors.password2?.message}
              {...register('password2')}
            />
         

            <Button 
              type="submit" 
              fullWidth 
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>

          <p className="text-center text-sm text-text/60">
            Já tem conta?{' '}
            <Link to="/sign-in" className="text-primary font-semibold hover:underline">
              Entrar
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