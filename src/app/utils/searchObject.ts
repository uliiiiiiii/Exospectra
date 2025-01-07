export default async function searchObject(name: string) {
  let result, data;
  result = await fetch(
    `/api/search/planet?planetName=${name}`
  );
  data = await result.json();
  if (result.ok && data && data.length) return { type: "exoplanet", data: result };
  result = await fetch(
    `/api/search/star?starName=${name}`
  );
  data = await result.json();
  if (result.ok && data && data.length) return { type: "star", data: result };
  return null;
}
