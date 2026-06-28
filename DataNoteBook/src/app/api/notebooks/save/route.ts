import { NextRequest, NextResponse } from "next/server";
import { readNotebooks, writeNotebooks, Notebook } from "@/lib/notebookStore";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { notebook_id, vault_file_id, title, cells, messages, dataset_filename } = body;

    if (!vault_file_id) {
      return NextResponse.json({ detail: "vault_file_id is required" }, { status: 400 });
    }

    const notebooks = readNotebooks();
    const now = new Date().toISOString();

    let targetId = notebook_id;
    let existingIndex = -1;

    if (targetId) {
      existingIndex = notebooks.findIndex(n => n.notebook_id === targetId);
    } else {
      // Check if we already have a notebook for this vault_file_id to avoid duplicates
      existingIndex = notebooks.findIndex(n => n.vault_file_id === vault_file_id);
      if (existingIndex !== -1) {
        targetId = notebooks[existingIndex].notebook_id;
      }
    }

    if (existingIndex !== -1) {
      // Update existing notebook
      notebooks[existingIndex] = {
        ...notebooks[existingIndex],
        title: title || notebooks[existingIndex].title,
        cells: cells || notebooks[existingIndex].cells,
        messages: messages || notebooks[existingIndex].messages,
        dataset_filename: dataset_filename !== undefined ? dataset_filename : notebooks[existingIndex].dataset_filename,
        updated_at: now,
      };
    } else {
      // Create new notebook
      if (!targetId) {
        targetId = randomUUID();
      }
      const newNotebook: Notebook = {
        notebook_id: targetId,
        vault_file_id,
        title: title || "Untitled Notebook",
        cells: cells || [],
        messages: messages || [],
        dataset_filename: dataset_filename || "",
        created_at: now,
        updated_at: now,
      };
      notebooks.push(newNotebook);
    }

    writeNotebooks(notebooks);

    return NextResponse.json({
      notebook_id: targetId,
      message: "Saved to Vault",
    });
  } catch (error: any) {
    console.error("Error saving notebook:", error);
    return NextResponse.json({ detail: error.message || "Internal Server Error" }, { status: 500 });
  }
}
