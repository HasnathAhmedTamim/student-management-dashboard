import { NextResponse } from "next/server";
import { AUTH_COOKIE, createSessionToken, getAuthCredentials } from "@/lib/auth";
import { AUTH_MESSAGES } from "@/lib/messages";

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
        { message: AUTH_MESSAGES.invalidCredentials },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ message: AUTH_MESSAGES.loggedIn });
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
      { message: AUTH_MESSAGES.loginFailed },
      { status: 500 },
    );
  }
}
