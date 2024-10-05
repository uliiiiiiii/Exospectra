export default async function searchObject(name: string) {
  let result, data;
  result = await fetch(
    `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name+from+ps+where+pl_name='${name}'&format=json`
  );
  data = await result.json();
  if (result.ok && data && data.length) return { type: "exoplanet", data: result };
  result = await fetch(
    `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+hostname+from+stellarhosts+where+hostname='${name}'&format=json`
  );
  data = await result.json();
  if (result.ok && data && data.length) return { type: "star", data: result };
  return null;
}
