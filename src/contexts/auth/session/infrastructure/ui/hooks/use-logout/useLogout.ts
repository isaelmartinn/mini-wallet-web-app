import { useCallback } from "react";

import { LogoutUseCase } from "#auth/session/application";
import { AuthRepository } from "#auth/session/infrastructure/repositories";
import { useAuthStore } from "#auth/session/infrastructure/store";

export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession);

  const logout = useCallback(async () => {
    const authRepository = new AuthRepository();
    const logoutUseCase = new LogoutUseCase(authRepository);

    await logoutUseCase.execute();
    clearSession();
  }, [clearSession]);

  return { logout };
}
