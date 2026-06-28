import { NextRequest, NextResponse } from "next/server";

import { MOCK_CONFIG } from "#shared/infrastructure/config/mock.config";
import {
  findMockTransactionsByUserId,
  MockTransactionData,
} from "#shared/infrastructure/mocks";

import { transfersStorage } from "./storage";

interface CreateTransferRequest {
  amount: number;
  description: string;
  recipientId: string;
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

    const shouldFail =
      Math.random() > MOCK_CONFIG.errorRates.transfers.getTransfers.SUCCESS;

    if (shouldFail) {
      return NextResponse.json(
        {
          error: "FETCH_FAILED",
          message: "Failed to fetch transfers",
        },
        { status: 500 }
      );
    }

    const transfers = findMockTransactionsByUserId(userId);

    return NextResponse.json(transfers, { status: 200 });
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
    const body = (await request.json()) as CreateTransferRequest;
    const { amount, description, recipientId, userId } = body;

    if (!userId || !recipientId || !amount) {
      return NextResponse.json(
        {
          error: "BAD_REQUEST",
          message: "userId, recipientId, and amount are required",
        },
        { status: 400 }
      );
    }

    if (!description || description.trim() === "") {
      return NextResponse.json(
        {
          error: "BAD_REQUEST",
          message: "description is required and cannot be empty",
        },
        { status: 400 }
      );
    }

    const delay =
      Math.random() * (MOCK_CONFIG.delays.max - MOCK_CONFIG.delays.min) +
      MOCK_CONFIG.delays.min;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const transferId = `transfer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const newTransfer: MockTransactionData = {
      amount,
      date: new Date().toISOString(),
      description,
      id: transferId,
      recipientId,
      status: "pending",
      type: "expense",
      userId,
    };

    // Store the transfer in memory for later retrieval
    transfersStorage.set(transferId, newTransfer);

    return NextResponse.json(newTransfer, { status: 201 });
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
