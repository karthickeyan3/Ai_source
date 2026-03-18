
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
        weights: { speed: 15, agility: 20, power: 15, endurance: 10, strength: 10, flexibility: 10, jumping: 20 }
    },
    'Cricket': {
        name: 'Cricket',
        weights: { speed: 10, agility: 15, power: 10, endurance: 20, strength: 10, flexibility: 15, jumping: 20 }
    },
    'Tennis': {
        name: 'Tennis',
        weights: { speed: 15, agility: 20, power: 15, endurance: 15, strength: 10, flexibility: 15, jumping: 10 }
    },
    'Swimming - Sprint (50m/100m)': {
        name: 'Swimming - Sprint (50m/100m)',
        weights: { speed: 20, agility: 10, power: 20, endurance: 15, strength: 15, flexibility: 10, jumping: 10 }
    },
    'Swimming - Distance (400m/1500m)': {
        name: 'Swimming - Distance (400m/1500m)',
        weights: { speed: 10, agility: 10, power: 15, endurance: 30, strength: 15, flexibility: 10, jumping: 10 }
    },
    'Track & Field - Sprint (100m/200m)': {
        name: 'Track & Field - Sprint (100m/200m)',
        weights: { speed: 25, agility: 15, power: 20, endurance: 10, strength: 10, flexibility: 5, jumping: 15 }
    },
    'Track & Field - Middle Distance (800m/1500m)': {
        name: 'Track & Field - Middle Distance (800m/1500m)',
        weights: { speed: 15, agility: 10, power: 15, endurance: 30, strength: 10, flexibility: 5, jumping: 15 }
    },
    'Track & Field - Long Distance (5K/10K)': {
        name: 'Track & Field - Long Distance (5K/10K)',
        weights: { speed: 10, agility: 10, power: 10, endurance: 40, strength: 15, flexibility: 5, jumping: 10 }
    },
    'Track & Field - Jumps (High/Long/Triple)': {
        name: 'Track & Field - Jumps (High/Long/Triple)',
        weights: { speed: 20, agility: 15, power: 20, endurance: 10, strength: 10, flexibility: 5, jumping: 20 }
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
        weights: { speed: 15, agility: 15, power: 15, endurance: 10, strength: 10, flexibility: 10, jumping: 25 }
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

        const newKey = 'Track & Field - Long Distance (5K/10K)';

        Object.keys(parsed).forEach(key => {
            if (key.includes('Long Distance') && (key.includes('5000m') || key.includes('10000m'))) {
                parsed[newKey] = {
                    ...parsed[key],
                    name: newKey
                };
                if (key !== newKey) delete parsed[key];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
            }
        });
        return parsed || DEFAULT_WEIGHTS;
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
