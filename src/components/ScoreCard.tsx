import { useState, useEffect } from 'react';
import type { AssessmentResult } from '../types';
import styles from '../App.module.css';
import { Award, Crosshair } from 'lucide-react';

interface ScoreCardProps {
    result: AssessmentResult;
    onSportSelect?: (sportName: string) => void;
}

export const ScoreCard = ({ result, onSportSelect }: ScoreCardProps) => {
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
        <div style={{ width: '100%', marginBottom: '24px' }}>
            <div className={styles.scoreGrid}>
                <div className={styles.scoreCard}>
                    <div className={styles.scoreValue}>{result.overallScore}</div>
                    <div className={styles.scoreLabel}>OVERALL ATHLETE SCORE</div>
                    <div
                        className={styles.ratingBadge}
                        style={{
                            backgroundColor: (result.overallRating === 'Elite Potential' || result.overallRating === 'Excellent') ? '#16a34a' :
                                (result.overallRating === 'Below Average') ? '#dc2626' :
                                    (result.overallRating === 'Above Average') ? '#ca8a04' : '#f3f4f6',
                            color: (result.overallRating === 'Elite Potential' || result.overallRating === 'Excellent' || result.overallRating === 'Below Average' || result.overallRating === 'Above Average') ? '#fff' : '#000'
                        }}
                    >
                        {result.overallRating}
                    </div>
                </div>

                <div className={`${styles.card} ${styles.summaryCard}`} style={{ padding: '24px', minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 900, color: '#111827' }}>{result.athleteName}</h3>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '6px' }}>
                                <p style={{ color: '#6b7280', fontSize: '1rem', margin: 0 }}>
                                    <span style={{ color: '#AAFF00', fontWeight: 700 }}>Age:</span> {result.age} •
                                    <span style={{ color: '#AAFF00', fontWeight: 700 }}> {result.gender}</span>
                                </p>
                            </div>
                        </div>
                        <Award size={32} color="#AAFF00" />
                    </div>

                    <div className={styles.summaryContent}>
                        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '14px', border: '1px solid #f3f4f6' }}>
                            <h5 style={{ color: '#000', fontSize: '0.85rem', marginBottom: '12px', letterSpacing: 1.5, fontWeight: 900, textTransform: 'uppercase' }}>CORE STRENGTHS</h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                                {result.strengths.slice(0, 5).map((s, i) => (
                                    <div key={i} className={styles.metricPill} style={{ margin: 0, padding: '4px 12px', fontSize: '0.85rem', fontWeight: 700 }}>
                                        {s.metric} <span style={{ color: '#16a34a', fontWeight: 900 }}>{s.percentile}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '14px', border: '1px solid #f3f4f6' }}>
                            <h5 style={{ color: '#000', fontSize: '0.85rem', marginBottom: '12px', letterSpacing: 1.5, fontWeight: 900, textTransform: 'uppercase' }}>GROWTH AREAS</h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                                {growthAreasToDisplay.map((s, i) => (
                                    <div key={i} className={styles.metricPill} style={{ margin: 0, padding: '4px 12px', fontSize: '0.85rem', fontWeight: 700 }}>
                                        {s.metric} <span style={{ color: getGrowthColor(s.percentile), fontWeight: 900 }}>{s.percentile}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.card} style={{ padding: '24px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <h5 style={{ color: '#111827', fontSize: '0.9rem', marginBottom: '18px', letterSpacing: 1, fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase' }}>
                        <Crosshair size={16} color="#AAFF00" /> Talent ID Discovery
                    </h5>

                    {/* Compact Tabs */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '18px', background: '#f3f4f6', padding: '4px', borderRadius: '10px' }}>
                        {result.recommendedSports.slice(0, 3).map((s, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setActiveTab(i);
                                    if (onSportSelect) {
                                        onSportSelect(s.sport);
                                    }
                                }}
                                style={{
                                    flex: 1,
                                    padding: '8px 4px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    cursor: 'pointer',
                                    background: activeTab === i ? '#111827' : 'transparent',
                                    color: activeTab === i ? '#AAFF00' : '#6b7280',
                                    transition: 'all 0.2s',
                                    textTransform: 'uppercase',
                                    lineHeight: 1.3,
                                    whiteSpace: 'pre-line',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    wordBreak: 'break-word',
                                    minHeight: '48px'
                                }}
                            >
                                {s.sport.includes(' - ') 
                                    ? s.sport.split(' - ')[1].replace('Jumps ', '').replace(' (', '\n').replace(')', '')
                                    : s.sport.split(' ')[0]}
                            </button>
                        ))}
                    </div>

                    {/* Active Content Detail */}
                    {result.recommendedSports[activeTab] && (
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            <div style={{
                                padding: '18px',
                                background: '#111827',
                                borderLeft: '5px solid #AAFF00',
                                borderRadius: '4px 14px 14px 4px',
                                position: 'relative'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>
                                        {result.recommendedSports[activeTab].sport}
                                    </span>
                                    <div style={{ color: '#AAFF00', fontWeight: 900, fontSize: '1.15rem' }}>
                                        {result.recommendedSports[activeTab].matchScore}%
                                    </div>
                                </div>
                                <div style={{ fontSize: '1rem', color: '#9ca3af', lineHeight: 1.6 }}>
                                    <strong style={{ color: '#AAFF00' }}>Traits:</strong> {result.recommendedSports[activeTab].keyTraits}
                                </div>
                            </div>

                            {result.recommendedSports[activeTab].talentIndicator && (
                                <div style={{
                                    marginTop: 'auto',
                                    background: 'rgba(170, 255, 0, 0.05)',
                                    border: '1px solid rgba(170, 255, 0, 0.1)',
                                    padding: '14px 18px',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    color: '#000',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '10px',
                                    lineHeight: 1.6
                                }}>
                                    <div style={{ marginTop: '3px' }}><Award size={18} color="#AAFF00" /></div>
                                    <div>{result.recommendedSports[activeTab].talentIndicator}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

