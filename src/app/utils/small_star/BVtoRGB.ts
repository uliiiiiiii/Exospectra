export default function BVtoRGB(bv: number) {
    return OLD(bv-0.5);
}

function OLD(bv: number) {
    if (bv < -0.4) bv = -0.4;
    if (bv > 2.0) bv = 2.0;

    let r = 0.0,
        g = 0.0,
        b = 0.0;

    // Red component
    if (-0.4 <= bv && bv < 0.0) {
        const t = (bv + 0.4) / (0.0 + 0.4);
        r = 0.61 + 0.11 * t + 0.1 * t * t;
    } else if (0.0 <= bv && bv < 0.4) {
        const t = (bv - 0.0) / (0.4 - 0.0);
        r = 0.83 + 0.17 * t;
    } else if (0.4 <= bv && bv <= 2.1) {
        const t = (bv - 0.4) / (2.1 - 0.4);
        r = 1.0;
    }

    // Green component
    if (-0.4 <= bv && bv < 0.0) {
        const t = (bv + 0.4) / (0.0 + 0.4);
        g = 0.7 + 0.07 * t + 0.1 * t * t;
    } else if (0.0 <= bv && bv < 0.4) {
        const t = (bv - 0.0) / (0.4 - 0.0);
        g = 0.87 + 0.11 * t;
    } else if (0.4 <= bv && bv < 1.6) {
        const t = (bv - 0.4) / (1.6 - 0.4);
        g = 0.98 - 0.16 * t;
    } else if (1.6 <= bv && bv <= 2.0) {
        const t = (bv - 1.6) / (2.0 - 1.6);
        g = 0.82 - 0.5 * t * t;
    }

    // Blue component
    if (-0.4 <= bv && bv < 0.4) {
        const t = (bv + 0.4) / (0.4 + 0.4);
        b = 1.0;
    } else if (0.4 <= bv && bv < 1.5) {
        const t = (bv - 0.4) / (1.5 - 0.4);
        b = 1.0 - 0.47 * t + 0.1 * t * t;
    } else if (1.5 <= bv && bv <= 1.94) {
        const t = (bv - 1.5) / (1.94 - 1.5);
        b = 0.63 - 0.6 * t * t;
    }

    return { r, g, b };
}