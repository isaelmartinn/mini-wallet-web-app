import { NextRequest, NextResponse } from "next/server";

import { MOCK_CONFIG } from "#shared/infrastructure/config/mock.config";
import { findMockUserById } from "#shared/infrastructure/mocks";

interface ProfileResponse {
  fullName: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          error: "BAD_REQUEST",
          message: "userId is required",
        },
        { status: 400 }
      );
    }

    const delay =
      Math.random() * (MOCK_CONFIG.delays.max - MOCK_CONFIG.delays.min) +
      MOCK_CONFIG.delays.min;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const user = findMockUserById(userId);

    if (!user) {
      return NextResponse.json(
        {
          error: "NOT_FOUND",
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const response: ProfileResponse = {
      fullName: user.wallet.fullName,
    };

    return NextResponse.json(response, { status: 200 });
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
