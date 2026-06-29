import { NextRequest, NextResponse } from "next/server";

import { MOCK_CONFIG } from "#shared/infrastructure/config/mock.config";
import {
  findMockContactsByUserId,
  MockContactData,
} from "#shared/infrastructure/mocks";

interface CreateContactRequest {
  email: string;
  id: string;
  isFavorite: boolean;
  name: string;
  phone: string;
  userId: string;
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

    const contacts = findMockContactsByUserId(userId);

    return NextResponse.json(contacts, { status: 200 });
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as CreateContactRequest;
    const { email, id, isFavorite, name, phone } = body;

    if (!id) {
      return NextResponse.json(
        {
          error: "BAD_REQUEST",
          message: "id is required",
        },
        { status: 400 }
      );
    }

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        {
          error: "BAD_REQUEST",
          message: "name and at least one of email or phone are required",
        },
        { status: 400 }
      );
    }

    const delay =
      Math.random() * (MOCK_CONFIG.delays.max - MOCK_CONFIG.delays.min) +
      MOCK_CONFIG.delays.min;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const newContact: MockContactData = {
      email: email || "",
      id: id,
      isFavorite: isFavorite || false,
      name,
      phone: phone || "",
    };

    return NextResponse.json(newContact, { status: 201 });
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
