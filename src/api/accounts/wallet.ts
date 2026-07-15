import { api } from '../client'
import { walletSchema, type Wallet } from '../../schemas/wallet'

export async function getMyWallet(): Promise<Wallet> {
  const { data } = await api.get('/api/v1/accounts/users/me/wallet/')
  return walletSchema.parse(data)
}