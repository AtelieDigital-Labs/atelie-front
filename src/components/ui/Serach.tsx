import { Search as SearchIcon } from 'lucide-react'

type SearchProps = React.InputHTMLAttributes<HTMLInputElement>

export function Search({
  placeholder = 'Busque por lojas e produtos',
  className = '',
  ...props
}: SearchProps) {
  return (
    <div
      className={`
       flex items-center gap-3 w-full
        rounded-full border border-primary/50 bg-surface
        px-5 py-3 transition-all
        focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20
        ${className}
      `}
    >
      <input
        className="
          flex-1
          bg-transparent
          outline-none
          text-sm
          text-text
          placeholder:text-gray
        "
        placeholder={placeholder}
        {...props}
      />

      <SearchIcon
        size={20}
        className="
          shrink-0
          text-primary
        "
      />
    </div>
  )
}