import { NextRequest, NextResponse } from "next/server";
import { readNotebooks } from "@/lib/notebookStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ vault_file_id: string }> }
) {
  try {
    const { vault_file_id } = await params;
    const notebooks = readNotebooks();

    // Find the most recently updated notebook with matching vault_file_id
    const matchingNotebooks = notebooks.filter(n => n.vault_file_id === vault_file_id);

    if (matchingNotebooks.length === 0) {
      return NextResponse.json({ detail: "Notebook not found for file" }, { status: 404 });
    }

    // Sort by updated_at descending to get the latest one
    matchingNotebooks.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return NextResponse.json(matchingNotebooks[0]);
  } catch (error: any) {
    console.error("Error loading notebook by file:", error);
    return NextResponse.json({ detail: error.message || "Internal Server Error" }, { status: 500 });
  }
}
