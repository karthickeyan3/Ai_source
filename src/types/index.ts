export type Sport = 'Basketball' | 'Football' | 'Cricket' | 'Athletics' | 'Swimming' | 'Gymnastics';

export type Gender = 'Male' | 'Female';

export type AgeGroup = 'under13' | '13to15' | '16to18' | '18plus';

export type Rating = 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'NEEDS WORK';

export interface FormData {
    name: string;
    age: number;
    gender: Gender;
    sport: Sport;
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
    unit: string;
    percentile: number;
    rating: Rating;
    isInverse: boolean;
}

export interface AssessmentResult {
    athleteName: string;
    sport: Sport;
    age: number;
    gender: Gender;
    metrics: MetricResult[];
    overallScore: number;
    overallRating: Rating;
    strengths: MetricResult[];
    weaknesses: MetricResult[];
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
