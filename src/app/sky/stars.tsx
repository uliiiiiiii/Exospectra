import * as THREE from "three";
import { useRef, useMemo, useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import { SmallStar } from "@/types/small_star";
import BVtoRGB from "../utils/small_star/BVtoRGB";
import { TextureLoader } from "three";
import getStars from "../utils/small_star/fetchStars";
import raDecToCartesian from "../utils/small_star/RaDecToCartesian";

export default function StarsBackground() {
    const texture = useLoader(EXRLoader, "/textures/starmap_2020_4k.exr");
    const star_texture = useLoader(TextureLoader, "/textures/star_texture.png");
    const pointsRef = useRef<THREE.Points>(null);


    const [stars, setStars] = useState<SmallStar[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const starsData = await getStars();
            setStars(starsData);
        };
        fetchData();
    }, []);

    const geometry = useMemo(() => {
        const positions: number[] = [];
        const colors: number[] = [];
        const sizes: number[] = [];

        stars.forEach((star: SmallStar) => {
            const pos = raDecToCartesian(star.ra, star.dec, 10000); // Adjust the radius as needed
            const color = BVtoRGB(star.bv_color);
            positions.push(pos.x, pos.y, pos.z);
            let brightness = 1;
            colors.push(color.r*brightness, color.g*brightness, color.b*brightness);
            sizes.push(1 / Math.pow(star.distance,1/1.5) * 5000* 1 / star.magnitude); // Adjust sizes based on your logic
        });

        // Create geometry
        const geom = new THREE.BufferGeometry();
        geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        geom.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
        
        return geom;
    }, [stars]);

    // Custom ShaderMaterial to handle sizes
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: star_texture },
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z); // Adjust scaling here
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                void main() {
                    gl_FragColor = vec4(vColor, 1.0);
                    gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
                }
            `,
            vertexColors: true, // Enable per-vertex color
            transparent: true, // Enable transparency if needed
            depthTest: true,
            depthWrite: true,
        });
    }, [star_texture]);

    return (
        <mesh>
            {/* <sphereGeometry args={[10000, 64, 64]} />  */}
            {/* <meshBasicMaterial map={texture} side={THREE.BackSide} />  */}
            <points ref={pointsRef} geometry={geometry} material={material} />
        </mesh>
    );
}