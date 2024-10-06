import { PlanetProps } from "./planet";
import { StarProps } from "./star";

export interface SystemProps {
  stars: StarProps[];
  planets: PlanetProps[];
}
