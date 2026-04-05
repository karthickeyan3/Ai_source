import { getNormativeData } from './dataService';
import { getSportWeights } from './weightService';
import type { AgeGroup, AssessmentResult, FormData, Gender, MetricResult, Rating, BodyCompAnalysis, TalentIdentification, RecommendedSport } from '../types';


export const getAgeGroup = (age: number): AgeGroup => {
    // allow 10-16 mapping
    const a = Math.max(10, Math.min(16, Math.floor(age)));
    return a.toString() as AgeGroup;
};

// Metrics where LOWER value = BETTER performance
// waistCircumference: leaner waist is better
// bmi: lower BMI is generally better for athletes (lean body is elite)
// skinfold: lower body fat is better
const INVERSE_METRICS = [
    'tTest', 'reactionTime', 'responseTime', 'sprint40m',
    'waistCircumference', 'skinfold', 'bmi'
];

const GROWTH_COEFFICIENT = 0.06; // 5-8% annual improvement during puberty

const metricsList = [
    { key: 'verticalJump', label: 'Vertical Jump', unit: 'cm' },
    { key: 'sitAndReach', label: 'Sit & Reach', unit: 'cm' },
    { key: 'plankTest', label: 'Plank Test', unit: 's' },
    { key: 'tTest', label: 'T-Test', unit: 's' },
    { key: 'reactionTime', label: 'Reaction Time', unit: 's' },
    { key: 'responseTime', label: 'Response Time', unit: 's' },
    { key: 'sprint40m', label: '40m Sprint', unit: 's' },
    { key: 'height', label: 'Height', unit: 'cm' },
    { key: 'weight', label: 'Weight', unit: 'kg' },
    { key: 'shoulderGirth', label: 'Shoulder Girth', unit: 'cm' },
    { key: 'hipCircumference', label: 'Hip Circumference', unit: 'cm' },
    { key: 'waistCircumference', label: 'Waist Circumference', unit: 'cm' },
    { key: 'skinfold', label: 'Skinfold', unit: 'mm' },
    { key: 'bmi', label: 'BMI', unit: 'kg/m²' },
    { key: 'hipToToe', label: 'Hip to Toe', unit: 'cm' },
];

const resolveParentSport = (s: string | undefined): string => {
    if (!s) return 'Basketball';
    const sportName = s.trim();
    const allNorms = getNormativeData();

    // 1. Try exact case-insensitive match (this preserves specific sub-events like Long Distance)
    const exactMatch = Object.keys(allNorms).find(key => key.toLowerCase() === sportName.toLowerCase());
    if (exactMatch) return exactMatch;

    // 2. Fallback to keyword matching only if no exact match exists
    const slug = sportName.toLowerCase();
    if (slug.includes('track')) return 'Track & Field';
    if (slug.includes('swim')) return 'Swimming';

    return 'Basketball';
};

export const calculateMetricStats = (
    value: number,
    metricKey: string,
    sport: string,
    gender: Gender,
    age: number
): { percentile: number, zScore: number, eliteValue: number } => {
    /**
     * FORMULA from Trial1.rtf:
     * Step 1: Apply Age Advantage Factor (AAF)
     *   Adjusted = Raw × (1 + (12 − actualAge) × 0.06)
     * Step 2: Compare adjusted value against a STANDARD AGE-12 normative table.
     * This allows fair comparison of a 10-year-old vs a 14-year-old.
     */
    const baselineAge = '12'; // Standard baseline for performance metrics per Trial1.rtf
    let isInverse = INVERSE_METRICS.includes(metricKey);

    const isStructural = ['height', 'weight', 'bmi', 'shoulderGirth', 'hipCircumference',
        'waistCircumference', 'hipToToe', 'skinfold'].includes(metricKey);

    const enduranceSports = ['distance', 'rowing', 'cycling', 'marathon', 'cross country'];
    const isEndurance = enduranceSports.some(term => sport.toLowerCase().includes(term));
    if (isEndurance && (metricKey === 'bmi' || metricKey === 'weight')) {
        isInverse = true;
    }

    const ageDiff = 12 - age;
    let adjustedValue = value;

    if (!isStructural) {
        // FORMULA: Performance metrics adjusted to Age-12 baseline via AAF
        if (isInverse) {
            adjustedValue = value * (1 - (ageDiff * GROWTH_COEFFICIENT));
        } else {
            adjustedValue = value * (1 + (ageDiff * GROWTH_COEFFICIENT));
        }
    }

    const allNorms = getNormativeData();
    const parentSport = resolveParentSport(sport);

    // Structural metrics: compare against child's actual age group (peer-relative)
    // Performance metrics: compare against Age-12 baseline table (after AAF adjustment)
    const lookupAge = isStructural ? getAgeGroup(age).toString() : baselineAge;
    const norms = allNorms[parentSport]?.[gender]?.[lookupAge]?.[metricKey];

    if (!norms) return { percentile: 50, zScore: 0, eliteValue: 0 };

    // Detect if data is stored Descending (p10 > p90) or Ascending (p10 < p90)
    const dataIsDescending = norms.p10 > norms.p90;

    const bps = [
        { p: 0, v: dataIsDescending ? norms.p10 * 1.5 : norms.p10 * 0.5 },
        { p: 10, v: norms.p10 },
        { p: 25, v: norms.p25 },
        { p: 50, v: norms.p50 },
        { p: 75, v: norms.p75 },
        { p: 90, v: norms.p90 },
        { p: 100, v: dataIsDescending ? norms.p90 * 0.5 : norms.p90 * 1.5 },
    ];

    let percentile = 50;
    let found = false;
    for (let i = 0; i < bps.length - 1; i++) {
        const low = bps[i];
        const high = bps[i + 1];

        // Robust order-agnostic interval check
        const vMin = Math.min(low.v, high.v);
        const vMax = Math.max(low.v, high.v);

        if (adjustedValue >= vMin && adjustedValue <= vMax) {
            // Percentile interpolation
            const ratio = (low.v === high.v) ? 0 : (adjustedValue - low.v) / (high.v - low.v);
            percentile = low.p + ratio * (high.p - low.p);
            found = true;
            break;
        }
    }

    if (!found) {
        const first = bps[0];
        const last = bps[bps.length - 1];
        if (dataIsDescending) {
            percentile = adjustedValue >= first.v ? 0 : (adjustedValue <= last.v ? 100 : 50);
        } else {
            percentile = adjustedValue <= first.v ? 0 : (adjustedValue >= last.v ? 100 : 50);
        }
    }

    // CRITICAL: If metric is inverse BUT data is stored ascending (e.g. BMI, Weight in endurance), 
    // the calculated percentile must be inverted to reflect "lower = better".
    // If data is already stored descending (e.g. tTest, Sprint), no inversion is needed as raw percentile is correct.
    if (isInverse && !dataIsDescending) {
        percentile = 100 - percentile;
    }

    // zScore using adjusted value
    const sd = Math.abs((norms.p75 - norms.p25) / 1.35);
    let zScore = sd !== 0 ? (adjustedValue - norms.p50) / sd : 0;
    if (isInverse) zScore = -zScore;

    // eliteValue is the "best" value peers can achieve:
    // Correctly handles both inverted and direct data ordering
    const eliteValue = isInverse
        ? (dataIsDescending ? norms.p90 : norms.p10)
        : (dataIsDescending ? norms.p10 : norms.p90);
    return { percentile, zScore, eliteValue };
};

export const getRating = (percentile: number): Rating => {
    if (percentile >= 90) return 'Elite Potential';
    if (percentile >= 75) return 'Excellent';
    if (percentile >= 50) return 'Above Average';
    if (percentile >= 25) return 'Average';
    return 'Below Average';
};

const calcBodyComp = (data: FormData): BodyCompAnalysis => {
    const heightM = data.height / 100;
    const bmi = data.weight / (heightM * heightM);

    // Growth Status: using percentile-based logic
    const heightStats = calculateMetricStats(data.height, 'height', 'Basketball', data.gender, data.age);
    const legStats = calculateMetricStats(data.hipToToe, 'hipToToe', 'Basketball', data.gender, data.age);

    let growthStatus = 'On Track';

    // Logic from Trial1.rtf: Height < Average but Hip-to-Toe > Average -> Pre-Growth Spurt
    if (heightStats.percentile < 50 && legStats.percentile > 60) {
        growthStatus = 'Pre-Growth Spurt (Long-limbed Trajectory)';
    } else if (heightStats.percentile > 90) {
        growthStatus = 'Early Maturer / Physically Advanced';
    } else if (heightStats.percentile < 15) {
        growthStatus = 'Late Maturer / Developmental';
    }

    // Proportionality: Leg length relative to height
    const legRatio = data.hipToToe / data.height;
    let proportionality = 'Balanced';
    if (legRatio > 0.52) proportionality = 'Long-limbed';
    if (legRatio < 0.48) proportionality = 'Short-limbed';

    const strengthToWeight = data.plankTest / data.weight; // simplistic proxy
    const powerToWeight = data.verticalJump / data.weight; // simplistic proxy

    return {
        bmi: parseFloat(bmi.toFixed(2)),
        proportionality,
        growthStatus,
        strengthToWeight: parseFloat(strengthToWeight.toFixed(2)),
        powerToWeight: parseFloat(powerToWeight.toFixed(2))
    };
};

const getTalentId = (metrics: MetricResult[], bodyComp: BodyCompAnalysis, data: FormData): TalentIdentification => {
    // Cluster prediction
    const m = Object.fromEntries(metrics.map(x => [x.metric, x.percentile]));
    const z = Object.fromEntries(metrics.map(x => [x.metric, x.zScore]));

    let cluster: TalentIdentification['cluster'] = 'Balanced athlete';
    if ((m['40m Sprint'] || 50) > 80 && (m['Reaction Time'] || 50) > 75) {
        cluster = 'Speed-dominant';
    } else if ((m['Vertical Jump'] || 50) > 80) {
        cluster = 'Power-dominant';
    } else if ((m['Plank Test'] || 50) > 80) {
        cluster = 'Endurance-dominant';
    } else if ((m['T-Test'] || 50) > 80) {
        cluster = 'Agility-dominant';
    }

    // Flag "Exceptional Talent" if any relevant core z-score > 2.0
    const hasTopTalent = Object.values(z).some(zVal => zVal > 2.0);
    const potential = hasTopTalent ? 'Exceptional Talent / Elite Trajectory' : (m['Vertical Jump'] > 90 || m['40m Sprint'] > 90 ? 'High Elite Trajectory' : 'Professional Development');

    return {
        peakAge: bodyComp.growthStatus.includes('Early') ? 18 + Math.max(0, (22 - data.age) * 0.1) : 22 + Math.max(0, (26 - data.age) * 0.1),
        potential,
        cluster
    };
};

export const calculateDerivedAttributes = (data: Record<string, number>, gender: Gender, age: number, referenceSport: string): Record<string, number> => {
    // NOTE: calculateMetricStats already inverts INVERSE_METRICS internally,
    // so the returned percentile is always "higher = better". Do NOT subtract from 100.
    //
    // ZERO-SHARING DESIGN: Each raw metric feeds EXACTLY ONE derived attribute.
    // This prevents any single metric from inflating multiple sports' scores.
    //
    // Metric → Attribute mapping (strict 1:1):
    //   sprint40m     → speed      (100%)
    //   tTest         → agility    (60%)
    //   responseTime  → agility    (40%)
    //   verticalJump  → power      (60%)
    //   reactionTime  → power      (40%)
    //   plankTest     → endurance  (100%)
    //   shoulderGirth → strength   (100%)
    //   sitAndReach   → flexibility(100%)
    //   hipToToe      → jumping    (100%)  [leg length = structural jumping predictor]

    const speed = calculateMetricStats(data.sprint40m || 0, 'sprint40m', referenceSport, gender, age).percentile;

    const agility = (
        calculateMetricStats(data.tTest || 0, 'tTest', referenceSport, gender, age).percentile * 0.6 +
        calculateMetricStats(data.responseTime || 0, 'responseTime', referenceSport, gender, age).percentile * 0.4
    );

    const power = (
        calculateMetricStats(data.verticalJump || 0, 'verticalJump', referenceSport, gender, age).percentile * 0.6 +
        calculateMetricStats(data.reactionTime || 0, 'reactionTime', referenceSport, gender, age).percentile * 0.4
    );

    const endurance = calculateMetricStats(data.plankTest || 0, 'plankTest', referenceSport, gender, age).percentile;
    const strength = calculateMetricStats(data.shoulderGirth || 0, 'shoulderGirth', referenceSport, gender, age).percentile;
    const flexibility = calculateMetricStats(data.sitAndReach || 0, 'sitAndReach', referenceSport, gender, age).percentile;
    const jumping = calculateMetricStats(data.hipToToe || 0, 'hipToToe', referenceSport, gender, age).percentile;

    return { speed, agility, power, endurance, strength, flexibility, jumping };
};

const getSportRecommendations = (data: FormData): { recommendations: RecommendedSport[], attributes: Record<string, number> } => {
    // 1. Map Metrics to Attribute Percentiles (0-100) using Basketball as global baseline for reco engine
    const attrs = calculateDerivedAttributes(data as unknown as Record<string, number>, data.gender, data.age, 'Basketball');

    const sportConfigs = getSportWeights();
    const recommendations: RecommendedSport[] = [];
    // 1. Multiply Attribute % by Sport Weight
    // The mathematical loop inside getSportRecommendations()
    Object.entries(sportConfigs).forEach(([name, config]) => {
        let matchScore = 0;
        let totalWeight = 0;

        Object.entries(config.weights).forEach(([attr, weight]) => {
            // 1. Multiply Attribute % by Sport Weight
            matchScore += (attrs[attr] || 0) * weight;
            totalWeight += weight;
        });

        // FORMULA from Trial1.rtf Step 3 & 4:
        // matchScore = Σ(Attribute% × Weight) / totalWeight
        // 2. Sum / TotalWeight (which is 100) -> Gives the % match
        matchScore = totalWeight > 0 ? matchScore / totalWeight : 0;

        recommendations.push({
            sport: name,
            matchScore: Math.round(Math.min(100, matchScore)),
            keyTraits: Object.entries(config.weights)
                .filter(([_, w]) => w > 0)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 2)
                .map(x => x[0].charAt(0).toUpperCase() + x[0].slice(1))
                .join(' + '),
            talentIndicator: matchScore > 90 ? 'Elite Prototype' : matchScore > 80 ? 'Strong Prospect' : matchScore > 65 ? 'Solid Contender' : 'Developing Talent'
        });
    });

    return {
        // 5. Sort by matchScore (descending) and take the Top 3
        recommendations: recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3),
        attributes: attrs
    };
};

export const runAssessment = (data: FormData): AssessmentResult => {
    const age = data.age;
    const bodyComp = calcBodyComp(data);
    const recoData = getSportRecommendations(data);
    const recommendedSports = recoData.recommendations;
    const attributes = recoData.attributes;
    const primarySport = data.sport || recommendedSports[0].sport;

    const hM = data.height / 100;
    const bmiVal = parseFloat((data.weight / (hM * hM)).toFixed(2));
    const dataWithBmi = { ...data, bmi: bmiVal };

    const results: MetricResult[] = metricsList.map(m => {
        const val = (dataWithBmi as unknown as Record<string, unknown>)[m.key] as number;
        // forDisplay=true: structural metrics use peer-relative age norms, no sport inversion
        const stats = calculateMetricStats(val, m.key, primarySport, data.gender, age);
        return {
            metric: m.label,
            value: val,
            eliteValue: stats.eliteValue,
            unit: m.unit,
            percentile: Math.round(stats.percentile),
            zScore: parseFloat(stats.zScore.toFixed(2)),
            rating: getRating(stats.percentile),
            isInverse: INVERSE_METRICS.includes(m.key)
        };
    });

    const perfMetrics = results.filter(m => !['Height', 'Weight', 'Shoulder Girth', 'Hip Circumference', 'Waist Circumference', 'Skinfold', 'Hip to Toe', 'BMI'].includes(m.metric));

    const avgPerf = perfMetrics.reduce((acc, curr) => acc + curr.percentile, 0) / perfMetrics.length;
    const topMetric = Math.max(...perfMetrics.map(m => m.percentile));
    const overallScore = Math.round((avgPerf * 0.8) + (topMetric * 0.2));

    const sortedPerf = [...perfMetrics].sort((a, b) => b.percentile - a.percentile);
    const talentId = getTalentId(perfMetrics, bodyComp, data);
    const sportSuitability = Math.min(100, Math.round(recommendedSports.find(r => r.sport === primarySport)?.matchScore || overallScore));

    return {
        athleteName: data.name,
        sport: primarySport,
        age: data.age,
        gender: data.gender,
        metrics: results,
        attributes,
        overallScore,
        overallRating: getRating(overallScore),
        strengths: sortedPerf.slice(0, 3),
        weaknesses: sortedPerf.slice(-3).reverse(),
        bodyComp,
        sportSuitability,
        talentId,
        recommendedSports,
        trainingRecommendations: [
            `Focus on improving ${sortedPerf[sortedPerf.length - 1].metric} to raise your overall athletic baseline.`,
            `Leverage your natural ${talentId.cluster.split('-')[0].toLowerCase()} traits by maintaining ${sortedPerf[0].metric}.`,
            `Monitor your ${bodyComp.growthStatus.toLowerCase()} stage as you approach your peak developmental window around age ${talentId.peakAge.toFixed(1)}.`
        ]
    };
};
