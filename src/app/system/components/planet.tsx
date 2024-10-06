import { useRef, useState } from "react";
import { PlanetProps } from "@/types/planet";
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from "@react-three/drei";
import { useRouter } from "next/navigation";

export default function Planet({
    name,
    radius,
    color,
    orbitalRadius,
    orbitalPeriod,
    type
}: PlanetProps) {
    const ref = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const router = useRouter()

    // useFrame(({ clock }) => {
    //     if (ref.current) {
    //         const t = clock.getElapsedTime();
    //         const angle = (t / orbitalPeriod) * Math.PI * 2;

    //         ref.current.position.x = Math.cos(angle) * orbitalRadius;
    //         ref.current.position.z = Math.sin(angle) * orbitalRadius;

    //         ref.current.rotation.y += 0.01;
    //     }
    // }); //animation along the orbit


    const x = orbitalRadius * Math.cos(0);
    const z = orbitalRadius * Math.sin(0);

    const texture = useLoader(THREE.TextureLoader, '/textures/placeholder.jpg');

    return (
        <>
            <mesh
                ref={ref}
                position={[x, 0, z]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={() => router.push(`/exoplanet?name=${encodeURIComponent(name)}`)}
            >
                <sphereGeometry args={[radius ? radius / 50000 : 0.1, 64, 64]} />
                {color ? <meshStandardMaterial color={color} map={type ? useLoader(THREE.TextureLoader, `/textures/${type}.jpg`) : null} />
                    : <meshStandardMaterial map={type ? useLoader(THREE.TextureLoader, `/textures/${type}.jpg`) : texture} />
                }
            </mesh>

            {hovered && (
                <Html position={[x, 1, z]}>
                    <div style={{ color: 'white', background: 'rgba(0, 0, 0, 0.5)', padding: '5px', borderRadius: '5px' }}>
                        Name: {name} <br />
                        Radius: {radius} <br />
                        Orbital Period: {orbitalPeriod}
                    </div>
                </Html>
            )}
        </>
    );
}
