import { StoreApi, UseBoundStore } from "zustand";

export interface AuthState<TUser = unknown> {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: null | TUser;
}

export type AuthStore<TUser = unknown> = UseBoundStore<
  StoreApi<AuthState<TUser>>
>;

export interface UserWithId {
  getId(): string;
}
