import treeSvg from '../../assets/tree.svg'

type BannerProps = {
  title: string
  subtitle: string
  variant?: 'warm' | 'light'
}

export function Banner({ title, subtitle, variant = 'warm' }: BannerProps) {
  return (
    <div
      className={`
        rounded-2xl p-8 flex items-center justify-between
        min-h-36 overflow-hidden relative
        ${variant === 'warm' ? 'bg-warning/80' : 'bg-card border border-primary/10'}
      `}
    >
      <div className="z-10">
        <h2 className="font-title text-2xl font-bold text-text">
          {title}
        </h2>
        <p className="text-sm text-text/60 mt-1">
          {subtitle}
        </p>
      </div>

      <img
        src={treeSvg}
        alt=""
        aria-hidden="true"
        className="h-28 w-auto opacity-80 shrink-0"
      />
    </div>
  )
}