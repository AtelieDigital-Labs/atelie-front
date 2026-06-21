interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({
  label,
  error,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={`
          h-10
          w-full
          rounded-full
          border
          border-primary/20
          bg-surface
          px-4
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
          ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
    </div>
  )
}