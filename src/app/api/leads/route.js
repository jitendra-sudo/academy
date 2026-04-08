import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const FILE = join(process.cwd(), "src/data/leads.json");

function readLeads() {
  try { return JSON.parse(readFileSync(FILE, "utf-8")); }
  catch { return []; }
}

function writeLeads(data) {
  writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ─── GET /api/leads ─────────────────────────────────────────────────────────
// Query params: ?status=new|contacted|converted|lost&source=admission|contact|whatsapp&q=search
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const source = searchParams.get("source");
    const q = searchParams.get("q")?.toLowerCase();

    let leads = readLeads();

    if (status && status !== "all") leads = leads.filter((l) => l.status === status);
    if (source && source !== "all") leads = leads.filter((l) => l.source === source);
    if (q) leads = leads.filter((l) =>
      l.name?.toLowerCase().includes(q) ||
      l.phone?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.course?.toLowerCase().includes(q) ||
      l.city?.toLowerCase().includes(q)
    );

    return Response.json({
      success: true,
      total: leads.length,
      new: leads.filter((l) => l.status === "new").length,
      contacted: leads.filter((l) => l.status === "contacted").length,
      converted: leads.filter((l) => l.status === "converted").length,
      data: leads,
    });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to load leads." }, { status: 500 });
  }
}

// ─── POST /api/leads ─────────────────────────────────────────────────────────
// Create new lead from any form on the website
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, course, city, message, source = "admission" } = body;

    if (!name?.trim() || !phone?.trim()) {
      return Response.json(
        { success: false, error: "Name and phone number are required." },
        { status: 400 }
      );
    }

    const leads = readLeads();

    const newLead = {
      id: `LEAD-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || "",
      course: course?.trim() || "Not specified",
      city: city?.trim() || "Not specified",
      message: message?.trim() || "",
      source,          // "admission" | "contact-modal" | "whatsapp" | "website"
      status: "new",   // "new" | "contacted" | "converted" | "lost"
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    leads.unshift(newLead); // newest first
    writeLeads(leads);

    console.log(`[New Lead] ${newLead.id} — ${newLead.name} (${newLead.phone}) via ${newLead.source}`);

    return Response.json({
      success: true,
      message: "Thank you! We'll contact you within 24 hours.",
      leadId: newLead.id,
    }, { status: 201 });
  } catch (error) {
    console.error("[Leads POST Error]", error);
    return Response.json({ success: false, error: "Server error. Please try again." }, { status: 500 });
  }
}

// ─── PATCH /api/leads ────────────────────────────────────────────────────────
// Update lead status or notes
// Body: { id, status?, notes? }
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) return Response.json({ success: false, error: "id is required." }, { status: 400 });

    const leads = readLeads();
    const idx = leads.findIndex((l) => l.id === id);
    if (idx === -1) return Response.json({ success: false, error: "Lead not found." }, { status: 404 });

    if (status !== undefined) leads[idx].status = status;
    if (notes !== undefined) leads[idx].notes = notes;
    leads[idx].updatedAt = new Date().toISOString();

    writeLeads(leads);
    return Response.json({ success: true, data: leads[idx] });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update lead." }, { status: 500 });
  }
}

// ─── DELETE /api/leads ───────────────────────────────────────────────────────
export async function DELETE(request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return Response.json({ success: false, error: "id required." }, { status: 400 });
    writeLeads(readLeads().filter((l) => l.id !== id));
    return Response.json({ success: true, message: "Lead deleted." });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to delete." }, { status: 500 });
  }
}
