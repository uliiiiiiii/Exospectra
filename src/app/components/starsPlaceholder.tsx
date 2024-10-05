import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

export default function StarsPlaceholder() {
    const texture = useLoader(THREE.TextureLoader, '/textures/stars.jpg');
    return (
        <mesh>
            <sphereGeometry args={[100, 64, 64]} />
            <meshBasicMaterial
                map={texture}
                side={THREE.BackSide}
            />
        </mesh>
    );
}