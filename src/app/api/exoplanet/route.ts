import { NextResponse, NextRequest } from "next/server";
import fetchPlanetSpectroscopyDataByName from "@/app/utils/planet/fetchSpectroscopyDataByName";
import calculatePlanetColor from "@/app/utils/planet/calculatePlanetColor";
import calculateOrbitalRadius from "@/app/utils/planet/calculateOrbitalRadius";
import classifyPlanet from "@/app/utils/planet/classifyPlanet";

export async function GET(req: NextRequest) {
  const planetName = req.nextUrl.searchParams.get("planetName");

  if (!planetName || typeof planetName !== "string") {
    return NextResponse.json({ message: "Planet name is required" }, { status: 400 });
  }

  const response = await fetch(
    `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+ps+where+pl_name='${planetName}'&format=json`
  );

  let planetData = null;
  if (response.ok) {
    const data = await response.json();
    if (data && data.length) {
      let totals = {
        radius: { sum: 0, count: 0 },
        orbitalRadius: { sum: 0, count: 0 },
        orbitalPeriod: { sum: 0, count: 0 },
        insolationFlux: { sum: 0, count: 0 },
        mass: { sum: 0, count: 0 },
      };

      data.forEach(
        ({
          pl_rade,
          pl_orbsmax,
          pl_orbper,
          pl_insol,
          pl_bmasse,
        }: {
          pl_rade: number;
          pl_orbsmax: number;
          pl_orbper: number;
          pl_insol: number;
          pl_bmasse: number;
        }) => {
          if (pl_rade) {
            totals.radius.sum += pl_rade;
            totals.radius.count++;
          }
          if (pl_orbsmax) {
            totals.orbitalRadius.sum += pl_orbsmax;
            totals.orbitalRadius.count++;
          }
          if (pl_orbper) {
            totals.orbitalPeriod.sum += pl_orbper;
            totals.orbitalPeriod.count++;
          }
          if (pl_insol) {
            totals.insolationFlux.sum += pl_insol;
            totals.insolationFlux.count++;
          }
          if (pl_bmasse) {
            totals.mass.sum += pl_bmasse;
            totals.mass.count++;
          }
        }
      );

      const waveData = await fetchPlanetSpectroscopyDataByName(planetName);
      const planetRadius = totals.radius.sum / totals.radius.count;
      const semiMajorAxis = totals.orbitalRadius.sum / totals.orbitalRadius.count;

      planetData = {
        radius: planetRadius * 6371, // Convert to Earth's radius
        semiMajorAxis: semiMajorAxis,
        orbitalPeriod: totals.orbitalPeriod.sum / totals.orbitalPeriod.count,
        color: await calculatePlanetColor(
          (waveData?.maxWaveLength + waveData?.minWaveLength) * 500
        ),
        type: await classifyPlanet(
          planetRadius
        ),
        mass: totals.mass.sum / totals.mass.count,
        orbitalRadius: calculateOrbitalRadius(semiMajorAxis),
      };
    } else {
      return NextResponse.json(null, { status: 404 });
    }
  } else {
    return NextResponse.json(null, { status: 500 });
  }

  return NextResponse.json(planetData, { status: 200 });
}
