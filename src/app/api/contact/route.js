// POST /api/contact
// Handles contact form submissions from the website
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, message, course, city } = body;

    // Basic validation
    if (!name || !phone) {
      return Response.json(
        { success: false, error: "Name and phone are required." },
        { status: 400 }
      );
    }

    // Sanitize
    const enquiry = {
      id: `ENQ-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || "",
      course: course?.trim() || "Not specified",
      city: city?.trim() || "Not specified",
      message: message?.trim() || "",
      submittedAt: new Date().toISOString(),
      status: "new",
    };

    // In production: save to MongoDB and send email
    // Example:
    // await db.collection("enquiries").insertOne(enquiry);
    // await sendMail({ to: process.env.ADMIN_EMAIL, subject: "New Enquiry", body: ... });

    console.log("[Contact Enquiry]", enquiry);

    return Response.json({
      success: true,
      message: "Thank you! We'll contact you within 24 hours.",
      enquiryId: enquiry.id,
    });
  } catch (error) {
    console.error("[Contact API Error]", error);
    return Response.json(
      { success: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}

// GET /api/contact — health check
export async function GET() {
  return Response.json({
    status: "ok",
    endpoint: "POST /api/contact",
    description: "Submit contact/admission enquiry",
    fields: ["name*", "phone*", "email", "course", "city", "message"],
  });
}
