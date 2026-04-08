// GET /api/admissions — list all (admin only, add token check in prod)
// POST /api/admissions — create new admission record

// In-memory store for demo (use MongoDB in production)
const admissions = [
  { id: "ADM001", name: "Priya Sharma", course: "UPSC Foundation 2026", city: "Chennai", phone: "9876543210", status: "Confirmed", createdAt: "2026-04-08" },
  { id: "ADM002", name: "Rahul Gupta", course: "Prelims Test Series 2026", city: "Delhi", phone: "9123456789", status: "Pending", createdAt: "2026-04-07" },
  { id: "ADM003", name: "Ananya Nair", course: "TNPSC Group I", city: "Thiruvananthapuram", phone: "9988776655", status: "Confirmed", createdAt: "2026-04-07" },
  { id: "ADM004", name: "Arjun Kumar", course: "UPSC Optional 2026", city: "Bengaluru", phone: "9871234560", status: "Under Review", createdAt: "2026-04-06" },
  { id: "ADM005", name: "Meena Devi", course: "Mains Test Series", city: "Chennai", phone: "9765432100", status: "Confirmed", createdAt: "2026-04-06" },
  { id: "ADM006", name: "Suresh R", course: "TNPSC Group II/IIA", city: "Madurai", phone: "9654321000", status: "Pending", createdAt: "2026-04-05" },
];

export async function GET(request) {
  // In production: verify Bearer token from Authorization header
  // const token = request.headers.get("Authorization")?.split(" ")[1];
  // if (!verifyToken(token)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("q")?.toLowerCase();

  let results = [...admissions];

  if (status && status !== "all") {
    results = results.filter((a) => a.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    results = results.filter(
      (a) =>
        a.name.toLowerCase().includes(search) ||
        a.course.toLowerCase().includes(search) ||
        a.city.toLowerCase().includes(search)
    );
  }

  return Response.json({
    success: true,
    total: results.length,
    data: results,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, course, city, message } = body;

    if (!name || !phone || !course) {
      return Response.json(
        { success: false, error: "Name, phone, and course are required." },
        { status: 400 }
      );
    }

    const newAdmission = {
      id: `ADM${String(Date.now()).slice(-6)}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || "",
      course: course.trim(),
      city: city?.trim() || "Not specified",
      message: message?.trim() || "",
      status: "Pending",
      createdAt: new Date().toISOString().split("T")[0],
    };

    // In production: await db.collection("admissions").insertOne(newAdmission);
    admissions.unshift(newAdmission);

    console.log("[New Admission]", newAdmission);

    return Response.json({
      success: true,
      message: "Admission enquiry submitted successfully!",
      data: newAdmission,
    }, { status: 201 });
  } catch (error) {
    console.error("[Admissions POST Error]", error);
    return Response.json(
      { success: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
