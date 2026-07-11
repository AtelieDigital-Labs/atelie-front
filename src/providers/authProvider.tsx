import React, { createContext } from "react";
import { useCurrentUser } from "../hooks/accounts/useAuth";
import type { User } from "../schemas/user";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refetchUser: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  refetchUser: () => {},
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: user,
    isLoading,
    refetch,
  } = useCurrentUser();

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated: !!user,
        isLoading,
        refetchUser: () => {
          refetch();
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}