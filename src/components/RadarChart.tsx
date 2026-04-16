import { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { MetricResult, Gender } from '../types';
import { getRatingColor } from '../utils/colorUtils';

import styles from '../App.module.css';

// ── Toggle this to show/hide the comparison table globally ──
export const SHOW_COMPARISON_TABLE = true;

interface RadarChartProps {
    metrics: MetricResult[];
    age: number;
    gender: Gender;
    sport?: string;
    athleteName?: string;
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
                        <div style={{ color: '#22c55e', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>ELITE</div>
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

import { runAssessment } from '../utils/percentileEngine';

export const PerformanceRadar = ({ metrics, age, gender, sport = 'Basketball', athleteName = 'Athlete' }: RadarChartProps) => {
    // 1. Recalculate metrics for the newly selected sport
    // This allows the user to click recommended sports and see how they compare vs different benchmarks
    const results = useMemo(() => {
        // Reconstruct the raw data from the existing metrics
        const rawData: any = { name: athleteName, age, gender, sport };
        metrics.forEach(m => {
            // Find the original key for the engine
            const config = [
                { key: 'height', label: 'Height' },
                { key: 'weight', label: 'Weight' },
                { key: 'reactionTime', label: 'Reaction Speed' },
                { key: 'responseTime', label: 'Response Time' },
                { key: 'bmi', label: 'Fitness Shape' },
                { key: 'sprint40m', label: 'Sprint Speed (40m)' },
                { key: 'verticalJump', label: 'Explosive Power' },
                { key: 'tTest', label: 'Agility (T-Test)' },
                { key: 'plankTest', label: 'Core Strength' },
                { key: 'sitAndReach', label: 'Flexibility' }
            ];
            const item = config.find(c => c.label === m.metric);
            if (item) rawData[item.key] = m.value;
        });

        return runAssessment(rawData);
    }, [metrics, age, gender, sport, athleteName]);

    // Select specific metrics for the radar axes
    const selectedMapping = [
        { label: 'Reaction Speed', key: 'reactionTime' },
        { label: 'Response Time', key: 'responseTime' },
        { label: 'Fitness Shape', key: 'bmi' },
        { label: 'Sprint Speed (40m)', key: 'sprint40m' },
        { label: 'Explosive Power', key: 'verticalJump' },
        { label: 'Agility (T-Test)', key: 'tTest' },
        { label: 'Core Strength', key: 'plankTest' },
        { label: 'Flexibility', key: 'sitAndReach' }
    ];

    const radarData = useMemo(() => {
        return selectedMapping.map(item => {
            const m = results.metrics.find(x => x.metric === item.label);
            if (!m) return { subject: item.label, athlete: 0, elite: 100, rawAthlete: '0', rawElite: '0', unit: '' };

            return {
                subject: item.label,
                athlete: m.percentile,
                elite: 100,
                ratingColor: getRatingColor(m.rating),
                rawAthlete: m.unit === 's' ? m.value.toFixed(2) : (m.unit === 'cm' || m.unit === 'kg/m²' ? m.value.toFixed(1) : m.value.toString()),
                rawElite: m.unit === 's' ? m.eliteValue.toFixed(2) : (m.unit === 'cm' || m.unit === 'kg/m²' ? m.eliteValue.toFixed(1) : m.eliteValue.toString()),
                unit: m.unit,
                rating: m.rating,
                ratingColorRaw: getRatingColor(m.rating) // Added for table use
            };
        });
    }, [results]);

    return (
        <div className={styles.card} style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className={styles.title} style={{ marginBottom: '15px' }}>ATHLETIC PROFILE: {sport.toUpperCase()}</h3>

            <div className={`${styles.chartContainer} chart-container-capture`}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#111827', fontSize: 13, fontWeight: 800 }}
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
                paddingBottom: '20px',
                marginTop: '0px'
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
                        {athleteName} SCORE
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
                            padding: '12px 16px',
                            borderBottom: '2px solid #e5e7eb',
                            fontSize: '0.75rem',
                            fontWeight: 900,
                            color: '#111827',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            <span>Test Name</span>
                            <span style={{ textAlign: 'center', color: '#16a34a' }}>Elite Benchmark (U{age})</span>
                            <span style={{ textAlign: 'center' }}>Your Score</span>
                        </div>
                        {radarData.map((d, i) => {
                            return (
                                <div key={i} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1.5fr 1fr 1fr',
                                    padding: '10px 16px',
                                    borderBottom: i < radarData.length - 1 ? '1px solid #f3f4f6' : 'none',
                                    background: i % 2 === 0 ? '#fff' : '#fafbfc',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ fontWeight: 800, color: '#111827', fontSize: '0.85rem' }}>
                                        {d.subject}
                                    </span>
                                    <span style={{ textAlign: 'center', fontWeight: 900, color: '#16a34a', fontSize: '0.85rem' }}>
                                        {d.rawElite} <span style={{ fontSize: '0.65rem', color: '#86efac', fontWeight: 700 }}>{d.unit}</span>
                                    </span>
                                    <span style={{ textAlign: 'center', fontWeight: 900, color: d.ratingColor, fontSize: '0.85rem' }}>
                                        {d.rawAthlete} <span style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 700 }}>{d.unit}</span>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
