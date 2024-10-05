"use client"
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import css from './page.module.css';
import StarsPlaceholder from '../components/starsPlaceholder';
import ExoplanetModel from './components/exoplanet';
import { PlanetProps } from '@/types/planet';
import { Html } from "@react-three/drei";
import ExospectraLabel from '../components/ExospectraLabel';
import Image from 'next/image';

function ExoplanetSearchResult() {
    const searchParams = useSearchParams();
    const [planetName, setPlanetName] = useState('');
    const [planetData, setPlanetData] = useState<PlanetProps | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const name = searchParams.get('name');
        if (name) {
            setPlanetName(name);
            fetchPlanetData(name);
        } else {
            setIsLoading(false);
        }
    }, [searchParams]);

    const fetchPlanetData = async (name: string) => {
        setTimeout(() => {
            setIsLoading(false);
            const data: PlanetProps = {
                name: 'Earth (our home)',
                mass: 1, radius: 2, semiMajorAxis: 1, orbitalPeriod: 365, orbitalInclination: 2, eccentricity: 1, color: '#add8e6', type: 'Earth'
            }; //placeholder data
            setPlanetData(data)
        })
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!planetName) {
        return <p>No planet name provided.</p>;
    }

    return (
        <>
            {planetData ? (
                <div>
                    <div className={css.scene}>
                        <Canvas
                            shadows
                            className={css.canvas}
                            camera={{
                                position: [0, 0, 5],
                            }}
                        >
                            <Html fullscreen>
                                <div className={css.htmlContent}>
                                    <div className={css.infoBlock}>
                                        <p>Search Results for: {planetName}</p>
                                        <ul className={css.dataBlock}>
                                            <li>Mass (Earth Masses): {planetData.mass}</li>
                                            <li>Radius (kilometers): {planetData.radius}</li>
                                            <li>Type: {planetData.type}</li>
                                            <li>Orbital period (days): {planetData.orbitalPeriod}</li>
                                        </ul>
                                    </div>
                                    <div className={css.other}>
                                        <ExospectraLabel />
                                        <div className={css.dragTool}>
                                            <Image src="/rocket.png" width={90} height={90} alt="rocket" />
                                            <p>Drag the spaceship to the location where you want to see the sky</p>
                                        </div>
                                    </div>
                                </div>
                            </Html>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 10, 10]} intensity={1} castShadow />

                            <ExoplanetModel data={planetData} />
                            <StarsPlaceholder />

                            <OrbitControls enableZoom={true} />

                        </Canvas>
                    </div>
                </div>
            ) : (
                <p>No planet data found.</p>
            )}
        </>
    );
}

export default function Exoplanet() {
    return (
        <Suspense>
            <ExoplanetSearchResult />
        </Suspense>
    )
}