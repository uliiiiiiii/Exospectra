import * as THREE from "three";

export default function raDecToCartesian(
    ra: number,
    dec: number,
    radius: number
) {
    const raInRadians = THREE.MathUtils.degToRad(ra); // Convert RA to degrees and then to radians
    const decInRadians = THREE.MathUtils.degToRad(dec);

    const x = radius * Math.cos(decInRadians) * Math.cos(raInRadians);
    const y = radius * Math.sin(decInRadians);
    const z = radius * Math.cos(decInRadians) * Math.sin(raInRadians);

    return new THREE.Vector3(x, y, z);
}