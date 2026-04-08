import type { SportNorms, NormativeBreakpoints } from '../types';
import { getSportProfiles } from '../utils/sportProfileService';

/**
 * Core Normative Data for all sports (Ages 10-16).
 * Based on High-Performance Athletic Standards ("Ligits").
 */
export const normativeData: { [key: string]: SportNorms } = {};

const sportsList = [
    'Basketball', 'Soccer', 'Cricket', 'Tennis', 'Swimming', 'Track & Field', 'Gymnastics', 'Volleyball', 'Cycling', 'Rowing',
    'Swimming - Sprint (50m/100m)', 'Swimming - Distance (400m/1500m)',
    'Track & Field - Sprint (100m/200m)', 'Track & Field - Middle Distance (800m/1500m)', 'Track & Field - Long Distance (5K/10K)',
    'Track & Field - High Jump', 'Track & Field - Long Jump', 'Track & Field - Triple Jump',
    'Track & Field - Throws (Shot/Discus/Javelin)'
];

const initializeAllSports = () => {
    const ALL_SPORT_ANCHORS = getSportProfiles();

    // Combine base sports list with any dynamically added sports from the dashboard
    const uniqueSports = Array.from(new Set([...sportsList, ...Object.keys(ALL_SPORT_ANCHORS)]));

    uniqueSports.forEach(sport => {
        normativeData[sport] = { Male: {}, Female: {} } as any;

        (['Male', 'Female'] as const).forEach(g => {
            // Use the specific sport anchor, fallback to Basketball if missing
            const anchor = ALL_SPORT_ANCHORS[sport]?.[g] || ALL_SPORT_ANCHORS['Basketball'][g];

            for (let age = 10; age <= 16; age++) {
                const a = age.toString();
                const ageDiff = age - 14;
                const growFrom14 = 1 + (ageDiff * 0.025); // Physical size growth (2.5%/yr)
                const perfGrow = 1 + (ageDiff * 0.06);     // Performance growth (6%/yr)
                const invPerfGrow = 1 - (ageDiff * 0.06);  // Inverse performance (slower when younger)

                // Initialize the age object
                normativeData[sport][g][a] = {} as any;

                // Helper for scaling a breakpoint set
                const scaleBp = (bp: NormativeBreakpoints, factor: number) => ({
                    p10: Math.round(bp.p10 * factor * 10) / 10,
                    p25: Math.round(bp.p25 * factor * 10) / 10,
                    p50: Math.round(bp.p50 * factor * 10) / 10,
                    p75: Math.round(bp.p75 * factor * 10) / 10,
                    p90: Math.round(bp.p90 * factor * 10) / 10,
                } as NormativeBreakpoints);

                const scaleBpFloat = (bp: NormativeBreakpoints, factor: number, precision: number) => {
                    const m = Math.pow(10, precision);
                    return {
                        p10: Math.round(bp.p10 * factor * m) / m,
                        p25: Math.round(bp.p25 * factor * m) / m,
                        p50: Math.round(bp.p50 * factor * m) / m,
                        p75: Math.round(bp.p75 * factor * m) / m,
                        p90: Math.round(bp.p90 * factor * m) / m,
                    } as NormativeBreakpoints;
                };

                // --- 1. Physical Metrics (scaled by growFrom14 directly from anchor) ---
                normativeData[sport][g][a].height = scaleBp(anchor.height, growFrom14);
                normativeData[sport][g][a].weight = scaleBp(anchor.weight, growFrom14);

                // --- 2. BMI (Physiologically accurate: scale by weight_growth / height_growth²) ---
                const bmiScale = growFrom14 / (growFrom14 * growFrom14); // = 1 / growFrom14
                normativeData[sport][g][a].bmi = scaleBpFloat(anchor.bmi, bmiScale, 1);

                // --- 3. Performance Metrics (scaled by perfGrow/invPerfGrow directly from anchor) ---
                normativeData[sport][g][a].verticalJump = scaleBp(anchor.verticalJump, perfGrow);
                normativeData[sport][g][a].plankTest = scaleBp(anchor.plankTest, perfGrow);
                normativeData[sport][g][a].sitAndReach = scaleBp(anchor.sitAndReach, perfGrow);

                normativeData[sport][g][a].sprint40m = scaleBpFloat(anchor.sprint40m, invPerfGrow, 2);
                normativeData[sport][g][a].tTest = scaleBpFloat(anchor.tTest, invPerfGrow, 2);

                normativeData[sport][g][a].reactionTime = scaleBpFloat(anchor.reactionTime, invPerfGrow, 3);
                normativeData[sport][g][a].responseTime = scaleBpFloat(anchor.responseTime, invPerfGrow, 3);

                // --- 4. Structural Metrics (scaled by growFrom14) ---
                normativeData[sport][g][a].shoulderGirth = scaleBp(anchor.shoulderGirth, growFrom14);
                normativeData[sport][g][a].hipCircumference = scaleBp(anchor.hipCircumference, growFrom14);
                normativeData[sport][g][a].hipToToe = scaleBp(anchor.hipToToe, growFrom14);

                // Waist and Skinfold — scale with body growth (not flat)
                normativeData[sport][g][a].waistCircumference = scaleBp(anchor.waistCircumference, growFrom14);
                normativeData[sport][g][a].skinfold = scaleBp(anchor.skinfold, growFrom14);
            }
        });
    });
};

initializeAllSports();

export const rebuildNormativeData = () => {
    initializeAllSports();
};
