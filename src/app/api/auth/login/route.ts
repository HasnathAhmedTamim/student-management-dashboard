import { NextResponse } from "next/server";
import { AUTH_COOKIE, createSessionToken, getAuthCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };

    const { username, password } = getAuthCredentials();

    if (
      !body.username?.trim() ||
      !body.password ||
      body.username.trim() !== username ||
      body.password !== password
    ) {
      return NextResponse.json(
        { message: "Invalid username or password." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ message: "Logged in successfully." });
    response.cookies.set(AUTH_COOKIE, createSessionToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Unable to log in. Please try again." },
      { status: 500 },
    );
  }
}
