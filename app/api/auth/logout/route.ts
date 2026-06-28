import { NextResponse } from "next/server";

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json(null, { status: 204 });
}
