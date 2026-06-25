import { AuthState, AuthStore } from "#shared/domain/interfaces";

export function useAuthContext<TUser>(authStore: AuthStore<TUser>) {
  const user = authStore((state: AuthState<TUser>) => state.user);
  const isAuthenticated = authStore(
    (state: AuthState<TUser>) => state.isAuthenticated
  );
  const isLoading = authStore((state: AuthState<TUser>) => state.isLoading);

  return { isAuthenticated, isLoading, user };
}
