import { Contact } from "#transactions/domain/entities";

export interface AddContactParams {
  email: string;
  isFavorite: boolean;
  name: string;
  phone: string;
}

export interface AddContactUseCase {
  execute(params: AddContactParams): Promise<Contact>;
}
