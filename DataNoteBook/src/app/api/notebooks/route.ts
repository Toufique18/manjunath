import { NextRequest, NextResponse } from "next/server";
import { readNotebooks } from "@/lib/notebookStore";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort") || "updated";
    const search = searchParams.get("search") || "";

    let notebooks = readNotebooks();

    // Filter by search query on title
    if (search.trim()) {
      const query = search.toLowerCase();
      notebooks = notebooks.filter(n => (n.title || "").toLowerCase().includes(query));
    }

    // Sort
    if (sort === "title") {
      notebooks.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else {
      // Default to sorting by updated_at descending
      notebooks.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }

    // Map to list format including cell_count
    const notebooksList = notebooks.map(n => ({
      notebook_id: n.notebook_id,
      vault_file_id: n.vault_file_id,
      title: n.title,
      dataset_filename: n.dataset_filename,
      created_at: n.created_at,
      updated_at: n.updated_at,
      cell_count: n.cells ? n.cells.length : 0,
    }));

    return NextResponse.json({ notebooks: notebooksList });
  } catch (error: any) {
    console.error("Error listing notebooks:", error);
    return NextResponse.json({ detail: error.message || "Internal Server Error" }, { status: 500 });
  }
}
