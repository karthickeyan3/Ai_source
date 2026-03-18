import { normativeData } from '../data/normativeData';
import type { SportNorms, Gender } from '../types';

const STORAGE_KEY = 'srs_normative_data';

export const getNormativeData = (): { [key: string]: SportNorms } => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return normativeData;

    try {
        let parsed = JSON.parse(stored);

        const newKey = 'Track & Field - Long Distance (5K/10K)';

        Object.keys(parsed).forEach(key => {
            if (key.includes('Long Distance') && (key.includes('5000m') || key.includes('10000m'))) {
                parsed[newKey] = parsed[key];
                if (key !== newKey) delete parsed[key];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
            }
        });

        const merged = { ...normativeData };
        const AGES = ['10', '11', '12', '13', '14', '15', '16'];
        const GENDERS: Gender[] = ['Male', 'Female'];

        // Final standard list of metrics we expect
        const METRICS = ['height', 'weight', 'bmi', 'shoulderGirth', 'hipCircumference', 'waistCircumference', 'skinfold', 'hipToToe', 'verticalJump', 'sitAndReach', 'plankTest', 'tTest', 'reactionTime', 'responseTime', 'sprint40m'];

        // Helper to ensure an age object has all metric slots
        const ensureMetrics = (ageObj: Record<string, any>) => {
            METRICS.forEach(m => {
                if (!ageObj[m]) ageObj[m] = { p10: 0, p25: 0, p50: 0, p75: 0, p90: 0 };
            });
        };

        // Deep merge logic to ensure new metrics/ages/sports appear
        Object.keys(parsed).forEach(sport => {
            if (!merged[sport]) {
                merged[sport] = parsed[sport];
            }

            GENDERS.forEach(g => {
                if (!merged[sport][g]) merged[sport][g] = {};

                AGES.forEach(age => {
                    const sourceAgeData = merged[sport][g][age] || {};
                    const userAgeData = (parsed[sport] && parsed[sport][g] && parsed[sport][g][age]) ? parsed[sport][g][age] : {};

                    merged[sport][g][age] = {
                        ...sourceAgeData,
                        ...userAgeData
                    };

                    ensureMetrics(merged[sport][g][age]);
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
