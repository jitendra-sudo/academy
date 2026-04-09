import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const FILE = join(process.cwd(), "src/data/lectures.json");

function readLectures() {
  try { return JSON.parse(readFileSync(FILE, "utf-8")); }
  catch { return []; }
}

function writeLectures(data) {
  writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ─── GET /api/lectures ─────────────────────────────────────────────────────────
// Query: ?course=&subject=&q=&isPublic=true|false
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const course = searchParams.get("course");
    const subject = searchParams.get("subject");
    const q = searchParams.get("q")?.toLowerCase();
    const isPublic = searchParams.get("isPublic");

    let lectures = readLectures();

    if (course && course !== "all") lectures = lectures.filter((l) => l.course === course);
    if (subject && subject !== "all") lectures = lectures.filter((l) => l.subject === subject);
    if (isPublic !== null && isPublic !== undefined) {
      const pub = isPublic === "true";
      lectures = lectures.filter((l) => Boolean(l.isPublic) === pub);
    }
    if (q) {
      lectures = lectures.filter((l) =>
        l.title?.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q) ||
        l.course?.toLowerCase().includes(q) ||
        l.subject?.toLowerCase().includes(q) ||
        l.instructor?.toLowerCase().includes(q)
      );
    }

    return Response.json({
      success: true,
      total: lectures.length,
      data: lectures,
    });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to load lectures." }, { status: 500 });
  }
}

// ─── POST /api/lectures ─────────────────────────────────────────────────────────
// Create new lecture entry
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title, description, course, subject, instructor,
      videoUrl, videoType, thumbnailUrl, duration,
      isPublic, isFeatured, order,
    } = body;

    if (!title?.trim() || !videoUrl?.trim()) {
      return Response.json(
        { success: false, error: "Title and video URL are required." },
        { status: 400 }
      );
    }

    const lectures = readLectures();
    const newLecture = {
      id: `LEC-${Date.now()}`,
      title: title.trim(),
      description: description?.trim() || "",
      course: course?.trim() || "General",
      subject: subject?.trim() || "",
      instructor: instructor?.trim() || "",
      videoUrl: videoUrl.trim(),
      videoType: videoType || "upload",   // "upload" | "youtube" | "vimeo" | "drive"
      thumbnailUrl: thumbnailUrl?.trim() || "",
      duration: duration?.trim() || "",
      isPublic: Boolean(isPublic),
      isFeatured: Boolean(isFeatured),
      order: order || lectures.length + 1,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    lectures.unshift(newLecture);
    writeLectures(lectures);

    return Response.json({ success: true, data: newLecture }, { status: 201 });
  } catch (error) {
    console.error("[Lectures POST Error]", error);
    return Response.json({ success: false, error: "Server error." }, { status: 500 });
  }
}

// ─── PUT /api/lectures ─────────────────────────────────────────────────────────
// Full update of a lecture by id
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) return Response.json({ success: false, error: "id required." }, { status: 400 });

    const lectures = readLectures();
    const idx = lectures.findIndex((l) => l.id === id);
    if (idx === -1) return Response.json({ success: false, error: "Lecture not found." }, { status: 404 });

    lectures[idx] = {
      ...lectures[idx],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };

    writeLectures(lectures);
    return Response.json({ success: true, data: lectures[idx] });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update." }, { status: 500 });
  }
}

// ─── PATCH /api/lectures ──────────────────────────────────────────────────────
// Toggle visibility or featured
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, isPublic, isFeatured, views } = body;

    if (!id) return Response.json({ success: false, error: "id required." }, { status: 400 });

    const lectures = readLectures();
    const idx = lectures.findIndex((l) => l.id === id);
    if (idx === -1) return Response.json({ success: false, error: "Not found." }, { status: 404 });

    if (isPublic !== undefined) lectures[idx].isPublic = Boolean(isPublic);
    if (isFeatured !== undefined) lectures[idx].isFeatured = Boolean(isFeatured);
    if (views !== undefined) lectures[idx].views = views;
    lectures[idx].updatedAt = new Date().toISOString();

    writeLectures(lectures);
    return Response.json({ success: true, data: lectures[idx] });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to patch." }, { status: 500 });
  }
}

// ─── DELETE /api/lectures ─────────────────────────────────────────────────────
export async function DELETE(request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return Response.json({ success: false, error: "id required." }, { status: 400 });
    const lectures = readLectures();
    const filtered = lectures.filter((l) => l.id !== id);
    if (filtered.length === lectures.length) {
      return Response.json({ success: false, error: "Lecture not found." }, { status: 404 });
    }
    writeLectures(filtered);
    return Response.json({ success: true, message: "Lecture deleted." });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to delete." }, { status: 500 });
  }
}
