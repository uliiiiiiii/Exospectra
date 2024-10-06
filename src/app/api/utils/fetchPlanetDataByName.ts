import { PlanetProps } from "@/types/planet";
import fetchPlanetSpectroscopyDataByName from "./fetchSpectroscopyDataByName";
import calculatePlanetColor from "../../utils/planet/calculatePlanetColor";
import classifyPlanet from "../../utils/planet/classifyPlanet";
import calculateOrbitalRadius from "../../utils/planet/calculateOrbitalRadius";

export default async function fetchPlanetDataByName(planetName: string, stellarRadius?: number) {
  let planetData: PlanetProps | null = null;
  const response = await fetch(
    `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+ps+where+pl_name='${planetName}'&format=json`
  );
  if (response.ok) {
    const data = await response.json();
    if (data && data.length) {
      let totals = {
        radius: { sum: 0, count: 0 },
        semiMajorAxis: { sum: 0, count: 0 },
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
          //pl_orbsmax is semi major axis. I need to read in more detail about this later
          if (pl_rade) {
            totals.radius.sum += pl_rade;
            totals.radius.count++;
          }
          if (pl_orbsmax) {
            totals.semiMajorAxis.sum += pl_orbsmax;
            totals.semiMajorAxis.count++;
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
      const semiMajorAxis = totals.semiMajorAxis.sum / totals.semiMajorAxis.count;

      planetData = {
        name: planetName,
        radius: planetRadius * 6371, //we multiply it by the radius of the Earth
        orbitalPeriod: totals.orbitalPeriod.sum / totals.orbitalPeriod.count,
        color: await calculatePlanetColor(
          (waveData?.maxWaveLength + waveData?.minWaveLength) * 500
        ),
        type: await classifyPlanet(planetRadius),
        mass: totals.mass.sum / totals.mass.count,
        orbitalRadius: calculateOrbitalRadius(semiMajorAxis, stellarRadius, planetRadius * 6371),
        semiMajorAxis: semiMajorAxis,
      };
    } else {
      return null;
    }
  } else {
    return null;
  }
  return planetData;
}
