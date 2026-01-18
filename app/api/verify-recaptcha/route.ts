import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { token } = body;

  const verificationResponse = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY!,
        response: token,
      }),
    }
  );

  const verification = await verificationResponse.json();

  if (verification.success) {
    return NextResponse.json({
      success: true,
    });
  } else {
    return NextResponse.json({
      success: false,
      errors: verification["error-codes"],
    });
  }
}
