import {
  AlertCircle,
  AlertTriangle,
  Clock,
  CloudOff,
  LucideIcon,
} from "lucide-react";

export interface ErrorStateConfig {
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  showRetryButton: boolean;
  title: string;
}

export type TransferErrorType =
  | "INSUFFICIENT_FUNDS"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNKNOWN_ERROR";

export const ERROR_STATES_CONFIG: Record<TransferErrorType, ErrorStateConfig> =
  {
    INSUFFICIENT_FUNDS: {
      description:
        "No tienes saldo suficiente para completar esta transferencia",
      icon: AlertCircle,
      iconBgColor: "red.50",
      iconColor: "red.500",
      showRetryButton: false,
      title: "Saldo insuficiente",
    },
    NETWORK_ERROR: {
      description:
        "Hubo un problema de conexión. Verifica tu internet e intenta nuevamente",
      icon: CloudOff,
      iconBgColor: "orange.50",
      iconColor: "orange.500",
      showRetryButton: true,
      title: "Error de conexión",
    },
    TIMEOUT: {
      description: "La transferencia tardó demasiado en procesarse",
      icon: Clock,
      iconBgColor: "yellow.50",
      iconColor: "yellow.600",
      showRetryButton: false,
      title: "Tiempo de espera agotado",
    },
    UNKNOWN_ERROR: {
      description:
        "Ocurrió un error inesperado. Por favor, intenta nuevamente más tarde",
      icon: AlertTriangle,
      iconBgColor: "red.50",
      iconColor: "red.500",
      showRetryButton: false,
      title: "Error inesperado",
    },
  };
