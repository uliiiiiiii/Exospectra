import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const starName = req.nextUrl.searchParams.get("starName");

  if (!starName || typeof starName !== "string") {
    return NextResponse.json({ message: "Planet name is required" }, { status: 400 });
  }

  const apiUrl = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+hostname+from+stellarhosts+where+hostname='${starName}'&format=json`

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return NextResponse.json({ message: "Failed to fetch data from API" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}
