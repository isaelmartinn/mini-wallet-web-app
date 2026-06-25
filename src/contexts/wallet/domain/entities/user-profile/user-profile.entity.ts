import { UserProfile as UserProfileInterface } from "./user-profile.interface";

export interface CreateUserProfileParams {
  fullName: string;
  userId: string;
}

export class UserProfile implements UserProfileInterface {
  private constructor(
    private readonly userId: string,
    private readonly fullName: string
  ) {}

  static create(params: CreateUserProfileParams): UserProfile {
    return new UserProfile(params.userId, params.fullName);
  }

  getFullName(): string {
    return this.fullName;
  }

  getInitials(): string {
    const names = this.fullName.trim().split(/\s+/);

    if (names.length === 0 || names[0] === "") {
      return "";
    }

    if (names.length === 1) {
      return names[0]!.charAt(0).toUpperCase();
    }

    const firstInitial = names[0]!.charAt(0).toUpperCase();
    const lastInitial = names[names.length - 1]!.charAt(0).toUpperCase();

    return `${firstInitial}${lastInitial}`;
  }

  getUserId(): string {
    return this.userId;
  }
}
