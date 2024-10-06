"use client";
import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { SystemProps } from '@/types/system';
import Orbit from './components/orbit';
import Planet from './components/planet';
import Star from './components/star'
import StarsPlaceholder from '../components/starsPlaceholder';
import { useSearchParams } from 'next/navigation';
import css from './page.module.css'
import { StarProps } from '@/types/star';
import { PlanetProps } from '@/types/planet';
import { system as defaultSystemData } from '../utils/placeholders'
import ExospectraLabel from '../components/ExospectraLabel';
import Loading from '../components/loading/loading';

function PlanetarySystem({ systemData = defaultSystemData, name }: { systemData: SystemProps; name: string }) {
    return (
        <div className={css.scene}>
            <div className={css.htmlContent}>
                <div className={css.infoBlock}>
                    <p>Search Results for: {name || 'N/A'}</p>
                </div>
                <div className={css.other}>
                    <ExospectraLabel />
                </div>
            </div>
            <div className={css.tip}>Tip: click on the planet to see it up close and view stars from it 🔭</div>
            <Canvas camera={{ position: [0, 50, 0] }} className={css.canvas}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />

                {systemData.stars.map((star: StarProps, index: number) => (
                    <Star
                        key={`star-${index}`}
                        radius={star.radius}
                        color={star.color}
                        temperature={star.temperature}
                        position={[index * 3, 0, 0]}
                    />
                ))}

                {systemData.planets && systemData.planets.map((planet: PlanetProps, index: number) => {
                    return (
                        <group key={`planet-group-${index}`}>
                            <Orbit radius={planet.orbitalRadius} />
                            <Planet
                                name={planet.name}
                                mass={planet.mass}
                                radius={planet.radius}
                                color={planet.color}
                                orbitalRadius={planet.orbitalRadius}
                                orbitalPeriod={planet.orbitalPeriod}
                                type={planet.type}
                                semiMajorAxis={planet.semiMajorAxis}
                            />
                        </group>
                    );
                })}
                <StarsPlaceholder />
                <OrbitControls enableZoom={true} />
            </Canvas>
        </div>
    );
}

function ExoplanetSystemSearchResult() {
    const searchParams = useSearchParams();
    const [systemName, setSystemName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [systemData, setSystemData] = useState<SystemProps | null>(null);

    useEffect(() => {
        const name = searchParams.get('name');
        if (name) {
            setSystemName(name);
            fetchSystemData(name);
        } else {
            setIsLoading(false);
        }
    }, [searchParams]);

    const fetchSystemData = async (name: string) => {
        try {
            const response = await fetch(`/api/star-system?systemName=${name}`);
            if (!response.ok) {
                throw new Error('Failed to fetch system data');
            }
            const data = await response.json();
            setSystemData(data.message);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (!systemName) {
        return <p>No system name provided.</p>;
    }

    return systemData ? <PlanetarySystem systemData={systemData} name={systemName} /> : <p>No system data found.</p>;
}

export default function ExoplanetSystem() {
    return (
        <Suspense fallback={<Loading />}>
            <ExoplanetSystemSearchResult />
        </Suspense>
    )
}