import styles from './Button.module.css'

type Variant = | 'primary' | 'secondary' | 'success' | 'danger'


type Size =  | 'xs' | 'sm'| 'md' | 'lg' | 'xl' | 'icon'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
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
    <button className={` ${styles.base} ${styles[variant]} ${styles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}