export default function calculateOrbitalRadius(
  semiMajorAxis: number,
  stellarRadius?: number,
  planetRadius?: number
) {
  if (!stellarRadius) return 0;
  return (semiMajorAxis + stellarRadius + (planetRadius ? planetRadius / 50000 : 0.1) + 1) * 10;
}
