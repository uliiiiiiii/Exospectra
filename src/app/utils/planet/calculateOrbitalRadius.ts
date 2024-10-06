export default function calculateOrbitalRadius(semiMajorAxis: number, stellarRadius?: number) {
  if (!stellarRadius) return 0;
  return (semiMajorAxis + stellarRadius) * 10;
}
