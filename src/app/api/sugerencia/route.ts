import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? 'jowito2000@gmail.com';

function buildEmailHtml(data: Record<string, string>): string {
  const fecha = new Date().toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });

  const row = (label: string, value: string | undefined, isLong = false) =>
    value
      ? `<tr>
          <td style="padding:10px 16px;font-size:0.78rem;font-weight:600;color:#9a9a9a;text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap;vertical-align:top;border-bottom:1px solid rgba(212,168,67,0.1);">${label}</td>
          <td style="padding:10px 16px;font-size:0.9rem;color:#e8e6e3;vertical-align:top;border-bottom:1px solid rgba(212,168,67,0.1);${isLong ? 'white-space:pre-wrap;' : ''}">${value}</td>
        </tr>`
      : '';

  const isCharacter = data.contextoTipo === 'character';
  const badge = isCharacter
    ? `<span style="background:rgba(212,168,67,0.15);color:#d4a843;padding:4px 12px;border-radius:20px;font-size:0.75rem;font-weight:600;letter-spacing:0.1em;">PERSONAJE</span>`
    : `<span style="background:rgba(8,145,178,0.15);color:#38bdf8;padding:4px 12px;border-radius:20px;font-size:0.75rem;font-weight:600;letter-spacing:0.1em;">ÁRBOL GENEALÓGICO</span>`;

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"/><title>Sugerencia Olimpo</title></head>
<body style="margin:0;padding:24px;background:#07070f;font-family:'Georgia',serif;">
  <div style="max-width:620px;margin:0 auto;">

    <div style="text-align:center;padding:32px 0 24px;">
      <div style="font-size:2rem;margin-bottom:8px;">⚡</div>
      <h1 style="margin:0;color:#d4a843;font-size:1.4rem;letter-spacing:0.05em;">OLIMPO — Nueva Sugerencia</h1>
      <p style="margin:8px 0 0;color:#5a5a6e;font-size:0.82rem;">${fecha}</p>
    </div>

    <div style="background:#1a1a2e;border:1px solid rgba(212,168,67,0.25);border-radius:12px;overflow:hidden;">

      <div style="padding:20px 24px;border-bottom:1px solid rgba(212,168,67,0.15);display:flex;align-items:center;gap:12px;justify-content:space-between;">
        <div>
          <div style="margin-bottom:4px;">${badge}</div>
          <div style="color:#e8e6e3;font-size:1.1rem;font-weight:600;margin-top:8px;">${data.contextoNombre}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.75rem;color:#5a5a6e;margin-bottom:2px;">Tipo</div>
          <div style="color:#f0d47a;font-size:0.85rem;">${data.tipo}</div>
        </div>
      </div>

      <table style="width:100%;border-collapse:collapse;">
        ${row('Campo / Aspecto', data.campo)}
        ${row('Sugerencia', data.sugerencia, true)}
        ${row('Fuente', data.fuente)}
        ${row('URL de la fuente', data.urlFuente ? `<a href="${data.urlFuente}" style="color:#d4a843;">${data.urlFuente}</a>` : '')}
        ${row('Notas adicionales', data.notas, true)}
      </table>

      ${(data.nombre || data.emailContacto) ? `
      <div style="padding:16px 24px;background:rgba(255,255,255,0.02);border-top:1px solid rgba(212,168,67,0.1);">
        <div style="font-size:0.75rem;color:#5a5a6e;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.08em;">Remitente</div>
        ${data.nombre ? `<div style="color:#e8e6e3;font-size:0.9rem;">${data.nombre}</div>` : ''}
        ${data.emailContacto ? `<div style="color:#d4a843;font-size:0.85rem;margin-top:2px;">${data.emailContacto}</div>` : ''}
      </div>` : ''}
    </div>

    <p style="text-align:center;color:#3a3a4e;font-size:0.75rem;margin-top:24px;">
      Sugerencia recibida desde olimpo-mitologia.vercel.app
    </p>
  </div>
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const data = await req.json() as Record<string, string>;

    if (!data.sugerencia?.trim() || !data.fuente?.trim()) {
      return NextResponse.json(
        { error: 'La sugerencia y la fuente son obligatorias.' },
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const subject = `[Olimpo] Sugerencia — ${data.contextoNombre}: ${data.campo || data.tipo}`;

    await transporter.sendMail({
      from: `"Olimpo Sugerencias" <${process.env.SMTP_USER}>`,
      to: CONTACT_EMAIL,
      replyTo: data.emailContacto || undefined,
      subject,
      html: buildEmailHtml(data),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[sugerencia]', err);
    return NextResponse.json(
      { error: 'No se pudo enviar la sugerencia. Inténtalo más tarde.' },
      { status: 500 },
    );
  }
}
