export default async function classifyPlanet(planetRadius: number) {
  if (!planetRadius) return null;
  let type = null;

  if (planetRadius > 6) {
    type = "Jovian";
  } else if (planetRadius > 1.75 && planetRadius <= 6) {
    type = "Neptune";
  } else if (planetRadius > 1 && planetRadius <= 1.75) {
    type = "Super Venus-Mercury";
  } else if (planetRadius > 0.5 && planetRadius <= 1) {
    type = "Earth-like";
  } else if (planetRadius <= 0.5) {
    type = "Snowball";
  }

  return type;
}
