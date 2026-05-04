import { useState, useEffect } from 'react';
import type { AssessmentResult } from '../types';
import styles from '../App.module.css';
import { Award, Crosshair } from 'lucide-react';

interface ScoreCardProps {
    result: AssessmentResult;
    onSportSelect?: (sportName: string) => void;
    actions?: React.ReactNode;
}


export const ScoreCard = ({ result, onSportSelect, actions }: ScoreCardProps) => {

    const [activeTab, setActiveTab] = useState(0);

    // Communicate the initially selected sport back up (only on new result, not on every parent re-render)
    useEffect(() => {
        if (onSportSelect && result.recommendedSports.length > 0) {
            onSportSelect(result.recommendedSports[0].sport);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result.recommendedSports]);

    // Always show exactly 3 growth areas
    const growthAreasToDisplay = result.weaknesses.slice(0, 3);

    const getGrowthColor = (percentile: number) => {
        if (percentile < 25) return '#dc2626'; // Red (Below Average)
        if (percentile < 50) return '#f97316'; // Orange (Average)
        if (percentile < 75) return '#ca8a04'; // Yellow (Above Average)
        return '#16a34a'; // Green (Excellent / Elite)
    };

    return (
        <div style={{ width: '100%', marginBottom: '32px' }}>
            <div className={styles.scoreGrid}>
                <div className={`${styles.card} ${styles.summaryCard}`} style={{ minWidth: 0 }}>
                    <div className={styles.scoreCardHeader}>
                        <div className={styles.athleteInfoGroup}>
                            <div>
                                <h3 className={styles.athleteNameDisplay}>
                                    <span className={styles.overallScoreBadge}>{result.overallScore}%</span>
                                    {result.athleteName}
                                </h3>
                                <ul className={styles.athleteDetailsList}>
                                    <li className={styles.athleteDetailItem}>
                                        <span className={styles.detailLabel}>Age:</span> {result.age}
                                    </li>
                                    <li className={styles.athleteDetailItem}>
                                        <span className={styles.detailLabel}>Gender:</span> {result.gender}
                                    </li>
                                    <li className={styles.athleteDetailItem}>
                                        <span className={styles.detailLabel}>Performance:</span>
                                        <span className={styles.ratingBadgeFinal} style={{
                                            background: (result.overallRating === 'Elite Potential' || result.overallRating === 'Excellent') ? '#16a34a' :
                                                (result.overallRating === 'Below Average') ? '#dc2626' :
                                                    (result.overallRating === 'Above Average') ? '#ca8a04' : '#9ca3af',
                                        }}>
                                            {result.overallRating}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.scoreActions}>
                            {actions}
                        </div>

                    </div>

                    <div className={styles.summaryContent}>
                        <div className={styles.summaryColumn}>
                            <h5 className={styles.summaryColumnTitle}>CORE STRENGTHS</h5>
                            <div className={styles.pillContainer}>
                                {result.strengths.slice(0, 5).map((s, i) => (
                                    <div key={i} className={styles.metricPillLarge}>
                                        {s.metric} <span className={styles.pillValuePositive}>{s.percentile}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.summaryColumn}>
                            <h5 className={styles.summaryColumnTitle}>GROWTH AREAS</h5>
                            <div className={styles.pillContainer}>
                                {growthAreasToDisplay.map((s, i) => (
                                    <div key={i} className={styles.metricPillLarge}>
                                        {s.metric} <span className={styles.pillValueNormal} style={{ color: getGrowthColor(s.percentile) }}>{s.percentile}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.card} style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <h5 className={styles.recoSportsTitle}>
                        <Crosshair size={16} color="#AAFF00" /> TOP THREE RECOMMENDED SPORTS
                    </h5>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {result.recommendedSports.slice(0, 3).map((s, i) => (
                            <div
                                key={i}
                                onClick={() => {
                                    setActiveTab(i);
                                    if (onSportSelect) {
                                        onSportSelect(s.sport);
                                    }
                                }}
                                style={{
                                    cursor: 'pointer',
                                    padding: '14px 18px',
                                    background: activeTab === i ? '#111827' : '#f9fafb',
                                    borderRadius: '12px',
                                    border: activeTab === i ? 'none' : '1px solid #f3f4f6',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    boxShadow: activeTab === i ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
                                    transform: activeTab === i ? 'translateX(4px)' : 'none',
                                    borderLeft: activeTab === i ? '4px solid #AAFF00' : '1px solid #f3f4f6'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <span style={{
                                        fontSize: '1rem',
                                        fontWeight: 900,
                                        color: activeTab === i ? '#fff' : '#111827',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {s.sport.includes(' - ') ? s.sport.split(' - ')[0] : s.sport}
                                    </span>
                                    <span style={{
                                        fontSize: '1.1rem',
                                        fontWeight: 950,
                                        color: activeTab === i ? '#AAFF00' : '#16a34a'
                                    }}>
                                        {s.matchScore}%
                                    </span>
                                </div>

                                {s.sport.includes(' - ') && (
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        color: activeTab === i ? '#AAFF00' : '#111827',
                                        marginBottom: '6px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {s.sport.split(' - ')[1]}
                                    </div>
                                )}

                                <div style={{
                                    fontSize: '0.75rem',
                                    color: activeTab === i ? 'rgba(255,255,255,0.7)' : '#6b7280',
                                    fontWeight: 600,
                                    lineHeight: 1.4,
                                    marginBottom: activeTab === i ? '12px' : '0'
                                }}>
                                    <span style={{ color: activeTab === i ? '#AAFF00' : '#111827', fontWeight: 800 }}>Traits:</span> {s.keyTraits}
                                </div>

                                {activeTab === i && s.talentIndicator && (
                                    <div style={{
                                        marginTop: '8px',
                                        paddingTop: '12px',
                                        borderTop: '1px solid rgba(170, 255, 0, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#AAFF00',
                                        fontSize: '0.8rem',
                                        fontWeight: 800
                                    }}>
                                        <Award size={14} />
                                        {s.talentIndicator}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
        </div>
    );
};

