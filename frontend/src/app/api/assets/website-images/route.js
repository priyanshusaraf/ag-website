import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get('q') || '').toLowerCase();

    const dir = path.join(process.cwd(), 'public', 'website-imgs');
    const files = await fs.readdir(dir);

    const images = files
      .filter((name) => IMAGE_EXTS.has(path.extname(name).toLowerCase()))
      .filter((name) => (q ? name.toLowerCase().includes(q) : true))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((name) => ({
        name,
        url: `/website-imgs/${name}`,
      }));

    return NextResponse.json({ images });
  } catch (err) {
    return NextResponse.json(
      { message: 'Failed to read website images', error: err?.message || String(err) },
      { status: 500 }
    );
  }
}


