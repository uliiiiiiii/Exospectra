import * as THREE from "three";

export interface WaveData {
  minWaveLength: number;
  maxWaveLength: number;
}

export interface WavelengthRecord {
  minwavelng: number;
  maxwavelng: number;
}

export interface PlanetProps {
  name: string;
  mass: number | null; //Earth masses
  type: string | null;
  radius: number | null; //kilometers (for better sizes, since stars are given in solar radiuses and planets in Earth's radiuses)
  color: string | THREE.Color | null;
  orbitalPeriod: number | null; //days
  semiMajorAxis: number | null; //AU
  orbitalRadius: number; // these are not in any specific physical units. It's just for 3d model 
  ra?: number, //RA
  dec?: number, //Dec
  distance?: number //pc
}
