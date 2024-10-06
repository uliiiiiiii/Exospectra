export default function calculateOrbitalRadius(semiMajorAxis: number) {
  return Math.max(5, Math.min(50, semiMajorAxis * 10));
}
