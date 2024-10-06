import { WavelengthRecord } from "@/types/planet";
export default async function fetchPlanetSpectroscopyDataByName(planetName: string) {
  let planetData;
  const response = await fetch(
    `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+spectra+where+pl_name='${planetName}'&format=json`
  );
  if (response.ok) {
    const data = await response.json();
    if (data && data.length > 0) {
      const minWavelength = data.reduce(
        (min: number, record: WavelengthRecord) =>
          record.minwavelng < min ? record.minwavelng : min,
        data[0].minwavelng
      );
      const maxWavelength = data.reduce(
        (min: number, record: WavelengthRecord) =>
          record.maxwavelng < min ? record.maxwavelng : min,
        data[0].maxwavelng
      );
      planetData = { minWaveLength: minWavelength, maxWaveLength: maxWavelength };
    } else {
      planetData = null;
    }
  } else {
    planetData = null;
  }
  return planetData;
}
