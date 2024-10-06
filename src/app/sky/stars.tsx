import * as THREE from "three";
import { useRef, useMemo, useEffect, useState } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import { SmallStar } from "@/types/small_star";
import BVtoRGB from "../utils/small_star/BVtoRGB";
import { TextureLoader } from "three";
import getStars from "../utils/small_star/fetchStars";
import getStarAngularSize from "../utils/small_star/getAngularSize";
import { Html } from "@react-three/drei";
import { Constellation, StarConnection } from "@/types/constellation";
import raDecToCartesian from "../utils/small_star/RaDecToCartesian";

export default function StarsBackground({
    constellations,
    isEditing,
    editingIndex,
    updateConstellations,
    getFreeEdgeID,
    isActive,
    ra,
    dec,
    distance,
}: {
    constellations: Constellation[];
    isEditing: boolean;
    editingIndex: number;
    updateConstellations: Function;
    getFreeEdgeID: Function;
    isActive: boolean;
    ra: number;
    dec: number;
    distance: number;
}) {
    // const texture = useLoader(EXRLoader, "/textures/starmap_2020_4k.exr");
    const star_texture = useLoader(TextureLoader, "/textures/star_texture.png");
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Get camera from R3F
    const { camera, gl } = useThree();

    // Ref for the points
    const pointsRef = useRef<THREE.Points>(null);

    // State for stars data
    const [stars, setStars] = useState<SmallStar[]>([]);
    const [hoveredStarIndex, setHoveredStarIndex] = useState<number | null>(
        null
    );
    const mouseDownPos = useRef<{ x: number; y: number } | null>(null);
    const isDragging = useRef(false);
    const [clickedStarIndex, setClickedStarIndex] = useState(-1);
    const [clickedStarCoords, setClickedStarCoords] = useState<{
        x: number;
        y: number;
        z: number;
    }>({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        const fetchData = async () => {
            const starsData = await getStars();
            setStars(starsData);
        };
        fetchData();
    }, []);

    function translateStar(star: SmallStar): SmallStar {
        const base_ra = ra;
        const base_dec = dec;
        const base_distance = distance;
        // Convert all angles to radians
        const ra1 = THREE.MathUtils.degToRad(star.ra);
        const dec1 = THREE.MathUtils.degToRad(star.dec);
        const ra2 = THREE.MathUtils.degToRad(base_ra);
        const dec2 = THREE.MathUtils.degToRad(base_dec);

        // Convert (ra, dec, distance) to Cartesian coordinates
        // For star
        const x1 = star.distance * Math.cos(dec1) * Math.cos(ra1);
        const y1 = star.distance * Math.cos(dec1) * Math.sin(ra1);
        const z1 = star.distance * Math.sin(dec1);

        // For observation point
        const x2 = base_distance * Math.cos(dec2) * Math.cos(ra2);
        const y2 = base_distance * Math.cos(dec2) * Math.sin(ra2);
        const z2 = base_distance * Math.sin(dec2);

        // Calculate relative position
        const dx = x1 - x2;
        const dy = y1 - y2;
        const dz = z1 - z2;

        // Convert back to spherical coordinates
        const new_distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const new_dec = Math.asin(dz / new_distance);
        const new_ra = Math.atan2(dy, dx);

        // Calculate absolute magnitude first (using the original distance in parsecs)
        // M = m - 5 * (log10(distance) - 1)
        const absoluteMagnitude =
            star.magnitude - 5 * (Math.log10(star.distance) - 1);

        // Calculate new apparent magnitude from the new distance
        // m = M + 5 * (log10(distance) - 1)
        const new_magnitude =
            absoluteMagnitude + 5 * (Math.log10(new_distance) - 1);

        return {
            ...star,
            ra: THREE.MathUtils.radToDeg(
                new_ra < 0 ? new_ra + 2 * Math.PI : new_ra
            ), // Normalize RA to [0, 360)
            dec: THREE.MathUtils.radToDeg(new_dec),
            distance: new_distance,
            magnitude: new_magnitude,
        };
    }

    function getStarPosition(star: SmallStar) {
        return raDecToCartesian(star.ra, star.dec, 10000);
    }

    const geometry = useMemo(() => {
        const positions: number[] = [];
        const colors: number[] = [];
        const sizes: number[] = [];

        // Collect star data into an array
        // const starData: {
        //     pos: { x: number; y: number; z: number };
        //     color: { r: number; g: number; b: number };
        //     size: number;
        // }[] = [];

        stars.forEach((old_star: SmallStar) => {
            let star = translateStar(old_star);
            const pos = getStarPosition(star);
            const color = BVtoRGB(star.bv_color);
            positions.push(pos.x, pos.y, pos.z);
            let brightness = 1;
            colors.push(
                color.r * brightness,
                color.g * brightness,
                color.b * brightness
            );
            let size = getStarAngularSize(
                star.distance,
                star.magnitude,
                star.bv_color,
                star.effective_temperature
            );
            let size_px = size * 3600 * 1e5;
            if (size_px > 3000) size_px = 3000;

            sizes.push(size_px);
            // sizes.push(Math.min(1000,size_px));
        });

        // // Sort the star data by size in descending order
        // starData.sort((a, b) => b.size - a.size);

        // // Clear original arrays
        // positions.length = 0;
        // colors.length = 0;
        // sizes.length = 0;

        // // Populate sorted arrays
        // starData.forEach((data) => {
        //     positions.push(data.pos.x, data.pos.y, data.pos.z);
        //     colors.push(data.color.r, data.color.g, data.color.b);
        //     sizes.push(data.size);
        // });
        const geom = new THREE.BufferGeometry();
        geom.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positions, 3)
        );
        geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        geom.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

        return geom;
    }, [stars]);

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
                    gl_PointSize = size * (300.0 / -mvPosition.z);
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
            vertexColors: true,
            transparent: true,
            depthTest: true,
            depthWrite: true,
        });
    }, [star_texture]);

    function findLargestStar(intersects: THREE.Intersection[]) {
        let largestStarIndex = -1;
        let largestAngularSize = -1;

        intersects.forEach((intersect) => {
            if (typeof intersect.index === "number") {
                const star = translateStar(stars[intersect.index]);
                const angularSize = getStarAngularSize(
                    star.distance,
                    star.magnitude,
                    star.bv_color,
                    star.effective_temperature
                );

                if (angularSize > largestAngularSize) {
                    largestAngularSize = angularSize;
                    largestStarIndex = intersect.index;
                }
            }
        });

        return largestStarIndex;
    }

    useEffect(() => {
        const canvas = gl.domElement;
        raycaster.params.Points.threshold = 100;

        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // If we're dragging, update the dragging state
            if (mouseDownPos.current) {
                const deltaX = Math.abs(event.clientX - mouseDownPos.current.x);
                const deltaY = Math.abs(event.clientY - mouseDownPos.current.y);

                // If mouse has moved more than 5 pixels, consider it a drag
                if (deltaX > 5 || deltaY > 5) {
                    isDragging.current = true;
                }
            }

            if (pointsRef.current && stars.length > 0) {
                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObject(pointsRef.current);

                if (intersects.length > 0) {
                    const largestStarIndex = findLargestStar(intersects);

                    if (
                        largestStarIndex !== -1 &&
                        largestStarIndex !== hoveredStarIndex
                    ) {
                        setHoveredStarIndex(largestStarIndex);
                    }
                } else if (hoveredStarIndex !== null) {
                    setHoveredStarIndex(null);
                }
            }
        };

        const handleMouseDown = (event: MouseEvent) => {
            mouseDownPos.current = { x: event.clientX, y: event.clientY };
            isDragging.current = false;
        };

        const handleMouseUp = (event: MouseEvent) => {
            // Only trigger click if we weren't dragging
            if (!isDragging.current && hoveredStarIndex !== null) {
                const clickedStar = translateStar(stars[hoveredStarIndex]);
                console.log("Clicked star details:", {
                    ra: clickedStar.ra,
                    dec: clickedStar.dec,
                    magnitude: clickedStar.magnitude,
                    distance: clickedStar.distance,
                    bv_color: clickedStar.bv_color,
                    effective_temperature: clickedStar.effective_temperature,
                });
                setClickedStarIndex(hoveredStarIndex);
                const pos = getStarPosition(clickedStar);
                if (isActive) setClickedStarCoords(pos);
            }

            // Reset mouse tracking
            mouseDownPos.current = null;
            isDragging.current = false;
        };

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mouseup", handleMouseUp);

        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mouseup", handleMouseUp);
        };
    }, [stars, camera, hoveredStarIndex]);

    const [connections, setConnections] = useState<StarConnection[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startingStarIndex, setStartingStarIndex] = useState<number>(-1);
    const [clickedEdge, setClickedEdge] = useState<StarConnection | null>(null);
    const [clickedEdgeConstellationIndex, setClickedEdgeConstellationIndex] =
        useState(-1);
    const [clickedEdgeCoords, setClickedEdgeCoords] = useState<{
        x: number;
        y: number;
        z: number;
    }>({ x: 0, y: 0, z: 0 });

    // Function to calculate points along great circle
    const calculateGreatCirclePoints = (
        start: THREE.Vector3,
        end: THREE.Vector3,
        segments: number = 50
    ): THREE.Vector3[] => {
        const points: THREE.Vector3[] = [];
        const radius = 10000; // Same radius as used in raDecToCartesian

        // Normalize the vectors to ensure they're on the sphere
        const startNorm = start.clone().normalize();
        const endNorm = end.clone().normalize();

        // Calculate the angle between vectors
        const angle = startNorm.angleTo(endNorm);

        // Create orthonormal basis for interpolation
        const axis = new THREE.Vector3()
            .crossVectors(startNorm, endNorm)
            .normalize();

        // Generate points along the great circle
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const quaternion = new THREE.Quaternion();
            quaternion.setFromAxisAngle(axis, angle * t);

            const point = startNorm
                .clone()
                .applyQuaternion(quaternion)
                .multiplyScalar(radius);

            points.push(point);
        }

        return points;
    };

    const handleEdgeClick = (event: any, connection: StarConnection) => {
        let constellation_index = -1;
        for (let index = 0; index < constellations.length; index++) {
            if (constellations[index].id == connection.constelation_id) {
                constellation_index = index;
                break;
            }
        }
        console.log(`INDEX${constellation_index}`);
        if (constellation_index == -1) return;
        for (
            let index = 0;
            index < constellations[constellation_index].connections.length;
            index++
        ) {
            if (
                connection.connection_id ==
                constellations[constellation_index].connections[index]
                    .connection_id
            ) {
                setClickedStarIndex(-1);
                setClickedEdge(
                    constellations[constellation_index].connections[index]
                );
                setClickedEdgeConstellationIndex(constellation_index);
                setClickedEdgeCoords(event.point);
                console.log("Clicked shit at:", event.point);
            }
        }
    };

    const deleteEdge = (connection: StarConnection) => {
        let constellation_index = -1;
        for (let index = 0; index < constellations.length; index++) {
            if (constellations[index].id == connection.constelation_id) {
                constellation_index = index;
                break;
            }
        }
        console.log(`INDEX${constellation_index}`);
        if (constellation_index == -1) return;
        for (
            let index = 0;
            index < constellations[constellation_index].connections.length;
            index++
        ) {
            if (
                connection.connection_id ==
                constellations[constellation_index].connections[index]
                    .connection_id
            ) {
                constellations[constellation_index].connections.splice(
                    index,
                    1
                );
                updateConstellations(constellation_index, {
                    connections:
                        constellations[constellation_index].connections,
                });
                setClickedEdge(null);
            }
        }
    };

    // Function to create a line between two stars
    const createStarConnection = (connection: StarConnection) => {
        if (connection.startStar < 0 || connection.endStar < 0) return null;
        const prestar1 = stars[connection.startStar];
        const prestar2 = stars[connection.endStar];
        if (!prestar1 || !prestar2) return null;
        const star1 = translateStar(prestar1);
        const star2 = translateStar(prestar2);
        const pos1 = getStarPosition(star1);
        const pos2 = getStarPosition(star2);

        const points = calculateGreatCirclePoints(pos1, pos2);

        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(
            curve,
            50,
            connection.thickness,
            8,
            false
        );
        const material = new THREE.MeshBasicMaterial({
            color: connection.color,
            transparent: true,
            opacity: 0.6,
        });

        const largerGeometry = new THREE.TubeGeometry(
            curve,
            50,
            connection.thickness * 4, // Multiply thickness for larger click area
            8,
            false
        );
        const invisibleMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0, // Make the mesh invisible
        });

        return (
            <>
                <mesh
                    geometry={geometry}
                    material={material}
                    onClick={(event) => {
                        handleEdgeClick(event, connection);
                    }}
                />

                {/* <mesh
                    geometry={largerGeometry}
                    material={invisibleMaterial}
                    onClick={(event) => {
                        handleEdgeClick(event, connection);
                    }}
                /> */}
            </>
        );
    };

    const defaultConnectionThickness = 20;

    function connectStar(star_id: number) {
        if (isDrawing) {
            let exists = false;
            for (
                let index = 0;
                index < constellations[editingIndex].connections.length;
                index++
            ) {
                if (
                    (constellations[editingIndex].connections[index]
                        .startStar == startingStarIndex &&
                        constellations[editingIndex].connections[index]
                            .endStar == star_id) ||
                    (constellations[editingIndex].connections[index]
                        .startStar == star_id &&
                        constellations[editingIndex].connections[index]
                            .endStar == startingStarIndex)
                ) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                constellations[editingIndex].connections.push({
                    startStar: startingStarIndex,
                    endStar: star_id,
                    thickness: defaultConnectionThickness,
                    color: constellations[editingIndex].color,
                    constelation_id: constellations[editingIndex].id,
                    connection_id: getFreeEdgeID(),
                });
                alert(
                    `New edge ${constellations[editingIndex].connections[
                        constellations[editingIndex].connections.length - 1
                    ].connection_id
                    }`
                );
                // alert(`${constellations[editingIndex].connections.length}`);
                updateConstellations(editingIndex, {
                    connections: constellations[editingIndex].connections,
                });
            }
            setIsDrawing(false);
            setStartingStarIndex(-1);
        } else {
            setStartingStarIndex(star_id);
            setIsDrawing(true);
        }
    }

    return (
        <>
            {/* <sphereGeometry args={[9000, 64, 64]} /> */}
            {/* <meshBasicMaterial map={texture} side={THREE.BackSide} /> */}
            <points ref={pointsRef} geometry={geometry} material={material} />

            {constellations.map((constellation, index) => {
                if (!constellation.isShown) return null;
                return constellation.connections.map((connection, index) =>
                    createStarConnection(connection)
                );
            })}
            {isDrawing &&
                createStarConnection({
                    startStar: startingStarIndex,
                    endStar:
                        clickedStarIndex == startingStarIndex
                            ? hoveredStarIndex!
                            : clickedStarIndex,
                    thickness: defaultConnectionThickness,
                    color: constellations[editingIndex].color,
                    constelation_id: constellations[editingIndex].id,
                    connection_id: getFreeEdgeID(),
                })}

            {clickedStarIndex != -1 && isActive && (
                <Html
                    position={[
                        clickedStarCoords.x,
                        clickedStarCoords.y,
                        clickedStarCoords.z,
                    ]}
                >
                    <div
                        style={{
                            color: "white",
                            background: "rgba(100, 100, 100, 0.5)",
                            padding: "8px",
                            borderRadius: "8px",
                            flexDirection: "row",
                            display: "flex",
                            alignItems: "flex-start",
                        }}
                    >
                        <div
                            style={{
                                background: "none",
                                minWidth: "100px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "5px",
                            }}
                        >
                            <span>
                                <b>
                                    <i>Star info:</i>
                                </b>
                            </span>
                            <div>Name: {stars[clickedStarIndex].name}</div>
                            {isEditing && (
                                <button
                                    style={{
                                        color: "white",
                                        background: "rgba(200,200,200,0.7)",
                                        border: "1px grey",
                                        padding: "3px",
                                    }}
                                    onClick={() => {
                                        connectStar(stars[clickedStarIndex].id);
                                    }}
                                >
                                    {!isDrawing
                                        ? "Start connection"
                                        : "Finish connection"}
                                </button>
                            )}
                        </div>
                        <button
                            style={{
                                color: "white",
                                background: "none",
                                border: "none",
                                width: "24px",
                            }}
                            onClick={() => {
                                setClickedStarIndex(-1);
                            }}
                        >
                            &times;
                        </button>
                    </div>
                </Html>
            )}
            {clickedEdge != null && isActive && (
                <Html
                    position={[
                        clickedEdgeCoords.x,
                        clickedEdgeCoords.y,
                        clickedEdgeCoords.z,
                    ]}
                >
                    <div
                        style={{
                            color: "white",
                            background: "rgba(100, 100, 100, 0.5)",
                            padding: "8px",
                            borderRadius: "8px",
                            flexDirection: "row",
                            display: "flex",
                            alignItems: "flex-start",
                        }}
                    >
                        <div
                            style={{
                                background: "none",
                                minWidth: "100px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "5px",
                            }}
                        >
                            <span>
                                <b>
                                    <i>Connection info:</i>
                                </b>
                            </span>
                            <div>
                                Constellation:{" "}
                                {
                                    constellations[
                                        clickedEdgeConstellationIndex
                                    ].name
                                }
                            </div>
                            <button
                                style={{
                                    color: "white",
                                    background: "rgba(200,200,200,0.7)",
                                    border: "1px grey",
                                    padding: "3px",
                                }}
                                onClick={() => {
                                    deleteEdge(clickedEdge);
                                }}
                            >
                                Delete edge
                            </button>
                        </div>
                        <button
                            style={{
                                color: "white",
                                background: "none",
                                border: "none",
                                width: "24px",
                            }}
                            onClick={() => {
                                setClickedEdge(null);
                            }}
                        >
                            &times;
                        </button>
                    </div>
                </Html>
            )}
        </>
    );
}
