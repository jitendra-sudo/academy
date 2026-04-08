// POST /api/auth/login
// Validates admin credentials and returns auth token
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

    // Compare against env vars (in prod: use hashed passwords + DB lookup)
    const validUsername = process.env.ADMIN_USERNAME || "admin";
    const validPassword = process.env.ADMIN_PASSWORD || "shankar@2026";

    if (username !== validUsername || password !== validPassword) {
      return Response.json(
        { success: false, error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // In production: generate a real JWT token
    // const token = jwt.sign({ username, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "8h" });

    const mockToken = Buffer.from(`${username}:${Date.now()}`).toString("base64");

    return Response.json({
      success: true,
      token: mockToken,
      user: {
        username,
        role: "admin",
        name: "Admin User",
      },
      expiresIn: "8h",
    });
  } catch (error) {
    console.error("[Auth API Error]", error);
    return Response.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}
