import { NextResponse } from "next/server";
import { compileMDX } from "@/lib/mdx";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    });

    if (!verifyRes.ok) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { markdown } = await request.json();
    const compiled = await compileMDX(markdown || "");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { renderToStaticMarkup } = require("react-dom/server");
    const html = renderToStaticMarkup(compiled.content);
    return NextResponse.json({ html });
  } catch (error: unknown) {
    console.error("Preview compile error:", error);
    return NextResponse.json(
      { error: "Failed to compile markdown preview" },
      { status: 500 }
    );
  }
}

