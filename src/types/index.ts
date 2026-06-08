export type Sport =
    | 'Soccer'
    | 'Basketball'
    | 'Cricket'
    | 'Tennis'
    | 'Swimming - Sprint (50m/100m)'
    | 'Swimming - Distance (400m/1500m)'
    | 'Track & Field - Sprint (100m/200m)'
    | 'Track & Field - Middle Distance (800m/1500m)'
    | 'Track & Field - Long Distance (5K/10K)'
    | 'Track & Field - High Jump'
    | 'Track & Field - Long Jump'
    | 'Track & Field - Triple Jump'
    | 'Track & Field - Throws (Shot/Discus/Javelin)'
    | 'Gymnastics'
    | 'Volleyball'
    | 'Cycling'
    | 'Rowing'
    | 'Swimming'
    | 'Track & Field'
    | 'Hockey'
    | 'Kabaddi'
    | 'Kho-Kho'
    | 'Wrestling'
    | 'Boxing'
    | 'Judo'
    | 'Taekwondo'
    | 'Fencing'
    | 'Wushu'
    | 'Archery'
    | 'Weightlifting'
    | 'Kayaking';

export type Gender = 'Male' | 'Female';

export type AgeGroup = '10' | '11' | '12' | '13' | '14' | '15' | '16';

export type Rating = 'Below Average' | 'Average' | 'Above Average' | 'Excellent' | 'Elite Potential';

export interface FormData {
    name: string;
    age: number; // 10-16
    gender: Gender;
    sport?: Sport;
    // Body metrics
    height: number;
    weight: number;
    shoulderGirth: number;
    hipCircumference: number;
    waistCircumference: number;
    skinfold: number;
    hipToToe: number;
    // Performance metrics
    verticalJump: number;
    sitAndReach: number;
    plankTest: number;
    tTest: number;
    reactionTime: number;
    responseTime: number;
    sprint40m: number;
}

export interface MetricResult {
    metric: string;
    value: number;
    eliteValue: number;
    unit: string;
    percentile: number;
    zScore: number;
    rating: Rating;
    isInverse: boolean;
}

export interface BodyCompAnalysis {
    bmi: number;
    proportionality: string;
    growthStatus: string;
    strengthToWeight: number;
    powerToWeight: number;
}

export interface TalentIdentification {
    peakAge: number;
    potential: string;
    cluster: 'Speed-dominant' | 'Power-dominant' | 'Endurance-dominant' | 'Agility-dominant' | 'Balanced athlete';
    sportSwitchRecommendation?: string;
}

export interface RecommendedSport {
    sport: string;
    matchScore: number;
    keyTraits: string;
    talentIndicator?: string;
}

export interface AssessmentResult {
    athleteName: string;
    sport: string;
    age: number;
    gender: Gender;
    metrics: MetricResult[];
    attributes: Record<string, number>; // speed, agility, power, endurance, strength, flexibility, jumping
    overallScore: number;
    overallRating: Rating;
    strengths: MetricResult[];
    weaknesses: MetricResult[];
    bodyComp: BodyCompAnalysis;
    sportSuitability: number;
    talentId: TalentIdentification;
    recommendedSports: RecommendedSport[];
    trainingRecommendations: string[];
}

export interface NormativeBreakpoints {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
}

export interface SportNorms {
    [gender: string]: {
        [ageGroup: string]: {
            [metric: string]: NormativeBreakpoints;
        };
    };
}
