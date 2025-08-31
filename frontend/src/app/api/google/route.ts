import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { id_token } = await req.json();

  const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token }),
  });

  const data = await r.json();
  const res = NextResponse.json(data, { status: r.status });

  if (r.ok && data.token) {
    res.cookies.set({
      name: "token",
      value: data.token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  }
  return res;
}