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
        min: 100,
        max: 250,
        step: 0.1,
        hint: 'Valid range for youth athletes (age 10-16): 100 - 250 cm',
    },

    /**
     * Weight: 10-yr-old ~25-40 kg; 16-yr-old up to ~100 kg for a large athlete.
     * 25 kg is a very slight 10-year-old; 120 kg is an outlier upper bound.
     */
    weight: {
        min: 15,
        max: 130,
        step: 0.1,
        hint: 'Valid range for youth athletes (age 10-16): 15 - 130 kg',
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
     * 10 cm min = very weak; 80 cm max = exceptional elite teenage athlete.
     */
    verticalJump: {
        min: 7,
        max: 90,
        step: 0.1,
        hint: 'Vertical jump: 7 - 90 cm (typical youth: 20 - 55 cm)',
    },

    /**
     * Sit & reach flexibility test.
     * Negative values are valid (tight hamstrings). Max ~55 cm for very flexible athletes.
     */
    sitAndReach: {
        min: -20,
        max: 60,
        step: 0.1,
        hint: 'Sit & reach: −20 to 60 cm (negative = below foot-line)',
    },

    /**
     * Plank test (seconds): 10 s min (struggle); 480 s max (8 min = exceptional).
     * Average youth: 60-180 s.
     */
    plankTest: {
        min: 7,
        max: 500,
        step: 1,
        hint: 'Plank hold: 7 - 500 s (typical youth: 60 - 180 s)',
    },

    /**
     * T-Test agility (seconds, lower = faster):
     * Elite youth: ~8.5 s. Typical: 10-13 s. Max 18 s = very slow.
     * min 7.5 s = physically achievable lower bound for top youth athlete.
     */
    tTest: {
        min: 7.5,
        max: 18.0,
        step: 0.01,
        hint: 'T-Test: 7.5 - 18 s (lower = better; typical youth: 10 - 13 s)',
    },

    /**
     * Reaction time (seconds, lower = faster):
     * Human neurophysiology lower limit ≈ 0.10 s (100 ms).
     * Typical youth: 0.20-0.45 s. Slow: >0.65 s.
     */
    reactionTime: {
        min: 0.10,
        max: 1.20,
        step: 0.001,
        hint: 'Reaction time: 0.10 - 1.20 s (lower = better; typical: 0.35 - 0.65 s)',
    },

    /**
     * Response time (seconds): slightly longer than reaction time.
     * Includes the execution motor component. 0.12 s minimum is realistic.
     */
    responseTime: {
        min: 0.15,
        max: 2.00,
        step: 0.001,
        hint: 'Response time: 0.15 - 2.00 s (lower = better; typical: 0.50 - 1.10 s)',
    },

    /**
     * 40m sprint (seconds, lower = faster):
     * Elite youth sprinters: ~5.0 s. Average 10-yr-old: ~8.0 s.
     * 4.5 s minimum = absolute fastest possible for a 16-year-old.
     * 11.0 s maximum = very slow jog.
     */
    sprint40m: {
        min: 4.5,
        max: 13.0,
        step: 0.01,
        hint: '40m sprint: 4.5 - 13.0 s (lower = better; typical youth: 5.5 - 8.5 s)',
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
