import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getCurrentUser,
  login,
  logoutUser,
  register,
} from "../../api/accounts/auth";
import { api } from "../../api/client";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (user) => {
      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    // 1. Roda IMEDIATAMENTE quando o usuário clica em "Sair"
    onMutate: async () => {
      // Cancela queries em andamento para não sobrescreverem nosso estado limpo
      await queryClient.cancelQueries({ queryKey: ["current-user"] });

      // Limpa o token imediatamente
      localStorage.removeItem('temp_access_token');

      // Define os dados do usuário no cache diretamente como null
      // Isso força o Header (e qualquer componente que use "current-user") a atualizar na hora
      queryClient.setQueryData(["current-user"], null);
      queryClient.clear();
    },
    onSuccess: () => {
      // Invalida para garantir que o estado limpo seja o oficial
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error) => {
      console.error('Erro no logout:', error.message);
      localStorage.removeItem('temp_access_token');
      queryClient.clear();
    }
  });
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: (payload: { code: string }) =>
      api.post("/api/v1/accounts/login/google/", payload),
  });
}