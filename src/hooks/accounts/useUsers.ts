import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../api/accounts/users";
import type { UserUpdate } from "../../schemas/user";


export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserUpdate| FormData) =>
      updateProfile(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
    },
  });
}