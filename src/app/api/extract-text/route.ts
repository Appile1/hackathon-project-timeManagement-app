import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import * as pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const buffer = await file.arrayBuffer();
    const data = await pdfParse(Buffer.from(buffer));
    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}
