import { normalizeSportName } from './dataService';

export interface SportWeights {
    speed: number;
    agility: number;
    power: number;
    endurance: number;
    strength: number;
    flexibility: number;
    jumping: number;
    anatomy: number;
    accuracy: number;
    balance: number;
    coordination: number;
}

export interface SportConfig {
    name: string;
    weights: SportWeights;
}

const STORAGE_KEY = 'srs_sport_weights';

const DEFAULT_WEIGHTS: Record<string, SportConfig> = {
    'Basketball': {
        name: 'Basketball',
        weights: { speed: 15, agility: 22, power: 12, endurance: 20, strength: 8, flexibility: 2, jumping: 2, anatomy: 5, accuracy: 4, balance: 4, coordination: 6 }
    },
    'Handball': {
        name: 'Handball',
        weights: { speed: 15, agility: 18, power: 12, endurance: 22, strength: 10, flexibility: 1, jumping: 2, anatomy: 4, accuracy: 5, balance: 3, coordination: 8 }
    },
    'Cricket': {
        name: 'Cricket',
        weights: { speed: 12, agility: 20, power: 8, endurance: 16, strength: 8, flexibility: 12, jumping: 4, anatomy: 3, accuracy: 8, balance: 3, coordination: 6 }
    },
    'Tennis': {
        name: 'Tennis',
        weights: { speed: 16, agility: 20, power: 10, endurance: 22, strength: 6, flexibility: 3, jumping: 2, anatomy: 3, accuracy: 6, balance: 5, coordination: 7 }
    },
    'Swimming - Sprint (50m/100m)': {
        name: 'Swimming - Sprint (50m/100m)',
        weights: { speed: 22, agility: 8, power: 22, endurance: 12, strength: 12, flexibility: 6, jumping: 2, anatomy: 6, accuracy: 2, balance: 3, coordination: 5 }
    },
    'Swimming - Distance (400m/1500m)': {
        name: 'Swimming - Distance (400m/1500m)',
        weights: { speed: 8, agility: 8, power: 12, endurance: 25, strength: 12, flexibility: 8, jumping: 8, anatomy: 6, accuracy: 2, balance: 4, coordination: 7 }
    },
    'Track & Field - Sprint (100m/200m)': {
        name: 'Track & Field - Sprint (100m/200m)',
        weights: { speed: 25, agility: 10, power: 25, endurance: 8, strength: 8, flexibility: 2, jumping: 5, anatomy: 5, accuracy: 2, balance: 3, coordination: 7 }
    },
    'Track & Field - Middle Distance (800m/1500m)': {
        name: 'Track & Field - Middle Distance (800m/1500m)',
        weights: { speed: 20, agility: 12, power: 12, endurance: 30, strength: 10, flexibility: 2, jumping: 0, anatomy: 5, accuracy: 2, balance: 4, coordination: 3 }
    },
    'Track & Field - Long Distance (5K/10K)': {
        name: 'Track & Field - Long Distance (5K/10K)',
        weights: { speed: 15, agility: 12, power: 5, endurance: 30, strength: 10, flexibility: 2, jumping: 0, anatomy: 10, accuracy: 2, balance: 6, coordination: 8 }
    },
    'Track & Field - High Jump': {
        name: 'Track & Field - High Jump',
        weights: { speed: 16, agility: 12, power: 24, endurance: 8, strength: 8, flexibility: 8, jumping: 4, anatomy: 6, accuracy: 3, balance: 5, coordination: 6 }
    },
    'Track & Field - Long Jump': {
        name: 'Track & Field - Long Jump',
        weights: { speed: 16, agility: 12, power: 24, endurance: 8, strength: 8, flexibility: 8, jumping: 4, anatomy: 6, accuracy: 3, balance: 5, coordination: 6 }
    },
    'Track & Field - Triple Jump': {
        name: 'Track & Field - Triple Jump',
        weights: { speed: 16, agility: 12, power: 24, endurance: 8, strength: 8, flexibility: 8, jumping: 4, anatomy: 5, accuracy: 2, balance: 6, coordination: 7 }
    },
    'Track & Field - Throws (Shot/Discus/Javelin)': {
        name: 'Track & Field - Throws (Shot/Discus/Javelin)',
        weights: { speed: 4, agility: 12, power: 26, endurance: 12, strength: 20, flexibility: 4, jumping: 2, anatomy: 6, accuracy: 5, balance: 4, coordination: 5 }
    },
    'Gymnastics': {
        name: 'Gymnastics',
        weights: { speed: 8, agility: 15, power: 12, endurance: 8, strength: 12, flexibility: 15, jumping: 8, anatomy: 4, accuracy: 3, balance: 8, coordination: 7 }
    },
    'Volleyball': {
        name: 'Volleyball',
        weights: { speed: 12, agility: 18, power: 16, endurance: 14, strength: 10, flexibility: 6, jumping: 4, anatomy: 5, accuracy: 4, balance: 4, coordination: 7 }
    },
    'Cycling': {
        name: 'Cycling',
        weights: { speed: 8, agility: 8, power: 16, endurance: 25, strength: 16, flexibility: 4, jumping: 4, anatomy: 5, accuracy: 3, balance: 5, coordination: 6 }
    },
    'Rowing': {
        name: 'Rowing',
        weights: { speed: 8, agility: 6, power: 22, endurance: 28, strength: 20, flexibility: 4, jumping: 0, anatomy: 10, accuracy: 2, balance: 2, coordination: 6 }
    },
    'Hockey': {
        name: 'Hockey',
        weights: { speed: 18, agility: 20, power: 10, endurance: 23, strength: 6, flexibility: 3, jumping: 2, anatomy: 4, accuracy: 5, balance: 4, coordination: 5 }
    },
    'Kabaddi': {
        name: 'Kabaddi',
        weights: { speed: 12, agility: 25, power: 15, endurance: 15, strength: 12, flexibility: 4, jumping: 2, anatomy: 4, accuracy: 2, balance: 5, coordination: 4 }
    },
    'Kho-Kho': {
        name: 'Kho-Kho',
        weights: { speed: 25, agility: 25, power: 10, endurance: 15, strength: 4, flexibility: 3, jumping: 4, anatomy: 2, accuracy: 2, balance: 4, coordination: 6 }
    },
    'Wrestling': {
        name: 'Wrestling',
        weights: { speed: 4, agility: 10, power: 25, endurance: 15, strength: 23, flexibility: 4, jumping: 2, anatomy: 6, accuracy: 2, balance: 5, coordination: 4 }
    },
    'Boxing': {
        name: 'Boxing',
        weights: { speed: 15, agility: 15, power: 18, endurance: 20, strength: 5, flexibility: 2, jumping: 2, anatomy: 4, accuracy: 10, balance: 4, coordination: 5 }
    },
    'Judo': {
        name: 'Judo',
        weights: { speed: 6, agility: 12, power: 20, endurance: 16, strength: 22, flexibility: 4, jumping: 2, anatomy: 6, accuracy: 2, balance: 6, coordination: 4 }
    },
    'Taekwondo': {
        name: 'Taekwondo',
        weights: { speed: 18, agility: 18, power: 15, endurance: 12, strength: 6, flexibility: 12, jumping: 4, anatomy: 5, accuracy: 4, balance: 4, coordination: 2 }
    },
    'Fencing': {
        name: 'Fencing',
        weights: { speed: 20, agility: 23, power: 10, endurance: 10, strength: 4, flexibility: 4, jumping: 2, anatomy: 4, accuracy: 12, balance: 6, coordination: 5 }
    },
    'Wushu': {
        name: 'Wushu',
        weights: { speed: 12, agility: 20, power: 15, endurance: 10, strength: 8, flexibility: 15, jumping: 8, anatomy: 2, accuracy: 2, balance: 4, coordination: 4 }
    },
    'Archery': {
        name: 'Archery',
        weights: { speed: 0, agility: 2, power: 4, endurance: 8, strength: 15, flexibility: 2, jumping: 0, anatomy: 12, accuracy: 28, balance: 22, coordination: 7 }
    },
    'Weightlifting': {
        name: 'Weightlifting',
        weights: { speed: 2, agility: 4, power: 28, endurance: 2, strength: 28, flexibility: 12, jumping: 4, anatomy: 10, accuracy: 0, balance: 6, coordination: 4 }
    },
    'Kayaking': {
        name: 'Kayaking',
        weights: { speed: 10, agility: 4, power: 20, endurance: 30, strength: 16, flexibility: 2, jumping: 0, anatomy: 6, accuracy: 2, balance: 6, coordination: 4 }
    },
    'Soccer': {
        name: 'Soccer',
        weights: { speed: 16, agility: 20, power: 6, endurance: 26, strength: 6, flexibility: 3, jumping: 2, anatomy: 3, accuracy: 5, balance: 4, coordination: 9 }
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
                const hasExtremeWeight = Object.values(w).some(val => Number(val) > 30);
                if (hasExtremeWeight || w.jumping === 45 || w.endurance === 0 || w.endurance === 40 || w.speed === 35) {
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
        weights: { speed: 12, agility: 12, power: 12, endurance: 12, strength: 10, flexibility: 10, jumping: 8, anatomy: 6, accuracy: 6, balance: 6, coordination: 6 }
    };
    saveSportWeights(data);
};

export const deleteSportWeight = (name: string) => {
    const data = getSportWeights();
    delete data[name];
    saveSportWeights(data);
};
