import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "notebooks.json");

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

export interface Notebook {
  notebook_id: string;
  vault_file_id: string;
  title: string;
  cells: any[];
  messages: any[];
  dataset_filename: string;
  created_at: string;
  updated_at: string;
}

export function readNotebooks(): Notebook[] {
  ensureDataFile();
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function writeNotebooks(notebooks: Notebook[]) {
  ensureDataFile();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(notebooks, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save notebooks to file", err);
  }
}
