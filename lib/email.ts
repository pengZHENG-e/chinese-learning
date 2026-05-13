import { Resend } from "resend";

const DEFAULT_FROM = "学中文 <onboarding@resend.dev>";

let _client: Resend | null = null;

function getResend(): Resend | null {
  if (_client) return _client;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  _client = new Resend(key);
  return _client;
}

export function emailEnabled(): boolean {
  return !!process.env.RESEND_API_KEY;
}

export async function sendMagicLink(email: string, link: string): Promise<void> {
  const resend = getResend();
  if (!resend) throw new Error("RESEND_API_KEY not set");

  const from = process.env.EMAIL_FROM || DEFAULT_FROM;
  await resend.emails.send({
    from,
    to: email,
    subject: "Your sign-in link for 学中文",
    html: `
<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#18181b;">
  <h2 style="margin:0 0 16px;color:#ea580c;">学中文 · Sign in</h2>
  <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">
    Click the button below to sign in. This link expires in 15 minutes and can only be used once.
  </p>
  <p style="margin:24px 0;">
    <a href="${link}" style="display:inline-block;background:#ea580c;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600;">
      Sign in to 学中文
    </a>
  </p>
  <p style="margin:0;font-size:13px;color:#71717a;">
    If you didn't request this, you can ignore this email.
  </p>
  <hr style="margin:24px 0;border:none;border-top:1px solid #e4e4e7;" />
  <p style="margin:0;font-size:12px;color:#a1a1aa;word-break:break-all;">
    Or paste this link into your browser:<br/>${link}
  </p>
</div>
    `.trim(),
  });
}
