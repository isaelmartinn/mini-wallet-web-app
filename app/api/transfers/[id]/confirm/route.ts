import { NextRequest, NextResponse } from "next/server";

import { MOCK_CONFIG } from "#shared/infrastructure/config/mock.config";
import {
  MOCK_USERS_DATA,
  MockTransactionData,
} from "#shared/infrastructure/mocks";

interface ConfirmTransferResponse {
  success: boolean;
  transfer: MockTransactionData;
}

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;

    const delay =
      Math.random() * (MOCK_CONFIG.delays.max - MOCK_CONFIG.delays.min) +
      MOCK_CONFIG.delays.min;
    await new Promise((resolve) => setTimeout(resolve, delay));

    let transfer: MockTransactionData | undefined;

    for (const user of MOCK_USERS_DATA) {
      const found = user.transactions.find((t) => t.id === id);
      if (found) {
        transfer = found;
        break;
      }
    }

    if (!transfer) {
      return NextResponse.json(
        {
          error: "NOT_FOUND",
          message: "Transfer not found",
        },
        { status: 404 }
      );
    }

    if (transfer.status === "success") {
      const response: ConfirmTransferResponse = {
        success: true,
        transfer,
      };
      return NextResponse.json(response, { status: 200 });
    }

    const random = Math.random();
    const scenarios = MOCK_CONFIG.errorRates.transfers.confirmTransfer;

    let cumulative = 0;

    cumulative += scenarios.SUCCESS;
    if (random < cumulative) {
      const confirmedTransfer: MockTransactionData = {
        ...transfer,
        status: "success",
      };

      const response: ConfirmTransferResponse = {
        success: true,
        transfer: confirmedTransfer,
      };

      return NextResponse.json(response, { status: 200 });
    }

    cumulative += scenarios.NETWORK_ERROR;
    if (random < cumulative) {
      return NextResponse.json(
        {
          error: "NETWORK_ERROR",
          message: "Network error occurred",
        },
        { status: 500 }
      );
    }

    cumulative += scenarios.INSUFFICIENT_FUNDS;
    if (random < cumulative) {
      return NextResponse.json(
        {
          error: "INSUFFICIENT_FUNDS",
          message: "Insufficient balance",
        },
        { status: 400 }
      );
    }

    cumulative += scenarios.TIMEOUT;
    if (random < cumulative) {
      return NextResponse.json(
        {
          error: "TIMEOUT",
          message: "Request timeout",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        error: "UNKNOWN_ERROR",
        message: "Unknown error occurred",
      },
      { status: 500 }
    );
  } catch {
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
