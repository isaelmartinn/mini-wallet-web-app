import { NextRequest, NextResponse } from "next/server";

interface UserResponse {
  email?: string;
  id: string;
  name: string;
  phone?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authCookie = request.cookies.get("auth-storage")?.value;

    if (!authCookie) {
      return NextResponse.json(
        {
          error: "UNAUTHORIZED",
          message: "No active session",
        },
        { status: 401 }
      );
    }

    const authData = JSON.parse(authCookie);
    const user = authData?.state?.user;

    if (!user) {
      return NextResponse.json(
        {
          error: "UNAUTHORIZED",
          message: "No active session",
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
