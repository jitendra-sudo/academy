import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_FILE = join(process.cwd(), "src/data/courses.json");

function readCourses() {
  try { return JSON.parse(readFileSync(DATA_FILE, "utf-8")); }
  catch { return []; }
}
function writeCourses(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// GET all courses
export async function GET() {
  return Response.json({ success: true, data: readCourses() });
}

// POST — add new category
export async function POST(request) {
  try {
    const body = await request.json();
    const { category, items = [], color, accent, textAccent, dot } = body;
    if (!category) return Response.json({ success: false, error: "category required." }, { status: 400 });
    const courses = readCourses();
    const newCat = {
      id: Date.now(),
      category,
      color: color || "bg-gray-50 border-gray-200",
      accent: accent || "bg-gray-700",
      textAccent: textAccent || "text-gray-700",
      dot: dot || "bg-gray-600",
      items,
    };
    courses.push(newCat);
    writeCourses(courses);
    return Response.json({ success: true, data: newCat }, { status: 201 });
  } catch {
    return Response.json({ success: false, error: "Failed to create course category." }, { status: 500 });
  }
}

// PUT — update entire category
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return Response.json({ success: false, error: "id required." }, { status: 400 });
    const courses = readCourses();
    const idx = courses.findIndex((c) => c.id === id);
    if (idx === -1) return Response.json({ success: false, error: "Category not found." }, { status: 404 });
    courses[idx] = { ...courses[idx], ...updates };
    writeCourses(courses);
    return Response.json({ success: true, data: courses[idx] });
  } catch {
    return Response.json({ success: false, error: "Failed to update." }, { status: 500 });
  }
}

// DELETE — remove category by id
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id"));
    if (!id) return Response.json({ success: false, error: "id required." }, { status: 400 });
    let courses = readCourses();
    courses = courses.filter((c) => c.id !== id);
    writeCourses(courses);
    return Response.json({ success: true, message: "Deleted." });
  } catch {
    return Response.json({ success: false, error: "Failed to delete." }, { status: 500 });
  }
}
