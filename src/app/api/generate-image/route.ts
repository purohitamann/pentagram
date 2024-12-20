import { NextRequest, NextResponse } from "next/server";

// Replace with your actual Modal FastAPI endpoint
const BACKEND_API_URL = "https://purohitamann--image-diffusion-inference-web.modal.run";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    // Validate input
    if (!text) {
      return NextResponse.json(
        { error: "Prompt text is required." },
        { status: 400 }
      );
    }

    // Construct the URL with query parameters
    const url = new URL(BACKEND_API_URL);
    url.searchParams.append("prompt", text);

    // Send the request to the backend API
    const response = await fetch(url.toString(), {
      method: "GET", // Use GET for query parameters
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Backend API error: ${errorText}` },
        { status: response.status }
      );
    }

    // Handle binary image data
    const imageBuffer = await response.arrayBuffer(); // Fetch the binary data
    const imageBase64 = Buffer.from(imageBuffer).toString("base64"); // Convert to base64
    const mimeType = response.headers.get("Content-Type") || "image/png"; // Get MIME type

    return NextResponse.json({
      image: `data:${mimeType};base64,${imageBase64}`, // Return as a base64 data URI
    });
  } catch (error) {
    console.error("Error in generate-image route:", error);
    return NextResponse.json(
      { error: "An internal error occurred while generating the image." },
      { status: 500 }
    );
  }
}
