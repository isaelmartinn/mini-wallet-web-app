"use client";

import { Suspense } from "react";

import { TransferErrorPage } from "#payments/transfer/infrastructure/ui/pages";

export default function TransferErrorRoute() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TransferErrorPage />
    </Suspense>
  );
}
