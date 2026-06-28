import { User } from "#auth/session/domain";
import { AuthRepository as AuthRepositoryInterface } from "#auth/session/domain/repositories";
import { Email, Phone } from "#shared/domain/value-objects";
import { HttpClient, HttpError } from "#shared/infrastructure";

interface StoredUserData {
  email?: string;
  id: string;
  name: string;
  phone?: string;
}

interface UserResponse {
  email: string;
  id: string;
  name: string;
  phone: string;
}

export class AuthRepository implements AuthRepositoryInterface {
  private readonly httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }
  async clearSession(): Promise<void> {
    localStorage.removeItem("auth_user");
  }

  async findByCredential(credential: Email | Phone): Promise<null | User> {
    try {
      const response = await this.httpClient.post<UserResponse>(
        "/api/auth/login",
        {
          credential: credential.getValue(),
        }
      );

      const user = User.create({
        email: response.email ? Email.create(response.email) : undefined,
        id: response.id,
        name: response.name,
        phone: response.phone ? Phone.create(response.phone) : undefined,
      });

      this.persistSession(user);

      return user;
    } catch (error) {
      if (error instanceof HttpError && error.status === 401) {
        return null;
      }
      throw error;
    }
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
}
