import { normativeData } from '../data/normativeData';
import type { AgeGroup, AssessmentResult, FormData, Gender, MetricResult, Rating, Sport } from '../types';

export const getAgeGroup = (age: number): AgeGroup => {
    if (age < 13) return 'under13';
    if (age <= 15) return '13to15';
    if (age <= 18) return '16to18';
    return '18plus';
};

const INVERSE_METRICS = [
    'tTest', 'reactionTime', 'responseTime', 'sprint40m',
    'waistCircumference', 'skinfold'
];

export const calculatePercentile = (
    value: number,
    metricKey: string,
    sport: Sport,
    gender: Gender,
    age: number
): number => {
    const ageGroup = getAgeGroup(age);
    const norms = normativeData[sport]?.[gender]?.[ageGroup]?.[metricKey];

    if (!norms) return 50; // Fallback to median if no data

    const isInverse = INVERSE_METRICS.includes(metricKey);
    const bps = [
        { p: 0, v: isInverse ? norms.p10 * 1.5 : norms.p10 * 0.5 },
        { p: 10, v: norms.p10 },
        { p: 25, v: norms.p25 },
        { p: 50, v: norms.p50 },
        { p: 75, v: norms.p75 },
        { p: 90, v: norms.p90 },
        { p: 100, v: isInverse ? norms.p90 * 0.5 : norms.p90 * 1.5 },
    ];

    // Find range
    for (let i = 0; i < bps.length - 1; i++) {
        const low = bps[i];
        const high = bps[i + 1];

        if (isInverse) {
            if (value <= low.v && value >= high.v) {
                const ratio = (value - low.v) / (high.v - low.v);
                return low.p + ratio * (high.p - low.p);
            }
        } else {
            if (value >= low.v && value <= high.v) {
                const ratio = (value - low.v) / (high.v - low.v);
                return low.p + ratio * (high.p - low.p);
            }
        }
    }

    if (isInverse) {
        return value < bps[bps.length - 1].v ? 100 : 0;
    } else {
        return value > bps[bps.length - 1].v ? 100 : 0;
    }
};

export const getRating = (percentile: number): Rating => {
    if (percentile >= 75) return 'EXCELLENT';
    if (percentile >= 50) return 'GOOD';
    if (percentile >= 25) return 'AVERAGE';
    return 'NEEDS WORK';
};

export const runAssessment = (data: FormData): AssessmentResult => {
    const metricsList = [
        { key: 'height', label: 'Height', unit: 'cm' },
        { key: 'weight', label: 'Weight', unit: 'kg' },
        { key: 'shoulderGirth', label: 'Shoulder Girth', unit: 'cm' },
        { key: 'hipCircumference', label: 'Hip Circumference', unit: 'cm' },
        { key: 'waistCircumference', label: 'Waist Circumference', unit: 'cm' },
        { key: 'skinfold', label: 'Skinfold', unit: 'mm' },
        { key: 'hipToToe', label: 'Hip to Toe', unit: 'cm' },
        { key: 'verticalJump', label: 'Vertical Jump', unit: 'cm' },
        { key: 'sitAndReach', label: 'Sit & Reach', unit: 'cm' },
        { key: 'plankTest', label: 'Plank Test', unit: 's' },
        { key: 'tTest', label: 'T-Test', unit: 's' },
        { key: 'reactionTime', label: 'Reaction Time', unit: 's' },
        { key: 'responseTime', label: 'Response Time', unit: 's' },
        { key: 'sprint40m', label: '40m Sprint', unit: 's' },
    ];

    const results: MetricResult[] = metricsList.map(m => {
        const val = (data as any)[m.key];
        const p = calculatePercentile(val, m.key, data.sport, data.gender, data.age);
        return {
            metric: m.label,
            value: val,
            unit: m.unit,
            percentile: Math.round(p),
            rating: getRating(p),
            isInverse: INVERSE_METRICS.includes(m.key)
        };
    });

    const overallScore = Math.round(results.reduce((acc, curr) => acc + curr.percentile, 0) / results.length);
    const sortedResults = [...results].sort((a, b) => b.percentile - a.percentile);

    return {
        athleteName: data.name,
        sport: data.sport,
        age: data.age,
        gender: data.gender,
        metrics: results,
        overallScore,
        overallRating: getRating(overallScore),
        strengths: sortedResults.slice(0, 3),
        weaknesses: sortedResults.slice(-3).reverse()
    };
};
