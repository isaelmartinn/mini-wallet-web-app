"use client";

import { Suspense } from "react";

import { ConfirmationPage } from "#payments/transfer/infrastructure/ui/pages";

export default function ConfirmRoute() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ConfirmationPage />
    </Suspense>
  );
}
