import fs from "fs";
import path from "path";
import { cache } from "react";
import { connection } from "next/server";
import { Content, DEFAULTS } from "./content";

export const CONTENT_FILE = path.join(process.cwd(), "data", "content.json");

// Gộp đệ quy: mảng của người dùng thay thế hoàn toàn mảng mặc định, object được gộp theo khóa.
function merge<T>(base: T, over: unknown): T {
  if (Array.isArray(base)) return (Array.isArray(over) ? over : base) as T;
  if (base && typeof base === "object") {
    const o = (over && typeof over === "object" ? over : {}) as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(base as object)) out[k] = merge((base as Record<string, unknown>)[k], o[k]);
    return out as T;
  }
  return (typeof over === typeof base ? over : base) as T;
}

export function readContentFile(): Content {
  let saved: unknown = {};
  try { saved = JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8")); } catch { /* chưa có file => mặc định */ }
  return merge(DEFAULTS, saved);
}

// Đọc mỗi lượt truy cập (connection() ép trang render động) nên sửa trong /admin có hiệu lực ngay.
export const getContent = cache(async (): Promise<Content> => {
  await connection();
  return readContentFile();
});
