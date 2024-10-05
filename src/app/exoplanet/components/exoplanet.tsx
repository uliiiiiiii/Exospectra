import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useLoader, useThree } from '@react-three/fiber';
import { PlanetProps } from '@/types/planet';

function Planet(data: any) {
  const ref = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const texture = useLoader(THREE.TextureLoader, '/textures/placeholder.jpg');
  console.log("planet data: ", data)

  const planetRadius = data.data.radius; //there is probably a bug with it, but I don't have time to investigate
  useEffect(() => {
    if (ref.current) {
      const scaleFactor = Math.max(1 / planetRadius, 0.7);
      ref.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
      const cameraDistance = planetRadius * 3;
      camera.position.set(0, 0, cameraDistance);
      camera.updateProjectionMatrix();
    }
  }, [planetRadius, camera]);

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[planetRadius, 64, 64]} />
      {data.data.color ? <meshStandardMaterial color={data.data.color} map={data.data.type ? useLoader(THREE.TextureLoader, `/textures/${data.data.type}.jpg`) : null} />
        : <meshStandardMaterial map={data.data.type ? useLoader(THREE.TextureLoader, `/textures/${data.data.type}.jpg`) : texture} />
      }
    </mesh>
  );
}

export default function ExoplanetModel({ data }: { data?: PlanetProps }) {
  return (
    <>
      <Planet data={data} />
    </>
  );
}
