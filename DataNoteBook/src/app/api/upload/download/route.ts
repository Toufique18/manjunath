import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://177.7.38.9:8000";
    
    const headers = new Headers();
    
    // Forward incoming authorization header
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    if (authHeader) {
      headers.set("Authorization", authHeader);
    }
    
    // Forward incoming cookies (like session_id)
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      headers.set("cookie", cookieHeader);
    }
    
    console.log("Forwarding download request to backend:", `${backendUrl}/api/upload/download`);
    
    const response = await fetch(`${backendUrl}/api/upload/download`, {
      method: "POST",
      headers,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend returned error for download:", response.status, errorText);
      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(
          { detail: errorJson?.detail || "Failed to download cleaned dataset from backend" },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { detail: errorText || "Failed to download cleaned dataset from backend" },
          { status: response.status }
        );
      }
    }
    
    // Get file bytes
    const blob = await response.blob();
    
    const resHeaders = new Headers();
    
    // Forward content-type and content-disposition
    const contentType = response.headers.get("content-type");
    if (contentType) {
      resHeaders.set("content-type", contentType);
    }
    
    const contentDisposition = response.headers.get("content-disposition");
    if (contentDisposition) {
      resHeaders.set("content-disposition", contentDisposition);
    }
    
    // Forward set-cookie if session was updated
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      resHeaders.set("set-cookie", setCookie);
    }
    
    return new NextResponse(blob, {
      status: 200,
      headers: resHeaders,
    });
  } catch (error: any) {
    console.error("Error in download proxy route:", error);
    return NextResponse.json(
      { detail: error.message || "Internal Server Error during download proxying" },
      { status: 500 }
    );
  }
}
