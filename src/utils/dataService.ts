import { normativeData } from '../data/normativeData';
import type { SportNorms, Gender } from '../types';

const STORAGE_KEY = 'srs_normative_data';

// Shared helper to ensure consistent sport naming across the entire app
export const normalizeSportName = (name: string): string => {
    return name.trim().replace(/[–—]/g, '-');
};

export const getNormativeData = (): { [key: string]: SportNorms } => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return normativeData;

    try {
        let parsed = JSON.parse(stored);

        // 1. CLEANUP & NORMALIZE: Ensure dash consistency and remove legacy grouped sports
        let modified = false;

        // Map of legacy/incorrect names to new ones if necessary
        const legacyJumps = 'Track & Field - Jumps (High/Long/Triple)';

        Object.keys(parsed).forEach(key => {
            // Standardize all dashes to hyphens
            const normalizedKey = normalizeSportName(key);
            if (normalizedKey !== key) {
                parsed[normalizedKey] = parsed[key];
                delete parsed[key];
                modified = true;
            }
        });

        // Specific legacy removal
        Object.keys(parsed).forEach(key => {
            if (key === legacyJumps || (key.includes('Jumps') && key.includes('/'))) {
                delete parsed[key];
                modified = true;
            }
            // Also remove the old "Long Distance" combined key if it exists
            if (key.includes('Long Distance') && (key.includes('5000m') || key.includes('10000m'))) {
                delete parsed[key];
                modified = true;
            }
        });

        if (modified) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }

        const merged = { ...normativeData };
        const AGES = ['10', '11', '12', '13', '14', '15', '16'];
        const GENDERS: Gender[] = ['Male', 'Female'];

        // Final standard list of metrics we expect
        const METRICS = ['height', 'weight', 'bmi', 'shoulderGirth', 'hipCircumference', 'waistCircumference', 'skinfold', 'hipToToe', 'anatomy', 'verticalJump', 'sitAndReach', 'plankTest', 'tTest', 'reactionTime', 'responseTime', 'sprint40m', 'accuracy', 'balance', 'coordination'];

        // Helper to ensure an age object has all metric slots
        const ensureMetrics = (ageObj: Record<string, any>) => {
            METRICS.forEach(m => {
                if (!ageObj[m]) ageObj[m] = { p10: 0, p25: 0, p50: 0, p75: 0, p90: 0 };
            });
        };

        // Deep merge: only keep user data for sports that actually exist in the current system
        Object.keys(parsed).forEach(sport => {
            const cleanSport = normalizeSportName(sport);
            if (!merged[cleanSport]) return; // definitely ignore legacy sports not in the current system

            GENDERS.forEach(g => {
                if (!merged[cleanSport][g]) merged[cleanSport][g] = {};

                AGES.forEach(age => {
                    const sourceAgeData = merged[cleanSport][g][age] || {};
                    const userAgeData = (parsed[sport] && parsed[sport][g] && parsed[sport][g][age]) ? parsed[sport][g][age] : {};

                    merged[cleanSport][g][age] = {
                        ...sourceAgeData,
                        ...userAgeData
                    };

                    ensureMetrics(merged[cleanSport][g][age]);
                });
            });
        });

        Object.keys(merged).forEach(sport => {
            GENDERS.forEach(g => {
                AGES.forEach(age => {
                    if (!merged[sport][g][age]) merged[sport][g][age] = {};
                    ensureMetrics(merged[sport][g][age]);
                });
            });
        });

        return merged;
    } catch {
        return normativeData;
    }
};

export const saveNormativeData = (data: { [key: string]: SportNorms }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const resetNormativeData = () => {
    localStorage.removeItem(STORAGE_KEY);
};

export const addSport = (sportName: string) => {
    const data = getNormativeData();
    if (data[sportName]) return;

    data[sportName] = JSON.parse(JSON.stringify(normativeData.Basketball));
    saveNormativeData(data);
};

export const deleteSport = (sportName: string) => {
    const data = getNormativeData();
    delete data[sportName];
    saveNormativeData(data);
};
