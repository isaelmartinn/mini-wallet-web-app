import { NextRequest, NextResponse } from "next/server";

import { MOCK_CONFIG } from "#shared/infrastructure/config/mock.config";
import { MOCK_USERS_DATA } from "#shared/infrastructure/mocks";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;

    const delay =
      Math.random() * (MOCK_CONFIG.delays.max - MOCK_CONFIG.delays.min) +
      MOCK_CONFIG.delays.min;
    await new Promise((resolve) => setTimeout(resolve, delay));

    for (const user of MOCK_USERS_DATA) {
      const transfer = user.transactions.find((t) => t.id === id);
      if (transfer) {
        return NextResponse.json(transfer, { status: 200 });
      }
    }

    return NextResponse.json(
      {
        error: "NOT_FOUND",
        message: "Transfer not found",
      },
      { status: 404 }
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
