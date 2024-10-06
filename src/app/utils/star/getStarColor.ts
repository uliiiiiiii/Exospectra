export default function getStarColor(temperature: number): string {
  if (temperature >= 30000) {
    return "blue";
  } else if (temperature >= 10000) {
    return "lightblue";
  } else if (temperature >= 7500) {
    return "white";
  } else if (temperature >= 6000) {
    return "yellow-white";
  } else if (temperature >= 5200) {
    return "yellow";
  } else if (temperature >= 3700) {
    return "orange";
  } else {
    return "red";
  }
}
//based on https://www.universetoday.com/130870/stars-different-colors/
