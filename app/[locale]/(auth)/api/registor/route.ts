import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch("https://tajwork.softclub.tj/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // ----- Безопасный парсинг -----
    let data: any;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text }; // если не json
    }
    // ------------------------------

    return NextResponse.json(data, { status: res.status });

  } catch (err: any) {
    return NextResponse.json(
      { message: err.message ?? "Server error" },
      { status: 500 }
    );
  }
}
