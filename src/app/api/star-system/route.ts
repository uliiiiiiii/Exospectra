import { NextResponse, NextRequest } from "next/server";
import { SystemProps } from "@/types/system";
import getStarColor from "@/app/utils/star/getStarColor";
import { PlanetProps } from "@/types/planet";
import fetchPlanetDataByName from "@/app/api/utils/fetchPlanetDataByName";

export async function GET(req: NextRequest) {
  const systemName = req.nextUrl.searchParams.get("systemName");

  if (!systemName || typeof systemName !== "string") {
    return NextResponse.json({ message: "System name is required" }, { status: 400 });
  }

  try {
    const systemData = await fetchStarDataByName(systemName);
    if (systemData) {
      return NextResponse.json({ message: systemData }, { status: 200 });
    } else {
      return NextResponse.json({ message: "System not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching star data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

async function fetchStarDataByName(systemName: string): Promise<SystemProps | null> {
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+stellarhosts+where+hostname='${systemName}'&format=json`
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (!data || data.length === 0) {
    return null;
  }

  const totals = {
    temperature: { sum: 0, count: 0 },
    radius: { sum: 0, count: 0 },
  };

  data.forEach(({ st_teff, st_rad }: { st_teff: number; st_rad: number }) => {
    if (st_teff) {
      totals.temperature.sum += st_teff;
      totals.temperature.count++;
    }
    if (st_rad) {
      totals.radius.sum += st_rad;
      totals.radius.count++;
    }
  });

  const temperature = totals.temperature.sum / totals.temperature.count;
  const stellarRadius = totals.radius.sum / totals.radius.count;
  const stars = [
    {
      radius: stellarRadius * 695508, //we're multiplying it by radius of the sun, so we get the values in km
      color: getStarColor(temperature),
      temperature: temperature,
    },
  ];

  const planetLetters = ["b", "c", "d", "e", "f", "g", "h", "i"]; //I looked at the maximum number of the planets in system in the Archieve and it is 8, tha last one being "i"
  const planets: PlanetProps[] = await Promise.all(
    planetLetters.map(async (letter) => {
      const planetData = await fetchPlanetDataByName(`${systemName} ${letter}`, stellarRadius);
      return planetData || null;
    })
  ).then((results) => results.filter((planet): planet is PlanetProps => planet !== null));

  return { stars, planets };
}
