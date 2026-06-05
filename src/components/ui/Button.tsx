interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon'
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-primary hover:bg-primary-dark text-white',
  secondary: 'bg-secondary hover:bg-secondary-light text-white',
  success: 'bg-success hover:bg-success-dark text-white',
  danger: 'bg-danger hover:bg-danger-dark text-white',
}

const sizes = {
  xs: 'h-7 px-2 text-xs',
  sm: 'h-8 px-3 text-xs sm:text-sm',
  md: 'h-9 px-3 text-sm md:h-10 md:px-4',
  lg: 'h-10 px-4 text-sm md:h-12 md:px-6 md:text-base',
  xl: 'h-11 px-5 text-base md:h-14 md:px-8 md:text-lg',
  icon: 'h-9 w-9 md:h-10 md:w-10',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        whitespace-nowrap
        rounded-md
        font-medium
        transition-colors
        cursor-pointer
        disabled:pointer-events-none
        disabled:opacity-50
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary
        focus-visible:ring-offset-2
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}