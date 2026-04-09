/**
 * GET /api/contact-numbers
 * Returns the raw .env phone & WhatsApp defaults.
 * Used by admin panel to show env-sourced values and power "Reset to .env" button.
 * This route is server-only — never called from public pages.
 */
export async function GET() {
  return Response.json({
    success: true,
    envDefaults: {
      upscPhone:   process.env.PHONE_UPSC_1   || "",
      upscPhone2:  process.env.PHONE_UPSC_2   || "",
      tnpscPhone:  process.env.PHONE_TNPSC_1  || "",
      tnpscPhone2: process.env.PHONE_TNPSC_2  || "",
      whatsapp:    process.env.WHATSAPP_NUMBER || "",
    },
  });
}
