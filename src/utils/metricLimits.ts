/**
 * Physiologically valid min/max limits for youth athletes aged 10-16.
 *
 * Sources / rationale:
 *  - WHO Child Growth Standards (height/weight)
 *  - NSCA Youth Athletic Testing norms
 *  - Published T-Test, 40m sprint, vertical jump norms for youth
 *  - Human reaction time physiology (minimum ~110 ms)
 */
export interface MetricLimit {
    min: number;
    max: number;
    step: number;
    hint: string;
}

export const METRIC_LIMITS: Record<string, MetricLimit> = {

    // ── Body Metrics ───────────────────────────────────────────────────────
    /**
     * Height: typical 10-yr-old ~130 cm, 16-yr-old up to ~195 cm.
     * Absolute bounds allow for very short or very tall youth athletes.
     */
    height: {
        min: 10,
        max: 300,
        step: 0.1,
        hint: 'Height measurement (cm)',
    },

    /**
     * Weight: effectively unrestricted.
     */
    weight: {
        min: 5,
        max: 500,
        step: 0.1,
        hint: 'Weight measurement (kg)',
    },

    /**
     * Shoulder width/circumference.
     * Allow lower bound for width measurements (30cm) up to large circumferences.
     */
    shoulderGirth: {
        min: 20,
        max: 135,
        step: 0.1,
        hint: 'Shoulder width/circumference: 20 - 135 cm for youth athletes',
    },

    /**
     * Hip circumference: slim 10-yr-old ~60 cm, larger 16-yr-old ~110 cm.
     */
    hipCircumference: {
        min: 30,
        max: 130,
        step: 0.1,
        hint: 'Hip circumference: 30 - 130 cm for youth athletes',
    },

    /**
     * Waist circumference: typically 55-90 cm for youth.
     * Upper bound 110 cm accounts for higher BMI cases.
     */
    waistCircumference: {
        min: 30,
        max: 125,
        step: 0.1,
        hint: 'Waist circumference: 30 - 125 cm for youth athletes',
    },

    /**
     * Skinfold (mm): could be a single-site or sum-of-sites measurement.
     * Very lean athletes: ~4 mm; higher body-fat youth: ~50 mm.
     */
    skinfold: {
        min: 2,
        max: 70,
        step: 0.1,
        hint: 'Skinfold thickness: 2 - 70 mm',
    },

    /**
     * Hip-to-toe (leg length): for a 120 cm child ~70 cm; for a tall 210 cm teen ~120 cm.
     */
    hipToToe: {
        min: 55,
        max: 135,
        step: 0.1,
        hint: 'Leg length (hip to toe): 55 - 135 cm for youth athletes',
    },

    // ── Performance Metrics ────────────────────────────────────────────────
    /**
     * Vertical jump: typical youth range 20-55 cm.
     * 5 cm min = baseline; 120 cm max = world-class elite athlete profile.
     */
    verticalJump: {
        min: 5,
        max: 120,
        step: 0.1,
        hint: 'Vertical jump: 5 - 120 cm (typical youth: 20 - 55 cm)',
    },

    /**
     * Sit & reach flexibility test.
     * Negative values are valid (tight hamstrings). Max ~65 cm for extreme flexibility.
     */
    sitAndReach: {
        min: 3,
        max: 70,
        step: 0.1,
        hint: 'Sit & reach: −30 to 70 cm (negative = below foot-line)',
    },

    /**
     * Plank test (seconds): 5 s min; 900 s max (15 min = extreme endurance).
     */
    plankTest: {
        min: 5,
        max: 900,
        step: 1,
        hint: 'Plank hold: 5 - 900 s (typical youth: 60 - 180 s)',
    },

    /**
     * T-Test agility (seconds, lower = faster):
     * Absolute world-class youth lower bound ≈ 6.0 s.
     */
    tTest: {
        min: 6.0,
        max: 25.0,
        step: 0.01,
        hint: 'T-Test: 6.0 - 25 s (lower = better; typical youth: 10 - 13 s)',
    },

    /**
     * Reaction time (seconds, lower = faster):
     * Extreme human limit ≈ 0.05 s.
     */
    reactionTime: {
        min: 0.05,
        max: 2.00,
        step: 0.001,
        hint: 'Reaction time: 0.05 - 2.00 s (lower = better; typical: 0.35 - 0.65 s)',
    },

    /**
     * Response time (seconds): 0.10 s minimum for motor execution.
     */
    responseTime: {
        min: 0.10,
        max: 3.50,
        step: 0.001,
        hint: 'Response time: 0.10 - 3.50 s (lower = better; typical: 0.50 - 1.10 s)',
    },

    /**
     * 40m sprint (seconds, lower = faster):
     * Relaxed to allow for record-breaking youth prodigies (down to 3.5s).
     */
    sprint40m: {
        min: 3.5,
        max: 15.0,
        step: 0.01,
        hint: '40m sprint: 3.5 - 15.0 s (lower = better; typical youth: 5.5 - 8.5 s)',
    },
};

/**
 * Clamp a single metric value to its allowed range.
 * Returns the original value if no limit entry exists for that key.
 */
export const clampMetric = (key: string, value: number): number => {
    const limit = METRIC_LIMITS[key];
    if (!limit) return value;
    return Math.min(limit.max, Math.max(limit.min, value));
};

/**
 * Clamp every numeric metric field in a plain data object.
 * Returns a shallow copy with all metrics clamped.
 */
export const clampFormData = (data: Record<string, unknown>): Record<string, unknown> => {
    const result: Record<string, unknown> = { ...data };
    Object.keys(METRIC_LIMITS).forEach((key) => {
        const raw = result[key];
        if (typeof raw === 'number' && !isNaN(raw)) {
            result[key] = clampMetric(key, raw);
        }
    });
    return result;
};
