"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import css from "./page.module.css";
import ExoplanetModel from "./components/exoplanet";
import { PlanetProps } from "@/types/planet";
import ExospectraLabel from "../components/ExospectraLabel";
import Image from "next/image";
import Loading from "../components/loading/loading";
import StarsBackground from "../sky/stars";
import ConstellationMenuButton from "./components/constellationsMenuButton";
import { Constellation } from "@/types/constellation";
import ConstellationsMenu from "./components/constellationsMenu";
import exportToPng from "../utils/exportToPng";
import { planet } from "../utils/placeholders";

function ExoplanetSearchResult() {
    const [showConstellationMenu, setShowConstellationMenu] = useState(false);
    const [displayButtons, setDisplayButtons] = useState(true);
    const [constellations, util_setConstellations] = useState<Constellation[]>(
        recieveConstellations()
    );

    function setConstellations(constellations: Constellation[]) {
        util_setConstellations(constellations);
        submitConstellations(constellations);
    }

    function getFreeID() {
        let new_id = 1; //if none
        if (typeof window !== 'undefined') {
            const result = localStorage.getItem("firstFreeID");
            if (result != null) {
                new_id = parseInt(result, 10) + 1;
            }
            localStorage.setItem("firstFreeID", `${new_id}`);
        }
        return new_id - 1;
    }

    function getFreeEdgeID() {
        let new_id = 1; //if none
        if (typeof window !== 'undefined') {
            const result = localStorage.getItem("firstFreeEdgeID");

            if (result != null) {
                new_id = parseInt(result, 10) + 1;
            }
            localStorage.setItem("firstFreeEdgeID", `${new_id}`);
        }
        return new_id - 1;
    }

    const [isEditing, setIsEditing] = useState(false);
    const [currentEditingIndex, setCurrentEditingIndex] = useState(-1);

    function updateConstellations(
        id: number,
        newConstellation: Partial<Constellation>
    ) {
        const newConstellations = [...constellations];
        newConstellations.forEach((constellation, index) => {
            if (constellation.id == id) {
                newConstellations[index] = {
                    ...constellation,
                    ...newConstellation,
                };
            }
        });
        setConstellations(newConstellations);
    }

    function deleteConstellation(id: number) {
        setConstellations(
            constellations.filter((constellation) => constellation.id !== id)
        );
    }

    function addConstellation(newConstellation: Constellation) {
        setConstellations([...constellations, newConstellation]);
    }

    function stopEditing() {
        setIsEditing(false);
        constellations[currentEditingIndex].isEditing = false;
        setCurrentEditingIndex(-1);
    }

    function startEditing(index: number) {
        if (isEditing) stopEditing();
        setIsEditing(true);
        constellations[index].isEditing = true;
        setCurrentEditingIndex(index);
    }

    function recieveConstellations() {
        let result = null;
        if (typeof window !== 'undefined') {
            result = localStorage.getItem("constellations");
        }
        if (result == null) return [];
        const constellations = JSON.parse(result) as Constellation[];
        constellations.forEach((_, index) => {
            constellations[index].isEditing = false;
        });
        return constellations;
    }

    function submitConstellations(constellations: Constellation[]) {
        if (typeof window !== 'undefined') localStorage.setItem(`constellations`, JSON.stringify(constellations));
    }

    const searchParams = useSearchParams();
    const [planetName, setPlanetName] = useState("");
    const [planetData, setPlanetData] = useState<PlanetProps | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const name = searchParams.get("name");
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
                throw new Error("Failed to fetch planet data");
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
        return (
            <Loading progress="Found an exoplanet! Fetching its data... 🌍" />
        );
    }

    if (!planetName) {
        return <p>No planet name provided.</p>;
    }

    return (
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
            {planetData ? (
                <>
                    <div
                        className={css.scene}
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <Canvas
                            shadows
                            className={`${css.canvas} scene`}
                            camera={{
                                position: [0, 0, 10],
                                far: 100000,
                            }}
                            style={{ position: "absolute", zIndex: 1 }}
                            gl={{
                                preserveDrawingBuffer: true,
                                logarithmicDepthBuffer: true,
                                antialias: false,
                            }}
                        >
                            <ambientLight intensity={0.5} />
                            <directionalLight
                                position={[10, 10, 10]}
                                intensity={1}
                                castShadow
                            />

                            <ExoplanetModel data={planetData} />
                            <StarsBackground
                                constellations={constellations}
                                isEditing={isEditing}
                                editingIndex={currentEditingIndex}
                                updateConstellations={updateConstellations}
                                getFreeEdgeID={getFreeEdgeID}
                                isActive={showConstellationMenu}
                                ra={planetData.ra ? planetData.ra : 1}
                                dec={planetData.dec ? planetData.dec : 1}
                                distance={
                                    planetData.distance
                                        ? planetData.distance
                                        : 1
                                }
                            />
                            <OrbitControls
                                enableZoom={true}
                                enablePan={false}
                                minDistance={30}
                                maxDistance={110}
                            />
                        </Canvas>
                    </div>
                    <div
                        style={{
                            position: "fixed",
                            left: showConstellationMenu ? "84%" : "90%",
                            top: showConstellationMenu ? "50%" : "90%",
                            transform: "translate(-50%, -50%)",
                            width: showConstellationMenu ? "27%" : "100px",
                            height: showConstellationMenu ? "80%" : "100px",
                            zIndex: 1000,
                            pointerEvents: "auto",
                        }}
                    >
                        {displayButtons && showConstellationMenu && (
                            <ConstellationsMenu
                                onClose={() => {
                                    setShowConstellationMenu(false);
                                }}
                                constellations={constellations}
                                updateConstellations={updateConstellations}
                                addConstellations={addConstellation}
                                deleteConstellations={deleteConstellation}
                                startEditing={startEditing}
                                stopEditing={stopEditing}
                                getFreeID={getFreeID}
                            />
                        )}
                    </div>
                    {displayButtons && !showConstellationMenu && (
                        <>
                            <div className={css.infoBlock}>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "8px",
                                        flexDirection: "column",
                                    }}
                                >
                                    <p>Search results for: </p>
                                    <p
                                        style={
                                            typeof planet.color == "string"
                                                ? { color: planet.color }
                                                : { color: "white" }
                                        }
                                    >
                                        {planetName ? planetName : "N/A"}
                                    </p>
                                </div>
                                <ul className={css.dataBlock}>
                                    <li>
                                        Name:{" "}
                                        {planetData.name
                                            ? planetData.name
                                            : "N/A"}
                                    </li>
                                    <li>
                                        Mass (Earth masses):{" "}
                                        {planetData.mass
                                            ? planetData.mass.toFixed(2)
                                            : "N/A"}
                                    </li>
                                    <li>
                                        Radius (km):{" "}
                                        {planetData.radius
                                            ? planetData.radius.toFixed(2)
                                            : "N/A"}
                                    </li>
                                    <li>
                                        Type:{" "}
                                        {planetData.type
                                            ? planetData.type
                                            : "N/A"}
                                    </li>
                                    <li>
                                        Orbital period (days):{" "}
                                        {planetData.orbitalPeriod
                                            ? planetData.orbitalPeriod.toFixed(
                                                2
                                            )
                                            : "N/A"}
                                    </li>
                                    <li>
                                        Distance (light years):{" "}
                                        {planetData.distance
                                            ? (
                                                planetData.distance! *
                                                3.261598
                                            ).toFixed(2)
                                            : "N/A"}
                                    </li>
                                </ul>
                            </div>
                            <div className={css.other}>
                                <div className={css.right}>
                                    <ExospectraLabel />
                                    <div className={css.dragTool}>
                                        <Image
                                            src="/rocket.png"
                                            width={90}
                                            height={90}
                                            alt="rocket"
                                        />
                                        <p>
                                            Drag the spaceship to the location
                                            where you want to see the sky
                                        </p>
                                    </div>
                                </div>
                                <div className={css.slantedText}>
                                    <p>Coming soon</p>
                                </div>
                            </div>
                            <div className={css.constellation}>
                                <ConstellationMenuButton
                                    onPress={() => {
                                        setShowConstellationMenu(true);
                                    }}
                                />
                            </div>
                        </>
                    )}
                    <div
                        className={css.displayButtons}
                        style={{
                            backgroundImage: `url(/${displayButtons ? "hide" : "show"
                                }Icon.png`,
                        }}
                        onClick={() => setDisplayButtons(!displayButtons)}
                    ></div>
                    <div
                        className={css.exportButton}
                        onClick={() => exportToPng()}
                    ></div>
                </>
            ) : (
                <p>No planet data found.</p>
            )}
        </div>
    );
}

export default function Exoplanet() {
    return (
        <Suspense
            fallback={
                <Loading progress="Found an exoplanet! Getting its name from the url... 🔗" />
            }
        >
            <ExoplanetSearchResult />
        </Suspense>
    );
}
