import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Proposal submissions are now closed. The submission deadline has passed.",
    },
    { status: 403 }
  );
}