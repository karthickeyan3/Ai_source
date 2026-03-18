import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Scatter, ScatterChart, LineChart, Line } from 'recharts';
import type { AssessmentResult } from '../types';
import styles from '../App.module.css';

interface DashboardChartsProps {
    result: AssessmentResult;
}

export const DashboardCharts = ({ result }: DashboardChartsProps) => {
    // 1. Bar Chart -> Performance vs Average
    const barData = result.metrics.map(m => ({
        name: m.metric,
        Athlete: m.percentile,
        Average: 50
    }));

    // 2. Line Chart -> Growth projection (dynamic based on age)
    const currentHeight = result.metrics.find(m => m.metric === 'Height')?.value || 150;
    const isEarly = result.bodyComp.growthStatus.includes('Early');

    // Growth slows down significantly after 16/17
    const remainingGrowth = Math.max(0, (isEarly ? 18 - result.age : 21 - result.age) * (isEarly ? 1.5 : 3.5));
    const peakHeight = currentHeight + remainingGrowth;

    const lineData = [
        { age: Math.max(10, result.age - 2), height: currentHeight - (remainingGrowth * 0.4 + 2) },
        { age: result.age, height: currentHeight },
        { age: result.age + 1, height: currentHeight + (remainingGrowth * 0.3) },
        { age: result.age + 2, height: currentHeight + (remainingGrowth * 0.7) },
        { age: result.age + 3, height: peakHeight }
    ];

    // 3. Scatter Plot -> Body vs Performance (e.g. Strength to Weight vs Vertical Jump)
    const vertJump = result.metrics.find(m => m.metric === 'Vertical Jump')?.value || 40;
    const scatterData = [
        { name: 'Athlete', stw: result.bodyComp.strengthToWeight, jump: vertJump }
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginTop: '24px' }}>
            <div className={styles.card}>
                <h3 className={styles.title}>PERFORMANCE VS POPULATION AVERAGE</h3>
                <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '12px' }}>
                    Comparing percentile rankings against the 50th percentile average for age {result.age}.
                </p>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Athlete" fill="#1a1a1a" />
                            <Bar dataKey="Average" fill="#e5e7eb" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className={styles.card}>
                    <h3 className={styles.title}>GROWTH PROJECTION (UP TO MATURITY)</h3>
                    <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '12px' }}>
                        Estimated {result.bodyComp.growthStatus} trajectory leading to peak age {result.talentId.peakAge}.
                    </p>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -5 }} />
                                <YAxis label={{ value: 'Height (cm)', angle: -90, position: 'insideLeft' }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="height" stroke="#16a34a" strokeWidth={3} dot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.title}>CORRELATION: STRENGTH VS POWER</h3>
                    <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '12px' }}>
                        Core strength to weight ratio vs Vertical Jump power output.
                    </p>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" dataKey="stw" name="Strength-to-Weight" unit="s/kg" />
                                <YAxis type="number" dataKey="jump" name="Vert Jump" unit="cm" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Athlete" data={scatterData} fill="#CCFF00" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
