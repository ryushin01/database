import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get("url");
  const token = searchParams.get("key");

  if (!imageUrl) {
    return NextResponse.json(
      { error: "imageUrl is required" },
      { status: 400 },
    );
  }

  try {
    console.log("🔵 Requesting image from:", imageUrl);

    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return new NextResponse(response.data, {
      status: 200,
    });
  } catch (err) {
    console.error("🔴 imageProxy ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch image", details: err },
      { status: 500 },
    );
  }
}
