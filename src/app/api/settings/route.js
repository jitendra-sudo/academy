import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_FILE = join(process.cwd(), "src/data/settings.json");

function readSettings() {
  try {
    return JSON.parse(readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeSettings(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ─── Inject .env phone/WhatsApp defaults into contact section ────────────────
// If admin hasn't overridden a field yet, the .env value is used as the default.
function mergeEnvContactDefaults(settings) {
  const envDefaults = {
    upscPhone:   process.env.PHONE_UPSC_1    || "",
    upscPhone2:  process.env.PHONE_UPSC_2    || "",
    tnpscPhone:  process.env.PHONE_TNPSC_1   || "",
    tnpscPhone2: process.env.PHONE_TNPSC_2   || "",
    whatsapp:    process.env.WHATSAPP_NUMBER  || "",
  };

  const contact = { ...(settings.contact || {}) };

  // Only fill in env value when the JSON field is blank / missing
  Object.entries(envDefaults).forEach(([key, envVal]) => {
    if (!contact[key] && envVal) contact[key] = envVal;
  });

  return { ...settings, contact };
}

// GET /api/settings — return all settings (with .env contact defaults merged)
export async function GET() {
  try {
    const raw = readSettings();
    const settings = mergeEnvContactDefaults(raw);
    return Response.json({ success: true, data: settings });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to load settings." }, { status: 500 });
  }
}

// PUT /api/settings — update a section or entire settings
// Body: { section: "site" | "contact" | "social" | "stats" | "branches" | "govtPartners", data: {...} }
export async function PUT(request) {
  try {
    const body = await request.json();
    const { section, data } = body;

    if (!section || data === undefined) {
      return Response.json({ success: false, error: "section and data are required." }, { status: 400 });
    }

    const settings = readSettings();

    // Deep merge the section
    if (section === "all") {
      // Replace entire settings
      writeSettings(data);
    } else {
      settings[section] = data;
      writeSettings(settings);
    }

    // Always return merged-with-env version so frontend stays consistent
    const merged = mergeEnvContactDefaults(settings);
    return Response.json({ success: true, message: `${section} settings updated successfully.`, data: merged });
  } catch (error) {
    console.error("[Settings PUT Error]", error);
    return Response.json({ success: false, error: "Failed to save settings." }, { status: 500 });
  }
}

// PATCH /api/settings — update specific fields within a section
// Body: { section: "site", field: "name", value: "New Name" }
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { section, field, value } = body;

    if (!section || !field) {
      return Response.json({ success: false, error: "section and field are required." }, { status: 400 });
    }

    const settings = readSettings();
    if (!settings[section]) settings[section] = {};
    settings[section][field] = value;
    writeSettings(settings);

    return Response.json({ success: true, message: `${section}.${field} updated.`, data: settings[section] });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update setting." }, { status: 500 });
  }
}
