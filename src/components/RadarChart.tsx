import { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { MetricResult, Gender } from '../types';
import { calculateMetricStats } from '../utils/percentileEngine';
import styles from '../App.module.css';

// ── Toggle this to show/hide the comparison table globally ──
export const SHOW_COMPARISON_TABLE = true;

interface RadarChartProps {
    metrics: MetricResult[];
    age: number;
    gender: Gender;
    sport?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const d = payload[0].payload;
        return (
            <div style={{
                background: '#111827',
                padding: '10px 16px',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.8rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                minWidth: '220px'
            }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 900, color: '#AAFF00', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}>{d.subject}</p>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: '15px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#22c55e', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>ELITE{d.eliteLabel ? ` ${d.eliteLabel}` : ''}</div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#AAFF00' }}>{d.rawElite} <span style={{ fontSize: '0.7rem', color: '#166534' }}>{d.unit}</span></div>
                    </div>
                    <div style={{ width: '1px', height: '25px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#9ca3af', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>YOU</div>
                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>{d.rawAthlete} <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>{d.unit}</span></div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export const PerformanceRadar = ({ metrics, age, gender, sport = 'Basketball' }: RadarChartProps) => {
    // Select specific metrics for the radar axes
    const selectedMapping = [
        { label: 'Reaction Time', key: 'reactionTime' },
        { label: 'Response Time', key: 'responseTime' },
        { label: 'BMI', key: 'bmi' },
        { label: '40m Sprint', key: 'sprint40m' },
        { label: 'Vertical Jump', key: 'verticalJump' },
        { label: 'T-Test', key: 'tTest' },
        { label: 'Plank Test', key: 'plankTest' },
        { label: 'Sit & Reach', key: 'sitAndReach' }
    ];

    const radarData = useMemo(() => {
        return selectedMapping.map(item => {
            const m = metrics.find(x => x.metric === item.label);
            if (!m) return { subject: item.label, athlete: 0, elite: 100, rawAthlete: 0, rawElite: 0, unit: '' };

            // Dynamic recalculation based on current sport selection.
            // For all metrics use forDisplay=true (peer-relative).
            // BMI position is calculated separately using a direct ratio (see below).
            const stats = calculateMetricStats(m.value, item.key, sport, gender, age, true);

            // Normalize so Elite is always 100 on the graph.
            //
            // BMI — bidirectional ratio (peaks AT the elite lean value):
            //   • Athlete BELOW elite (underweight): score = athleteBMI / eliteBMI × 100
            //     e.g. 16.4 / 23.1 × 100 = 71%  → does NOT reach edge ✓
            //   • Athlete AT elite lean:            score = 100% → at edge ✓
            //   • Athlete ABOVE elite (too heavy):  score = eliteBMI / athleteBMI × 100
            //     e.g. 23.1 / 30   × 100 = 77%  → does NOT reach edge ✓
            //   This ensures ONLY an athlete with a BMI matching the elite lean benchmark
            //   reaches the outer ring. Being underweight OR overweight both score lower.
            //
            // For all other inverse metrics (sprint, tTest, reactionTime, responseTime):
            //   Elite value = p90 (fastest/best), ratio = eliteValue / athleteValue × 100
            //
            // For normal metrics (higher=better):
            //   ratio = athleteValue / eliteValue × 100
            let athletePos = 0;
            if (item.key === 'bmi') {
                const eliteBMI = stats.eliteValue; // leanest peer benchmark (p10 of norms)
                if (eliteBMI > 0) {
                    athletePos = m.value <= eliteBMI
                        ? (m.value / eliteBMI) * 100        // underweight → score rises toward elite
                        : (eliteBMI / m.value) * 100;       // overweight  → score falls away from elite
                }
            } else if (m.isInverse) {
                // Inverse: eliteValue = p90 (fastest time / smallest waist)
                athletePos = (stats.eliteValue / m.value) * 100;
            } else {
                // Normal: eliteValue = p90 (highest jump / longest reach)
                athletePos = (m.value / stats.eliteValue) * 100;
            }

            return {
                subject: item.label,
                athlete: Math.min(100, Math.max(0, athletePos)),
                elite: 100,
                rawAthlete: m.unit === 's' ? m.value.toFixed(2) : m.value.toFixed(1),
                // For BMI, elite is the leanest value (p10). Show it clearly.
                rawElite: m.unit === 's' ? stats.eliteValue.toFixed(2) : stats.eliteValue.toFixed(1),
                eliteLabel: item.key === 'bmi' ? '(Lean)' : '',
                unit: m.unit
            };
        });
    }, [metrics, sport, gender, age]);

    return (
        <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', minHeight: '550px' }}>
            <h3 className={styles.title} style={{ marginBottom: '15px' }}>ATHLETIC PROFILE: {sport.toUpperCase()}</h3>

            <div className={styles.chartContainer} style={{ height: '500px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="45%" outerRadius="80%" data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 700 }}
                        />
                        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Radar
                            name="Elite Benchmark"
                            dataKey="elite"
                            stroke="#16a34a"
                            strokeWidth={2.5}
                            strokeDasharray="4 4"
                            fill="transparent"
                        />
                        <Radar
                            name="Athlete Value"
                            dataKey="athlete"
                            stroke="#111827"
                            strokeWidth={2.5}
                            fill="#111827"
                            fillOpacity={0.5}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: 'center',
                paddingBottom: '30px',
                marginTop: '-40px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '180px' }}>
                    <div style={{ width: '15px', height: '15px', background: '#16a34a', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#16a34a', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                        {sport} ELITE
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '180px' }}>
                    <div style={{ width: '15px', height: '15px', background: '#111827', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#111827', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                        YOUR SCORE
                    </span>
                </div>
            </div>

            {/* Simple Elite vs You Table */}
            {SHOW_COMPARISON_TABLE && (
                <div style={{ padding: '0 20px 30px' }}>
                    <div style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1.5fr 1fr 1fr',
                            background: '#f9fafb',
                            padding: '10px 16px',
                            borderBottom: '2px solid #e5e7eb',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            <span>Metric</span>
                            <span style={{ textAlign: 'center', color: '#16a34a' }}>Elite</span>
                            <span style={{ textAlign: 'center', color: '#111827' }}>You</span>
                        </div>
                        {radarData.map((d, i) => (
                            <div key={i} style={{
                                display: 'grid',
                                gridTemplateColumns: '1.5fr 1fr 1fr',
                                padding: '10px 16px',
                                borderBottom: i < radarData.length - 1 ? '1px solid #f3f4f6' : 'none',
                                background: i % 2 === 0 ? '#fff' : '#fafbfc',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontWeight: 800, color: '#1f2937', fontSize: '0.75rem' }}>
                                    {d.subject}
                                </span>
                                <span style={{ textAlign: 'center', fontWeight: 900, color: '#16a34a', fontSize: '0.85rem' }}>
                                    {d.rawElite} <span style={{ fontSize: '0.65rem', color: '#86efac', fontWeight: 700 }}>{d.unit}</span>
                                </span>
                                <span style={{ textAlign: 'center', fontWeight: 900, color: '#111827', fontSize: '0.85rem' }}>
                                    {d.rawAthlete} <span style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 700 }}>{d.unit}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
