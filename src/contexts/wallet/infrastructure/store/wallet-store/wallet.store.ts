import { create } from "zustand";

import { Balance, UserProfile } from "#wallet/domain/entities";

interface WalletActions {
  clearWallet: () => void;
  setBalance: (balance: Balance) => void;
  setLoading: (isLoading: boolean) => void;
  setUserProfile: (userProfile: UserProfile) => void;
}

interface WalletState {
  balance: Balance | null;
  isLoading: boolean;
  userProfile: null | UserProfile;
}

type WalletStore = WalletActions & WalletState;

export const useWalletStore = create<WalletStore>((set) => ({
  balance: null,

  clearWallet: () => {
    set({
      balance: null,
      isLoading: false,
      userProfile: null,
    });
  },

  isLoading: false,

  setBalance: (balance) => set({ balance }),

  setLoading: (isLoading) => set({ isLoading }),

  setUserProfile: (userProfile) => set({ userProfile }),

  userProfile: null,
}));
