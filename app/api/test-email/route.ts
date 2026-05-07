import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.AUTH_RESEND_KEY;
  const from = process.env.EMAIL_FROM;
  const url = process.env.NEXTAUTH_URL;

  if (!key) {
    return NextResponse.json({ error: "AUTH_RESEND_KEY is not set" }, { status: 500 });
  }

  // Try sending a test email via Resend API directly
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: from ?? "onboarding@resend.dev",
        to: "rodynaine@gmail.com",
        subject: "Magic link test",
        html: "<p>This is a test email from your blog. If you see this, Resend is working!</p>",
      }),
    });

    const data = await res.json();

    return NextResponse.json({
      status: res.status,
      ok: res.ok,
      resendResponse: data,
      config: {
        keyPrefix: key.substring(0, 8) + "...",
        from,
        nextauthUrl: url,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
