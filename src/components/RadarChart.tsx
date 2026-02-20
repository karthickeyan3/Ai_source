import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import type { MetricResult } from '../types';
import styles from '../App.module.css';

interface RadarChartProps {
    metrics: MetricResult[];
}

export const PerformanceRadar = ({ metrics }: RadarChartProps) => {
    // Select key performance metrics for the radar axes as per requirements
    // Requirement: Height, Weight, Vert Jump, Flexibility, Plank, T-Test, Reaction, Sprint
    const keys = [
        'Height', 'Weight', 'Vertical Jump', 'Sit & Reach',
        'Plank Test', 'T-Test', 'Reaction Time', '40m Sprint'
    ];

    const data = keys.map(label => {
        const m = metrics.find(metric => metric.metric === label);
        return {
            subject: label,
            athlete: m ? m.percentile : 0,
            elite: 90
        };
    });

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>PERFORMANCE FINGERPRINT</h3>
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 600 }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

                        <Radar
                            name="Elite Benchmark (90th)"
                            dataKey="elite"
                            stroke="#CCFF00"
                            strokeDasharray="4 4"
                            fill="transparent"
                            fillOpacity={0}
                        />
                        <Radar
                            name="Your Percentile"
                            dataKey="athlete"
                            stroke="#1a1a1a"
                            fill="#1a1a1a"
                            fillOpacity={0.6}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
