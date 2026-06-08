import { normalizeSportName } from './dataService';
import { SPORT_ANCHORS_14 } from '../data/sportAnchors_1';
import { SPORT_ANCHORS_14_PART2 } from '../data/sportAnchors_2';
import { SPORT_ANCHORS_14_PART3 } from '../data/sportAnchors_3';

export type SportAnchor = {
    Male: Record<string, { p10: number; p25: number; p50: number; p75: number; p90: number; }>;
    Female: Record<string, { p10: number; p25: number; p50: number; p75: number; p90: number; }>;
};

export const DEFAULT_SPORT_ANCHORS: Record<string, SportAnchor> = {
    ...SPORT_ANCHORS_14,
    ...SPORT_ANCHORS_14_PART2,
    ...SPORT_ANCHORS_14_PART3
};

const STORAGE_KEY = 'srs_sport_anchors_v2';

export const getSportProfiles = (): Record<string, SportAnchor> => {
    try {
        if (typeof window === 'undefined' || !window.localStorage) return JSON.parse(JSON.stringify(DEFAULT_SPORT_ANCHORS));
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return JSON.parse(JSON.stringify(DEFAULT_SPORT_ANCHORS));
        
        const parsed: Record<string, SportAnchor> = JSON.parse(stored);
        let modified = false;

        Object.keys(parsed).forEach(key => {
            const normalizedKey = normalizeSportName(key);
            if (normalizedKey !== key) {
                parsed[normalizedKey] = parsed[key];
                delete parsed[key];
                modified = true;
            }
        });

        if (modified) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }

        const defaults: Record<string, SportAnchor> = JSON.parse(JSON.stringify(DEFAULT_SPORT_ANCHORS));
        Object.keys(parsed).forEach(sport => {
            if (!defaults[sport]) {
                defaults[sport] = parsed[sport];
            } else {
                (['Male', 'Female'] as const).forEach((gender) => {
                    if (parsed[sport][gender]) {
                        if (!defaults[sport][gender]) (defaults[sport] as any)[gender] = {};
                        Object.keys(parsed[sport][gender]).forEach(metric => {
                            (defaults[sport][gender] as any)[metric] = parsed[sport][gender][metric];
                        });
                    }
                });
            }
        });

        return defaults;
    } catch {
        return JSON.parse(JSON.stringify(DEFAULT_SPORT_ANCHORS));
    }
};

export const saveSportProfiles = (profiles: Record<string, SportAnchor>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};

export const resetSportProfile = (sport: string) => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const parsed: Record<string, SportAnchor> = stored ? JSON.parse(stored) : {};
        delete parsed[sport];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch { /* ignore */ }
};

export const METRIC_KEYS = [
    'height', 'weight', 'bmi', 'shoulderGirth', 'hipCircumference', 'waistCircumference',
    'skinfold', 'hipToToe', 'verticalJump', 'sitAndReach', 'plankTest', 'tTest', 
    'reactionTime', 'responseTime', 'sprint40m', 'anatomy', 'accuracy', 'balance', 'coordination'
];
