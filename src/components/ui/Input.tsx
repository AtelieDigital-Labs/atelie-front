import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const sizes = {
  xs: 'h-7 px-3 text-xs',
  sm: 'h-8 px-3 text-xs sm:text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-4 text-sm md:text-base',
  xl: 'h-14 px-5 text-base',
}

export function Input({
  label,
  error,
  size = 'md',
  className = '',
  id,
  type,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-')
  const [showPassword, setShowPassword] = useState(false)
  
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          className={`
            w-full
            rounded-full
            border
            border-primary/20
            bg-surface
            text-sm
            text-text
            placeholder:text-text/40
            outline-none
            transition-colors
            focus:border-primary
            focus:ring-2
            focus:ring-primary/20
            disabled:opacity-50
            disabled:pointer-events-none
            ${sizes[size]}
            ${isPassword ? 'pr-12' : ''}
            ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}
            ${className}
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text/50 hover:text-primary transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
    </div>
  )
}