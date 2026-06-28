"use client";

import { useAuthStore } from "#auth/session/infrastructure/store";
import { HomePage } from "#wallet/balance/infrastructure/ui/pages";

export default function HomeRoute() {
  return <HomePage authStore={useAuthStore} />;
}
