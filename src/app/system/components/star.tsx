import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { StarProps } from "@/types/star";

export default function Star({ radius, color, position}: StarProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);

    const noiseTexture = useMemo(() => {
        const size = 256;
        const data = new Uint8Array(size * size * size);
        for (let i = 0; i < size * size * size; i++) {
            data[i] = Math.floor(Math.random() * 255);
        }
        const texture = new THREE.DataTexture(data, size, size);
        texture.format = THREE.RedFormat;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.unpackAlignment = 1;
        return texture;
    }, []);

    const starMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                noiseTexture: { value: noiseTexture },
                color: { value: new THREE.Color(color) },
            },
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                uniform sampler3D noiseTexture;
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vec3 noise = texture(noiseTexture, vPosition * 0.5 + vec3(time * 0.1)).rgb;
                    float intensity = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
                    vec3 finalColor = mix(color, vec3(1.0), intensity * 0.3 + noise.r * 0.2);
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `,
        });
    }, [color, noiseTexture]);

    const glowMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(color) },
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(color, 1.0) * intensity;
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });
    }, [color]);

    return (
        <group position={position}>
            <mesh ref={meshRef} material={starMaterial}>
                <sphereGeometry args={[radius / 1000000, 64, 64]} />
            </mesh>
            <mesh ref={glowRef} material={glowMaterial}>
                <sphereGeometry args={[radius / 1000000 * 1.2, 64, 64]} />
            </mesh>
        </group>
    );
}