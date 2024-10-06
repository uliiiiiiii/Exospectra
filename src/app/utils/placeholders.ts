import { PlanetProps } from "@/types/planet";
import { SystemProps } from "@/types/system";

const planet: PlanetProps = {
  name: "Earth (our home)",
  mass: 1,
  radius: 2,
  semiMajorAxis: 1,
  orbitalPeriod: 365,
  color: "#add8e6",
  type: "Earth",
  orbitalRadius: 100,
};

const system: SystemProps = {
  stars: [{ radius: 1, color: "yellow", temperature: 3940 }],
  planets: [
    {
      name: "planet-1",
      mass: 1,
      radius: 2,
      semiMajorAxis: 1,
      orbitalPeriod: 365,
      color: "blue",
      type: "Jovian",
      orbitalRadius: 100,
    },
    {
      name: "planet-2",
      mass: 5,
      radius: 5,
      semiMajorAxis: 10,
      orbitalPeriod: 200,
      color: "red",
      type: "Earth",
      orbitalRadius: 200,
    },
  ],
}; //TO-DO: change it to our solar system later

export { planet, system };
