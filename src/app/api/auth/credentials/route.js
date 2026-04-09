import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const CREDS_FILE = join(process.cwd(), "src/data/credentials.json");

function readCreds() {
  try { return JSON.parse(readFileSync(CREDS_FILE, "utf-8")); }
  catch { return { username: "", passwordHash: "" }; }
}

function writeCreds(data) {
  writeFileSync(CREDS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Returns effective credentials (override file takes priority over .env)
export function getEffectiveCreds() {
  const stored = readCreds();
  return {
    username: stored.username || process.env.ADMIN_USERNAME || "admin",
    password: stored.passwordHash || process.env.ADMIN_PASSWORD || "shankar@2026",
  };
}

// POST /api/auth/credentials
// Body: { currentPassword, newUsername?, newPassword? }
export async function POST(request) {
  try {
    const body = await request.json();
    const { currentPassword, newUsername, newPassword } = body;

    if (!currentPassword) {
      return Response.json({ success: false, error: "Current password is required." }, { status: 400 });
    }

    const creds = getEffectiveCreds();

    // Verify current password
    if (currentPassword !== creds.password) {
      return Response.json({ success: false, error: "Current password is incorrect." }, { status: 401 });
    }

    // Must provide at least one thing to change
    if (!newUsername && !newPassword) {
      return Response.json({ success: false, error: "Provide a new username or password." }, { status: 400 });
    }

    // Validate new password strength
    if (newPassword && newPassword.length < 8) {
      return Response.json({ success: false, error: "New password must be at least 8 characters." }, { status: 400 });
    }

    // Save overrides
    const stored = readCreds();
    if (newUsername) stored.username = newUsername.trim();
    if (newPassword) stored.passwordHash = newPassword;
    writeCreds(stored);

    const changed = [];
    if (newUsername) changed.push("username");
    if (newPassword) changed.push("password");

    return Response.json({
      success: true,
      message: `Successfully updated: ${changed.join(" and ")}.`,
      username: stored.username || process.env.ADMIN_USERNAME,
    });
  } catch (error) {
    return Response.json({ success: false, error: "Server error." }, { status: 500 });
  }
}

// GET /api/auth/credentials — get current username (not password)
export async function GET() {
  const creds = getEffectiveCreds();
  return Response.json({ success: true, username: creds.username });
}
