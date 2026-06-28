import { User } from "#auth/domain";
import { AuthRepository as AuthRepositoryInterface } from "#auth/domain/repositories";
import { Email, Phone } from "#shared/domain/value-objects";

import { mockUsers } from "./auth.fixtures";

interface StoredUserData {
  email?: string;
  id: string;
  name: string;
  phone?: string;
}

export class AuthRepository implements AuthRepositoryInterface {
  async clearSession(): Promise<void> {
    localStorage.removeItem("auth_user");
  }

  async findByCredential(credential: Email | Phone): Promise<null | User> {
    await this.simulateDelay();

    const credentialValue = credential.getValue();

    const user = mockUsers.find((u) => {
      const email = u.getEmail();
      const phone = u.getPhone();

      if (
        email &&
        email.getValue().toLowerCase() === credentialValue.toLowerCase()
      ) {
        return true;
      }

      if (phone && phone.getValue() === credentialValue) {
        return true;
      }

      return false;
    });

    if (user) {
      this.persistSession(user);
    }

    return user ?? null;
  }

  async getStoredSession(): Promise<null | User> {
    const storedUser = localStorage.getItem("auth_user");

    if (!storedUser) {
      return null;
    }

    try {
      const userData = JSON.parse(storedUser) as StoredUserData;

      return User.create({
        email: userData.email ? Email.create(userData.email) : undefined,
        id: userData.id,
        name: userData.name,
        phone: userData.phone ? Phone.create(userData.phone) : undefined,
      });
    } catch {
      localStorage.removeItem("auth_user");
      return null;
    }
  }

  private persistSession(user: User): void {
    const userData = {
      email: user.getEmail()?.getValue(),
      id: user.getId(),
      name: user.getName(),
      phone: user.getPhone()?.getValue(),
    };

    localStorage.setItem("auth_user", JSON.stringify(userData));
  }

  private async simulateDelay(): Promise<void> {
    const delay = Math.random() * 1000 + 500;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
