export type User = {
  pk: number
  email: string
  username: string
  first_name: string
  last_name: string
  is_artisan: boolean
}

export type AuthResponse = {
  access: string
  refresh: string
  user: User
}

export type SignInPayload = {
  email: string
  password: string
}

export type SignUpPayload = {
  email: string
  username: string
  password1: string
  password2: string
}