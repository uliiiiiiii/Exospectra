// Stefan-Boltzmann constant in W m^-2 K^-4
const STEFAN_BOLTZMANN = 5.67e-8;
const SUN_LUMINOSITY = 3.828e26; // in watts
const SUN_ABSOLUTE_MAGNITUDE = 4.83; // M_sun

// Function to estimate temperature from BP-RP color
function estimateTemperature(bp_rp_color: number): number {
    return (
        4600 *
        (1 / (0.92 * bp_rp_color + 1.7) + 1 / (0.92 * bp_rp_color + 0.62))
    );
}

// Function to calculate luminosity from magnitude
function calculateLuminosity(magnitude: number, distance: number): number {
    const absoluteMagnitude = magnitude - 5 * (Math.log10(distance) - 1); // Convert apparent magnitude to absolute magnitude
    return (
        SUN_LUMINOSITY *
        Math.pow(10, 0.4 * (SUN_ABSOLUTE_MAGNITUDE - absoluteMagnitude))
    );
}

// Function to calculate radius from luminosity and temperature
function calculateRadius(luminosity: number, temperature: number): number {
    return Math.sqrt(
        luminosity / (4 * Math.PI * STEFAN_BOLTZMANN * Math.pow(temperature, 4))
    );
}

// Function to calculate angular size in radians
function calculateAngularSize(radius: number, distance: number): number {
    // Using small angle approximation
    return (2 * radius) / (distance * 3.086e16); // distance converted to meters from parsecs
}

export default function getStarAngularSize(
    distance: number,
    magnitude: number,
    bp_rp_color: number,
    temperature?: number
) {
    let temp = temperature ??estimateTemperature(bp_rp_color);

    const luminosity = calculateLuminosity(magnitude, distance);
    const radius = calculateRadius(luminosity, temp);
    let angularSize = calculateAngularSize(radius, distance);
    if (temperature == null) angularSize /= 10;
    
    return (angularSize * 180) / Math.PI;
}