"use client";

import { ContactRepository } from "#payments/contact/infrastructure/repositories";
import { AddContactPage } from "#payments/contact/infrastructure/ui/pages";

export default function NewContactPage() {
  const contactRepository = new ContactRepository();

  return <AddContactPage contactRepository={contactRepository} />;
}
