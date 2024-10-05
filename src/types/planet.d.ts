import * as THREE from "three";

export interface PlanetProps {
  name: string;
  mass: number | null; //Earth masses
  type: string | null;
  radius: number | null; //kilometers (for better sizes, since stars are given in solar radiuses and planets in Earth's radiuses)
  color: string | THREE.Color | null;
  orbitalPeriod: number | null; //days
  semiMajorAxis: number | null; //AU
  orbitalInclination: number | null; //deg
  eccentricity: number | null;
}
