import * as THREE from "three";
import wavelengthToColor from "./wavelengthToColor";

export default async function calculatePlanetColor(wavelength: number) {
  const color = wavelengthToColor(wavelength);
  const newColor = color ? new THREE.Color(color[0], color[1], color[2]) : null;
  return newColor;
}
