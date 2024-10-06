import { OrbitProps } from "@/types/orbit";
import * as THREE from 'three';

export default function Orbit({ radius }: OrbitProps) {
    const segments = 128;
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);

    return (
        <lineLoop geometry={orbitGeometry}>
            <lineBasicMaterial color="white" transparent opacity={0.2} />
        </lineLoop>
    );
};