import { User } from "#auth/domain/entities";
import { Email, Phone } from "#auth/domain/value-objects";

export interface AuthRepository {
  findByCredential(credential: Email | Phone): Promise<null | User>;
  getStoredSession(): Promise<null | User>;
}
