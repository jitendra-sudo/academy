import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const FILE = join(process.cwd(), "src/data/achievers.json");
const read = () => { try { return JSON.parse(readFileSync(FILE, "utf-8")); } catch { return []; } };
const write = (d) => writeFileSync(FILE, JSON.stringify(d, null, 2), "utf-8");

export async function GET() {
  return Response.json({ success: true, data: read() });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, rank, course, year, exam } = body;
    if (!name || !rank) return Response.json({ success: false, error: "name and rank required." }, { status: 400 });
    const list = read();
    const item = { id: Date.now(), name: name.trim(), rank: rank.trim(), course: course?.trim() || "", year: year?.trim() || "", exam: exam?.trim() || "UPSC CSE" };
    list.unshift(item);
    write(list);
    return Response.json({ success: true, data: item }, { status: 201 });
  } catch { return Response.json({ success: false, error: "Failed." }, { status: 500 }); }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return Response.json({ success: false, error: "id required." }, { status: 400 });
    const list = read();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return Response.json({ success: false, error: "Not found." }, { status: 404 });
    list[idx] = { ...list[idx], ...updates };
    write(list);
    return Response.json({ success: true, data: list[idx] });
  } catch { return Response.json({ success: false, error: "Failed." }, { status: 500 }); }
}

export async function DELETE(request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get("id"));
    if (!id) return Response.json({ success: false, error: "id required." }, { status: 400 });
    write(read().filter((a) => a.id !== id));
    return Response.json({ success: true, message: "Deleted." });
  } catch { return Response.json({ success: false, error: "Failed." }, { status: 500 }); }
}
