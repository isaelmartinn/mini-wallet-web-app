"use client";

import { useEffect } from "react";

import { ValidateSessionUseCase } from "#auth/application";
import { AuthRepository, useAuthStore } from "#auth/infrastructure";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const authRepository = new AuthRepository();
        const validateSessionUseCase = new ValidateSessionUseCase(
          authRepository
        );
        const user = await validateSessionUseCase.execute();

        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [setLoading, setUser]);

  return <>{children}</>;
}
