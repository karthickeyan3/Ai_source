import { normalizeSportName } from './dataService';

export interface SportWeights {
    speed: number;
    agility: number;
    power: number;
    endurance: number;
    strength: number;
    flexibility: number;
    jumping: number;
}

export interface SportConfig {
    name: string;
    weights: SportWeights;
}

const STORAGE_KEY = 'srs_sport_weights';

const DEFAULT_WEIGHTS: Record<string, SportConfig> = {
    'Basketball': {
        name: 'Basketball',
        weights: { speed: 18, agility: 25, power: 15, endurance: 10, strength: 10, flexibility: 10, jumping: 12 }
    },
    'Cricket': {
        name: 'Cricket',
        weights: { speed: 15, agility: 25, power: 10, endurance: 20, strength: 10, flexibility: 15, jumping: 5 }
    },
    'Tennis': {
        name: 'Tennis',
        weights: { speed: 15, agility: 20, power: 15, endurance: 15, strength: 10, flexibility: 15, jumping: 10 }
    },
    'Swimming - Sprint (50m/100m)': {
        name: 'Swimming - Sprint (50m/100m)',
        weights: { speed: 25, agility: 10, power: 25, endurance: 15, strength: 15, flexibility: 10, jumping: 0 }
    },
    'Swimming - Distance (400m/1500m)': {
        name: 'Swimming - Distance (400m/1500m)',
        weights: { speed: 10, agility: 10, power: 15, endurance: 30, strength: 15, flexibility: 10, jumping: 10 }
    },
    'Track & Field - Sprint (100m/200m)': {
        name: 'Track & Field - Sprint (100m/200m)',
        weights: { speed: 30, agility: 10, power: 25, endurance: 5, strength: 10, flexibility: 10, jumping: 10 }
    },
    'Track & Field - Middle Distance (800m/1500m)': {
        name: 'Track & Field - Middle Distance (800m/1500m)',
        weights: { speed: 15, agility: 10, power: 15, endurance: 30, strength: 10, flexibility: 10, jumping: 10 }
    },
    'Track & Field - Long Distance (5K/10K)': {
        name: 'Track & Field - Long Distance (5K/10K)',
        weights: { speed: 10, agility: 10, power: 10, endurance: 30, strength: 15, flexibility: 15, jumping: 10 }
    },
    'Track & Field - High Jump': {
        name: 'Track & Field - High Jump',
        weights: { speed: 10, agility: 10, power: 25, endurance: 5, strength: 10, flexibility: 15, jumping: 25 }
    },
    'Track & Field - Long Jump': {
        name: 'Track & Field - Long Jump',
        weights: { speed: 25, agility: 10, power: 25, endurance: 5, strength: 10, flexibility: 5, jumping: 20 }
    },
    'Track & Field - Triple Jump': {
        name: 'Track & Field - Triple Jump',
        weights: { speed: 20, agility: 10, power: 25, endurance: 5, strength: 15, flexibility: 5, jumping: 20 }
    },
    'Track & Field - Throws (Shot/Discus/Javelin)': {
        name: 'Track & Field - Throws (Shot/Discus/Javelin)',
        weights: { speed: 10, agility: 5, power: 25, endurance: 10, strength: 30, flexibility: 10, jumping: 10 }
    },
    'Gymnastics': {
        name: 'Gymnastics',
        weights: { speed: 10, agility: 20, power: 15, endurance: 10, strength: 15, flexibility: 20, jumping: 10 }
    },
    'Volleyball': {
        name: 'Volleyball',
        weights: { speed: 15, agility: 20, power: 15, endurance: 15, strength: 10, flexibility: 10, jumping: 15 }
    },
    'Cycling': {
        name: 'Cycling',
        weights: { speed: 10, agility: 10, power: 20, endurance: 30, strength: 20, flexibility: 5, jumping: 5 }
    },
    'Rowing': {
        name: 'Rowing',
        weights: { speed: 10, agility: 10, power: 25, endurance: 25, strength: 20, flexibility: 5, jumping: 5 }
    },
    'Soccer': {
        name: 'Soccer',
        weights: { speed: 20, agility: 20, power: 15, endurance: 15, strength: 10, flexibility: 5, jumping: 15 }
    }
};

export const getSportWeights = (): Record<string, SportConfig> => {
    try {
        if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_WEIGHTS;
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return DEFAULT_WEIGHTS;
        let parsed = JSON.parse(stored);

        // Migration logic
        let modified = false;

        // 1. CLEANUP & NORMALIZE: Ensure dash consistency and remove legacy/stale format
        Object.keys(parsed).forEach(key => {
            const normalizedKey = normalizeSportName(key);
            if (normalizedKey !== key) {
                parsed[normalizedKey] = { ...parsed[key], name: normalizedKey };
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

        // 3. Clear out cached biased weights (legacy concentrated profiles)
        Object.keys(parsed).forEach(key => {
            if (parsed[key]?.weights) {
                const w = parsed[key].weights;
                // Flush any profile where a single attribute exceeds the 30% cap
                if (w.jumping === 45 || w.endurance === 0 || w.endurance === 40 || w.speed === 35) {
                    delete parsed[key];
                    modified = true;
                }
            }
        });

        if (modified) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }

        // Merge: defaults first, then overrides on top (ensures new sports appear)
        return { ...DEFAULT_WEIGHTS, ...parsed };
    } catch (e) {
        console.error('Error loading sport weights:', e);
        return DEFAULT_WEIGHTS;
    }
};

export const saveSportWeights = (data: Record<string, SportConfig>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const addSportWeight = (name: string) => {
    const data = getSportWeights();
    if (data[name]) return;

    data[name] = {
        name,
        weights: { speed: 15, agility: 15, power: 15, endurance: 15, strength: 15, flexibility: 15, jumping: 10 }
    };
    saveSportWeights(data);
};

export const deleteSportWeight = (name: string) => {
    const data = getSportWeights();
    delete data[name];
    saveSportWeights(data);
};
