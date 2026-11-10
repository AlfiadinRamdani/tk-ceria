import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");

export async function bacaFile(nama, nilaiAwal = []) {
  try {
    const isi = await fs.readFile(path.join(dataDir, nama), "utf8");
    return JSON.parse(isi);
  } catch (error) {
    if (error.code === "ENOENT") return nilaiAwal;
    throw error;
  }
}

export async function tulisFile(nama, data) {
  await fs.writeFile(path.join(dataDir, nama), JSON.stringify(data, null, 2));
}
