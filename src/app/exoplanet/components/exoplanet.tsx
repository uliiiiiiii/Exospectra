import React, { useRef } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { PlanetProps } from '@/types/planet';
import { planet as planetPlaceholder } from '@/app/utils/placeholders';

function Planet(data: any) {
  const ref = useRef<THREE.Mesh>(null);

  const texture = useLoader(THREE.TextureLoader, '/textures/placeholder.jpg');

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[10, 64, 64]} />
      {data.data.color ? <meshStandardMaterial color={data.data.color} map={data.data.type ? useLoader(THREE.TextureLoader, `/textures/${data.data.type}.jpg`) : null} />
        : <meshStandardMaterial map={data.data.type ? useLoader(THREE.TextureLoader, `/textures/${data.data.type}.jpg`) : texture} />
      }
    </mesh>
  );
}

export default function ExoplanetModel({ data = planetPlaceholder }: { data?: PlanetProps }) {
  return (
    <>
      <Planet data={data} />
    </>
  );
}
