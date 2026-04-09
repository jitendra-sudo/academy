import { readFileSync } from "fs";
import { join } from "path";

// Read override credentials (set via Admin Panel > Account Settings)
function getEffectiveCreds() {
  try {
    const stored = JSON.parse(readFileSync(join(process.cwd(), "src/data/credentials.json"), "utf-8"));
    return {
      username: stored.username || process.env.ADMIN_USERNAME || "admin",
      password: stored.passwordHash || process.env.ADMIN_PASSWORD || "shankar@2026",
    };
  } catch {
    return {
      username: process.env.ADMIN_USERNAME || "admin",
      password: process.env.ADMIN_PASSWORD || "shankar@2026",
    };
  }
}

// POST /api/auth/login
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return Response.json(
        { success: false, error: "Username and password are required." },
        { status: 400 }
      );
    }

    const creds = getEffectiveCreds();

    if (username !== creds.username || password !== creds.password) {
      return Response.json(
        { success: false, error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Generate a simple token (use proper JWT in production)
    const token = Buffer.from(`${username}:${Date.now()}:${process.env.JWT_SECRET || "dev"}`).toString("base64");

    return Response.json({
      success: true,
      token,
      user: { username, role: "admin", name: "Admin User" },
      expiresIn: "8h",
    });
  } catch (error) {
    console.error("[Auth API Error]", error);
    return Response.json({ success: false, error: "Server error." }, { status: 500 });
  }
}
