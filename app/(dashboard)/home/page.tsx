"use client";

import { useAuthStore } from "#auth/session/infrastructure/store";
import { HomePage } from "#wallet/infrastructure/ui/pages";

export default function HomeRoute() {
  return <HomePage authStore={useAuthStore} />;
}
