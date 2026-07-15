import { useQuery } from '@tanstack/react-query'
import { getMyWallet } from '../../api/accounts/wallet'

export function useMyWallet() {
  return useQuery({
    queryKey: ['my-wallet'],
    queryFn: getMyWallet,
  })
}