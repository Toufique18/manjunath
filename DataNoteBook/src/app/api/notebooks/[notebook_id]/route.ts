import { NextRequest, NextResponse } from "next/server";
import { readNotebooks } from "@/lib/notebookStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ notebook_id: string }> }
) {
  try {
    const { notebook_id } = await params;
    const notebooks = readNotebooks();

    const notebook = notebooks.find(n => n.notebook_id === notebook_id);

    if (!notebook) {
      return NextResponse.json({ detail: "Notebook not found" }, { status: 404 });
    }

    return NextResponse.json(notebook);
  } catch (error: any) {
    console.error("Error loading notebook:", error);
    return NextResponse.json({ detail: error.message || "Internal Server Error" }, { status: 500 });
  }
}
