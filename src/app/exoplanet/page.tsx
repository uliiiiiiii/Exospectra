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
import Loading from '../components/loading/loading';
import StarsBackground from '../sky/stars';

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
        try {
            const response = await fetch(`/api/exoplanet?planetName=${name}`);
            if (!response.ok) {
                throw new Error('Failed to fetch planet data');
            }
            const data = await response.json();
            setPlanetData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loading />;
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
                                position: [0, 0, 10],
                                far: 100000,
                            }}
                        >
                            <Html fullscreen>
                                <div className={css.htmlContent}>
                                    <div className={css.infoBlock}>
                                        <p>Search Results for: {planetName ? planetName : 'N/A'}</p>
                                        <ul className={css.dataBlock}>
                                            <li>Mass (Earth Masses): {planetData.mass ? planetData.mass : 'N/A'}</li>
                                            <li>Radius (kilometers): {planetData.radius ? planetData.radius : 'N/A'}</li>
                                            <li>Type: {planetData.type ? planetData.type : 'N/A'}</li>
                                            <li>Orbital period (days): {planetData.orbitalPeriod ? planetData.orbitalPeriod : 'N/A'}</li>
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
                            <StarsBackground/>

                            <OrbitControls enableZoom={true} minDistance={30} maxDistance={110} />

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