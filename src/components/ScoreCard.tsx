import type { AssessmentResult } from '../types';
import styles from '../App.module.css';
import { Award, Zap, AlertTriangle } from 'lucide-react';

interface ScoreCardProps {
    result: AssessmentResult;
}

export const ScoreCard = ({ result }: ScoreCardProps) => {
    return (
        <div className={styles.scoreGrid}>
            <div className={styles.scoreCard}>
                <div className={styles.scoreValue}>{result.overallScore}</div>
                <div className={styles.scoreLabel}>OVERALL ATHLETE SCORE</div>
                <div
                    className={styles.ratingBadge}
                    style={{
                        backgroundColor: result.overallRating === 'EXCELLENT' ? '#16a34a' :
                            result.overallRating === 'NEEDS WORK' ? '#dc2626' : '#AAFF00',
                        color: result.overallRating === 'GOOD' ? '#000' : '#fff'
                    }}
                >
                    {result.overallRating}
                </div>
            </div>

            <div className={`${styles.card} ${styles.summaryCard}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{result.athleteName}</h3>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{result.sport} • Age {result.age} • {result.gender}</p>
                    </div>
                    <Award color="#AAFF00" size={32} />
                </div>

                <div className={styles.summaryContent}>
                    <div className={styles.summaryItem}>
                        <h5><Zap size={14} style={{ marginRight: 4 }} /> CORE STRENGTHS</h5>
                        <div>
                            {result.strengths.map((s, i) => (
                                <div key={i} className={styles.metricPill}>
                                    {s.metric} <span style={{ color: '#16a34a' }}>{s.percentile}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.summaryItem}>
                        <h5><AlertTriangle size={14} style={{ marginRight: 4 }} /> GROWTH AREAS</h5>
                        <div>
                            {result.weaknesses.map((s, i) => (
                                <div key={i} className={styles.metricPill}>
                                    {s.metric} <span style={{ color: '#dc2626' }}>{s.percentile}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
