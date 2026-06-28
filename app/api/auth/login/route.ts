import { NextRequest, NextResponse } from "next/server";

import { MOCK_CONFIG } from "#shared/infrastructure/config/mock.config";
import { MOCK_USERS_DATA } from "#shared/infrastructure/mocks";

interface LoginRequest {
  credential: string;
}

interface UserResponse {
  email: string;
  id: string;
  name: string;
  phone: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as LoginRequest;
    const { credential } = body;

    const delay =
      Math.random() * (MOCK_CONFIG.delays.max - MOCK_CONFIG.delays.min) +
      MOCK_CONFIG.delays.min;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const user = MOCK_USERS_DATA.find(
      (u) =>
        u.email.toLowerCase() === credential.toLowerCase() ||
        u.phone === credential
    );

    if (!user) {
      return NextResponse.json(
        {
          error: "INVALID_CREDENTIALS",
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    const response: UserResponse = {
      email: user.email,
      id: user.id,
      name: user.name,
      phone: user.phone,
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
