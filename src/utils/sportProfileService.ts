import { normalizeSportName } from './dataService';

/**
 * Sport Profile Service
 * Manages localStorage overrides for sport normative profiles.
 * Each profile controls:
 *   - heightRange: [p50cm, p90cm] for Age-14 Male baseline
 *   - weightRange: [p50kg, p90kg] for Age-14 Male baseline
 *   - multipliers for each performance metric
 */

export interface SportProfileOverride {
    heightP50: number;  // Age-14 Male median height (cm)
    heightP90: number;  // Age-14 Male elite height (cm)
    weightP50: number;  // Age-14 Male median weight (kg)
    weightP90: number;  // Age-14 Male elite weight (kg)
    verticalJumpMult: number;
    sprintMult: number;
    tTestMult: number;
    reactionTimeMult: number;
    plankTestMult: number;
    sitAndReachMult: number;
}

const STORAGE_KEY = 'srs_sport_profiles';

/** Default hardcoded profiles (mirrors normativeData.ts sportProfiles) */
export const DEFAULT_SPORT_PROFILES: Record<string, SportProfileOverride> = {
    'Soccer':                                    { heightP50: 165, heightP90: 175, weightP50: 55, weightP90: 70, verticalJumpMult: 0.88, sprintMult: 0.94, tTestMult: 0.95, reactionTimeMult: 1.03, plankTestMult: 0.93, sitAndReachMult: 0.91 },
    'Track & Field':                             { heightP50: 164, heightP90: 175, weightP50: 52, weightP90: 66, verticalJumpMult: 1.02, sprintMult: 0.91, tTestMult: 1.03, reactionTimeMult: 0.95, plankTestMult: 0.84, sitAndReachMult: 0.96 },
    'Swimming':                                  { heightP50: 170, heightP90: 182, weightP50: 60, weightP90: 76, verticalJumpMult: 0.72, sprintMult: 1.15, tTestMult: 1.10, reactionTimeMult: 1.11, plankTestMult: 1.12, sitAndReachMult: 1.09 },
    'Gymnastics':                                { heightP50: 148, heightP90: 158, weightP50: 38, weightP90: 52, verticalJumpMult: 1.03, sprintMult: 1.08, tTestMult: 1.02, reactionTimeMult: 1.04, plankTestMult: 1.30, sitAndReachMult: 1.41 },
    'Cricket':                                   { heightP50: 166, heightP90: 178, weightP50: 58, weightP90: 74, verticalJumpMult: 0.78, sprintMult: 1.04, tTestMult: 1.04, reactionTimeMult: 0.88, plankTestMult: 0.88, sitAndReachMult: 0.87 },
    'Tennis':                                    { heightP50: 168, heightP90: 180, weightP50: 58, weightP90: 72, verticalJumpMult: 0.86, sprintMult: 1.02, tTestMult: 0.93, reactionTimeMult: 0.96, plankTestMult: 0.93, sitAndReachMult: 0.98 },
    'Volleyball':                                { heightP50: 175, heightP90: 188, weightP50: 66, weightP90: 82, verticalJumpMult: 1.10, sprintMult: 1.04, tTestMult: 1.02, reactionTimeMult: 0.96, plankTestMult: 0.93, sitAndReachMult: 0.96 },
    'Cycling':                                   { heightP50: 162, heightP90: 174, weightP50: 50, weightP90: 64, verticalJumpMult: 0.70, sprintMult: 1.15, tTestMult: 1.10, reactionTimeMult: 1.11, plankTestMult: 1.21, sitAndReachMult: 0.91 },
    'Rowing':                                    { heightP50: 172, heightP90: 186, weightP50: 70, weightP90: 88, verticalJumpMult: 0.81, sprintMult: 1.15, tTestMult: 1.10, reactionTimeMult: 1.18, plankTestMult: 1.40, sitAndReachMult: 1.04 },
    'Swimming - Sprint (50m/100m)':              { heightP50: 172, heightP90: 184, weightP50: 62, weightP90: 78, verticalJumpMult: 0.85, sprintMult: 1.05, tTestMult: 1.05, reactionTimeMult: 0.95, plankTestMult: 1.15, sitAndReachMult: 1.05 },
    'Swimming - Distance (400m/1500m)':          { heightP50: 168, heightP90: 180, weightP50: 58, weightP90: 74, verticalJumpMult: 0.65, sprintMult: 1.20, tTestMult: 1.15, reactionTimeMult: 1.15, plankTestMult: 1.25, sitAndReachMult: 1.10 },
    'Track & Field - Sprint (100m/200m)':        { heightP50: 165, heightP90: 178, weightP50: 55, weightP90: 70, verticalJumpMult: 1.15, sprintMult: 0.85, tTestMult: 1.00, reactionTimeMult: 0.90, plankTestMult: 0.90, sitAndReachMult: 0.90 },
    'Track & Field - Middle Distance (800m/1500m)': { heightP50: 162, heightP90: 174, weightP50: 50, weightP90: 64, verticalJumpMult: 0.85, sprintMult: 0.95, tTestMult: 1.05, reactionTimeMult: 1.05, plankTestMult: 1.10, sitAndReachMult: 0.95 },
    'Track & Field - Long Distance (5K/10K)':    { heightP50: 158, heightP90: 170, weightP50: 45, weightP90: 58, verticalJumpMult: 0.70, sprintMult: 1.05, tTestMult: 1.10, reactionTimeMult: 1.15, plankTestMult: 1.35, sitAndReachMult: 1.00 },
    'Track & Field - Jumps (High)':              { heightP50: 174, heightP90: 186, weightP50: 58, weightP90: 72, verticalJumpMult: 1.30, sprintMult: 0.97, tTestMult: 0.96, reactionTimeMult: 0.96, plankTestMult: 1.02, sitAndReachMult: 1.20 },
    'Track & Field - Jumps (Long)':              { heightP50: 170, heightP90: 181, weightP50: 58, weightP90: 72, verticalJumpMult: 1.20, sprintMult: 0.88, tTestMult: 0.94, reactionTimeMult: 0.93, plankTestMult: 0.98, sitAndReachMult: 1.08 },
    'Track & Field - Jumps (Triple)':            { heightP50: 171, heightP90: 182, weightP50: 60, weightP90: 75, verticalJumpMult: 1.24, sprintMult: 0.90, tTestMult: 0.93, reactionTimeMult: 0.92, plankTestMult: 1.08, sitAndReachMult: 1.05 },
    'Track & Field - Throws (Shot/Discus/Javelin)': { heightP50: 175, heightP90: 188, weightP50: 75, weightP90: 95, verticalJumpMult: 1.05, sprintMult: 1.10, tTestMult: 1.15, reactionTimeMult: 1.05, plankTestMult: 0.95, sitAndReachMult: 0.95 },
    'Basketball':                                { heightP50: 164, heightP90: 182, weightP50: 54, weightP90: 82, verticalJumpMult: 1.00, sprintMult: 1.00, tTestMult: 1.00, reactionTimeMult: 1.00, plankTestMult: 1.00, sitAndReachMult: 1.00 },
};

/** Load profiles: merged defaults + any localStorage overrides */
export const getSportProfiles = (): Record<string, SportProfileOverride> => {
    try {
        if (typeof window === 'undefined' || !window.localStorage) return { ...DEFAULT_SPORT_PROFILES };
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return { ...DEFAULT_SPORT_PROFILES };
        const parsed: Record<string, SportProfileOverride> = JSON.parse(stored);
        let modified = false;

        // 1. CLEANUP & NORMALIZE: Ensure dash consistency and remove legacy/stale format
        Object.keys(parsed).forEach(key => {
            const normalizedKey = normalizeSportName(key);
            if (normalizedKey !== key) {
                parsed[normalizedKey] = parsed[key];
                delete parsed[key];
                modified = true;
            }
        });

        // 2. Clear out legacy combined Jumps string
        Object.keys(parsed).forEach(key => {
            if (key.includes('Jumps') && key.includes('/')) {
                delete parsed[key];
                modified = true;
            }
        });

        if (modified) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }

        // Merge: defaults first, then overrides on top (ensures new sports appear)
        return { ...DEFAULT_SPORT_PROFILES, ...parsed };
    } catch {
        return { ...DEFAULT_SPORT_PROFILES };
    }
};

/** Save only the overridden profiles (delta from defaults) */
export const saveSportProfiles = (profiles: Record<string, SportProfileOverride>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};

/** Reset a single sport back to its default */
export const resetSportProfile = (sport: string) => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const parsed: Record<string, SportProfileOverride> = stored ? JSON.parse(stored) : {};
        delete parsed[sport];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch { /* ignore */ }
};

/** Multiplier field metadata for rendering labels/tooltips */
export const MULTIPLIER_FIELDS: { key: keyof SportProfileOverride; label: string; tooltip: string; inverse: boolean }[] = [
    { key: 'verticalJumpMult', label: 'Vert. Jump', tooltip: 'Higher = bigger jump standard for this sport (e.g. Volleyball: 1.10)', inverse: false },
    { key: 'sprintMult',       label: '40m Sprint', tooltip: 'Lower = faster sprint standard required (e.g. Sprinters: 0.85). Inverse metric.', inverse: true },
    { key: 'tTestMult',        label: 'T-Test',     tooltip: 'Lower = more agility required (e.g. Tennis: 0.93). Inverse metric.', inverse: true },
    { key: 'reactionTimeMult', label: 'Reaction',   tooltip: 'Lower = faster reflexes required (e.g. Cricket: 0.88). Inverse metric.', inverse: true },
    { key: 'plankTestMult',    label: 'Plank',      tooltip: 'Higher = more core endurance required (e.g. Rowing: 1.40)', inverse: false },
    { key: 'sitAndReachMult',  label: 'Flexibility',tooltip: 'Higher = more flexibility required (e.g. Gymnastics: 1.41)', inverse: false },
];
