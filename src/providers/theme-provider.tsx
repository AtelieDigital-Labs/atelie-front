import { createContext, useEffect, useState } from 'react'

type Theme = 'light'

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  theme: Theme
}

export const ThemeProviderContext = createContext<
  ThemeProviderState | undefined
>(undefined)

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme] = useState<Theme>('light')

  useEffect(() => {
    document.documentElement.classList.add(theme)
  }, [theme])

  return (
    <ThemeProviderContext.Provider value={{ theme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}