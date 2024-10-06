import { NextResponse, NextRequest } from "next/server";
import fetchPlanetDataByName from "../utils/fetchPlanetDataByName";
import { PlanetProps } from "@/types/planet";

export async function GET(req: NextRequest) {
  const planetName = req.nextUrl.searchParams.get("planetName");

  if (!planetName || typeof planetName !== "string") {
    return NextResponse.json({ message: "Planet name is required" }, { status: 400 });
  }

  const planetData: PlanetProps | null = await fetchPlanetDataByName(planetName);

  return NextResponse.json(planetData, { status: 200 });
}
