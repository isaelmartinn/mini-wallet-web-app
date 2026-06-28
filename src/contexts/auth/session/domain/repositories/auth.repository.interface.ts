import { User } from "#auth/session/domain/entities";
import { Email, Phone } from "#shared/domain/value-objects";

export interface AuthRepository {
  clearSession(): Promise<void>;
  findByCredential(credential: Email | Phone): Promise<null | User>;
  getStoredSession(): Promise<null | User>;
}
