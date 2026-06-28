export interface TestContact {
  email?: string;
  id: string;
  isFavorite: boolean;
  name: string;
  phone?: string;
}

export const favoriteContactWithPhone: TestContact = {
  id: "contact_001",
  isFavorite: true,
  name: "María García",
  phone: "+5215587654321",
};

export const favoriteContactWithEmail: TestContact = {
  email: "pedro.lopez@example.com",
  id: "contact_002",
  isFavorite: true,
  name: "Pedro López",
};

export const regularContact: TestContact = {
  id: "contact_003",
  isFavorite: false,
  name: "Ana Martínez",
  phone: "+5215523456789",
};

export const contactWithBoth: TestContact = {
  email: "carlos.rodriguez@example.com",
  id: "contact_004",
  isFavorite: true,
  name: "Carlos Rodríguez",
  phone: "+5215534567890",
};

export const favoriteContacts: TestContact[] = [
  favoriteContactWithPhone,
  favoriteContactWithEmail,
  contactWithBoth,
];

export const allTestContacts: TestContact[] = [
  favoriteContactWithPhone,
  favoriteContactWithEmail,
  regularContact,
  contactWithBoth,
  {
    id: "contact_005",
    isFavorite: false,
    name: "Luis Hernández",
    phone: "+5215545678901",
  },
];

export const newContactData = {
  emptyName: {
    name: "",
    phone: "+5215556789012",
  },
  invalidEmail: {
    email: "invalid-email",
    name: "Email Inválido",
  },
  invalidPhone: {
    name: "Contacto Inválido",
    phone: "123456",
  },
  validEmail: {
    email: "nuevo.contacto@example.com",
    name: "Contacto Email",
  },
  validPhone: {
    name: "Nuevo Contacto",
    phone: "+5215556789012",
  },
};
