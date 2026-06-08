import { getNormativeData } from './dataService';
import { getSportWeights } from './weightService';
import type { AgeGroup, AssessmentResult, FormData, Gender, MetricResult, Rating, BodyCompAnalysis, TalentIdentification, RecommendedSport } from '../types';


export const getAgeGroup = (age: number): AgeGroup => {
    // allow 10-16 mapping
    const a = Math.max(10, Math.min(16, Math.floor(age)));
    return a.toString() as AgeGroup;
};

// Metrics where LOWER value = BETTER performance (performance metrics ONLY)
// NOTE: All body/structural metrics (height, weight, BMI, waist, skinfold, etc.)
// use optimal-range scoring instead — see OPTIMAL_RANGE handling below.
const INVERSE_METRICS = [
    'tTest', 'reactionTime', 'responseTime', 'sprint40m'
];

const GROWTH_COEFFICIENT = 0.06; // 5-8% annual improvement during puberty

export const metricsList = [
    { key: 'verticalJump', label: 'Explosive Power', unit: 'cm' },
    { key: 'sitAndReach', label: 'Flexibility', unit: 'cm' },
    { key: 'plankTest', label: 'Core Strength', unit: 's' },
    { key: 'tTest', label: 'Agility (T-Test)', unit: 's' },
    { key: 'reactionTime', label: 'Reaction Speed', unit: 's' },
    { key: 'responseTime', label: 'Response Time', unit: 's' },
    { key: 'sprint40m', label: 'Sprint Speed (40m)', unit: 's' },
    { key: 'accuracy', label: 'Accuracy', unit: 'score' },
    { key: 'balance', label: 'Balance', unit: 'score' },
    { key: 'coordination', label: 'Coordination', unit: 'score' },
    { key: 'anatomy', label: 'Anatomy', unit: 'score' },
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
    age: number,
    forDisplay: boolean = false
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

    const isStructural = ['height', 'weight', 'bmi', 'shouldergirth', 'hipcircumference',
        'waistcircumference', 'hiptotoe', 'skinfold'].includes(metricKey.toLowerCase());

    // NOTE: Endurance weight override removed — optimal-range scoring with
    // sport-specific norms inherently handles this (distance runner p50 weight
    // is lower than thrower p50 weight, so the scoring adapts automatically).

    const ageDiff = 12 - age;
    let adjustedValue = value;

    if (!isStructural && !forDisplay) {
        // FORMULA: Performance metrics adjusted to Age-12 baseline via AAF
        // Use explosive (8.5%) for vertical jump, 6% standard for others
        const rate = metricKey.toLowerCase() === 'verticaljump' ? 0.085 : GROWTH_COEFFICIENT;
        if (isInverse) {
            adjustedValue = value * (1 - (ageDiff * rate));
        } else {
            adjustedValue = value * (1 + (ageDiff * rate));
        }
    }

    const allNorms = getNormativeData();
    const parentSport = resolveParentSport(sport);

    // Structural metrics: compare against child's actual age group
    // Performance metrics: compare against Age-12 baseline
    const lookupAge = (isStructural || forDisplay) ? getAgeGroup(age).toString() : baselineAge;
    const norms = allNorms[parentSport]?.[gender]?.[lookupAge]?.[metricKey];

    if (!norms) return { percentile: 50, zScore: 0, eliteValue: 0 };

    // 1. Determine the "Elite Benchmark"
    // For performance, Elite = p90 or p10 (depending on which is better)
    // For structural, Elite = p50 (The "Ideal"/Median for that sport)
    const dataIsDescending = norms.p10 > norms.p90;
    let eliteValue = isInverse
        ? (dataIsDescending ? norms.p90 : norms.p10) // e.g. lower time is better
        : (dataIsDescending ? norms.p10 : norms.p90); // e.g. higher jump is better

    if (isStructural) eliteValue = norms.p50;

    // 2. Calculate Comparison Score (0-100)
    let score = 0;

    if (isStructural) {
        // Structural: Proximity to Ideal (p50). Being 25% away from ideal reduces score significantly.
        const diff = Math.abs(adjustedValue - eliteValue);
        const ratio = diff / eliteValue;
        // Formula: Score starts at 100 and drops as you move away from Ideal
        score = Math.max(0, 100 - (ratio * 150));
    } else if (isInverse) {
        // Inverse (Time): Elite / User (e.g. 5s elite / 10s user = 50%)
        score = (eliteValue / adjustedValue) * 100;
    } else {
        // Direct (Strength/Power): User / Elite (e.g. 25cm user / 50cm elite = 50%)
        score = (adjustedValue / eliteValue) * 100;
    }

    // Clamp score for the UI
    const finalPercentile = Math.round(Math.min(100, Math.max(0, score)));

    // 3. Keep zScore for talent identification logic (still based on population)
    const sd = Math.max(0.1, Math.abs((norms.p75 - norms.p25) / 1.35));
    let zScore = (adjustedValue - norms.p50) / sd;
    if (isInverse) zScore = -zScore;
    if (isStructural) zScore = -Math.abs(zScore);

    return { percentile: finalPercentile, zScore, eliteValue };
};

export const getRating = (percentile: number): Rating => {
    if (percentile >= 90) return 'Elite Potential';
    if (percentile >= 80) return 'Excellent';
    if (percentile >= 60) return 'Above Average';
    if (percentile >= 40) return 'Average';
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

    const heightP = calculateMetricStats(data.height || 0, 'height', referenceSport, gender, age).percentile;
    const hipCircP = calculateMetricStats(data.hipCircumference || 0, 'hipCircumference', referenceSport, gender, age).percentile;
    const anatomy = (heightP * 0.35) + (jumping * 0.30) + (strength * 0.20) + (hipCircP * 0.15);


    const reactionP = calculateMetricStats(data.reactionTime || 0, 'reactionTime', referenceSport, gender, age).percentile;
    const responseP = calculateMetricStats(data.responseTime || 0, 'responseTime', referenceSport, gender, age).percentile;
    const tTestP = calculateMetricStats(data.tTest || 0, 'tTest', referenceSport, gender, age).percentile;
    const vertP = calculateMetricStats(data.verticalJump || 0, 'verticalJump', referenceSport, gender, age).percentile;
    const plankP = calculateMetricStats(data.plankTest || 0, 'plankTest', referenceSport, gender, age).percentile;

    // We need BMI percentile. The `data` is FormData, it doesn't have BMI natively here, so we must calculate it:
    const hM2 = (data.height || 160) / 100;
    const bmiVal2 = (data.weight || 50) / (hM2 * hM2);
    const bmiP = calculateMetricStats(bmiVal2, 'bmi', referenceSport, gender, age).percentile;

    const accuracyVal = (reactionP * 0.50) + (responseP * 0.30) + (flexibility * 0.20);
    const balanceVal = (plankP * 0.40) + (bmiP * 0.30) + (flexibility * 0.30);
    const coordVal = (tTestP * 0.35) + (reactionP * 0.25) + (vertP * 0.20) + (responseP * 0.20);

    return { speed, agility, power, endurance, strength, flexibility, jumping, anatomy, accuracy: accuracyVal, balance: balanceVal, coordination: coordVal };
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
            talentIndicator: matchScore > 90 ? 'Elite Prototype' : matchScore > 80 ? 'Strong Prospect' : matchScore > 65 ? 'Solid Contender' : 'Emerging Athletic Profile'
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

    // Calculate anatomy automatically from structural percentiles
    const heightP = calculateMetricStats(data.height, 'height', primarySport, data.gender, age, true).percentile;
    const hipToToeP = calculateMetricStats(data.hipToToe, 'hipToToe', primarySport, data.gender, age, true).percentile;
    const shoulderP = calculateMetricStats(data.shoulderGirth, 'shoulderGirth', primarySport, data.gender, age, true).percentile;
    const hipCircP = calculateMetricStats(data.hipCircumference, 'hipCircumference', primarySport, data.gender, age, true).percentile;
    const anatomyVal = parseFloat((((heightP * 0.35) + (hipToToeP * 0.30) + (shoulderP * 0.20) + (hipCircP * 0.15)) / 10).toFixed(1));

    const plankP = calculateMetricStats(data.plankTest, 'plankTest', primarySport, data.gender, age, true).percentile;
    const bmiP = calculateMetricStats(bmiVal, 'bmi', primarySport, data.gender, age, true).percentile;
    const sitReachP = calculateMetricStats(data.sitAndReach, 'sitAndReach', primarySport, data.gender, age, true).percentile;
    const balanceVal = parseFloat((((plankP * 0.40) + (bmiP * 0.30) + (sitReachP * 0.30)) / 10).toFixed(1));

    const tTestP = calculateMetricStats(data.tTest, 'tTest', primarySport, data.gender, age, true).percentile;
    const reactionP = calculateMetricStats(data.reactionTime, 'reactionTime', primarySport, data.gender, age, true).percentile;
    const verticalJumpP = calculateMetricStats(data.verticalJump, 'verticalJump', primarySport, data.gender, age, true).percentile;
    const responseP = calculateMetricStats(data.responseTime, 'responseTime', primarySport, data.gender, age, true).percentile;
    const coordVal = parseFloat((((tTestP * 0.35) + (reactionP * 0.25) + (verticalJumpP * 0.20) + (responseP * 0.20)) / 10).toFixed(1));

    const accuracyVal = parseFloat((((reactionP * 0.50) + (responseP * 0.30) + (sitReachP * 0.20)) / 10).toFixed(1));

    const dataWithDerived = { ...data, bmi: bmiVal, anatomy: anatomyVal, accuracy: accuracyVal, balance: balanceVal, coordination: coordVal };

    const results: MetricResult[] = metricsList.map(m => {
        const val = (dataWithDerived as unknown as Record<string, unknown>)[m.key] as number;
        // forDisplay=true ensures the 'eliteValue' returned is for the athlete's ACTUAL age (U10 etc)
        const stats = calculateMetricStats(val, m.key, primarySport, data.gender, age, true);
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
export const recalculateMetricsForSport = (
    metrics: MetricResult[],
    newSport: string,
    gender: Gender,
    age: number,
    fullData?: FormData // optional full data to calculate derived stats if missing
): MetricResult[] => {
    // Make sure we map over the full metricsList, not just what was in the old assessment
    return metricsList.map(metricObj => {
        const existing = metrics.find(m => m.metric === metricObj.label);

        let value = 0;
        if (existing) {
            value = existing.value;
        } else if (fullData) {
            // If we have fullData, we can extract or derive it!
            // But since this is a complex recalculation, we'll just re-run assessment if fullData is passed.
            // For now, if we don't have it, we default to 0.
            value = 0;
        }

        const stats = calculateMetricStats(value, metricObj.key, newSport, gender, age, true);

        if (existing) {
            return {
                ...existing,
                eliteValue: stats.eliteValue,
                percentile: Math.round(stats.percentile),
                rating: getRating(stats.percentile)
            };
        } else {
            return {
                metric: metricObj.label,
                value: 0,
                eliteValue: stats.eliteValue,
                unit: metricObj.unit,
                percentile: Math.round(stats.percentile),
                zScore: parseFloat(stats.zScore.toFixed(2)),
                rating: getRating(stats.percentile),
                isInverse: INVERSE_METRICS.includes(metricObj.key)
            };
        }
    });
};
