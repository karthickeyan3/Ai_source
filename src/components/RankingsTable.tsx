import type { MetricResult } from '../types';
import styles from '../App.module.css';
import { ProgressBar } from './ProgressBar';
import { getRatingColor } from '../utils/colorUtils';

interface RankingsTableProps {
    metrics: MetricResult[];
    sport?: string;
    hideTitle?: boolean;
}

export const RankingsTable = ({ metrics, sport, hideTitle = false }: RankingsTableProps) => {
    return (
        <>
            {!hideTitle && (
                <h2 className={styles.tableTitle}>
                    {sport ? `ATHLETIC PROFILE: ${sport.toUpperCase()}` : 'PERCENTILE RANKINGS'}
                </h2>
            )}
            <div className={styles.card}>
                <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ whiteSpace: 'nowrap', padding: '12px 10px', verticalAlign: 'middle', textAlign: 'left' }}>TEST NAME</th>
                            <th style={{ whiteSpace: 'nowrap', padding: '12px 8px', verticalAlign: 'middle', textAlign: 'center' }}>YOUR SCORE</th>
                            <th className={styles.hideMobile} style={{ whiteSpace: 'nowrap', padding: '12px 8px', verticalAlign: 'middle', textAlign: 'center', color: '#16a34a' }}>ELITE BENCHMARK</th>
                            <th style={{ whiteSpace: 'nowrap', padding: '12px 8px', verticalAlign: 'middle', textAlign: 'center' }}>Percentile </th>
                            <th className={styles.hideMobile} style={{ whiteSpace: 'nowrap', padding: '12px 8px', verticalAlign: 'middle', textAlign: 'center' }}>PERFORMANCE LEVEL</th>
                            <th className={styles.hideSmall} style={{ whiteSpace: 'nowrap', padding: '12px 8px', verticalAlign: 'middle', textAlign: 'center' }}>PROGRESS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.map((m, idx) => {
                            const displayValue = typeof m.value === 'number'
                                ? (m.unit === 's' ? m.value.toFixed(2) : (m.unit === 'cm' || m.unit === 'kg' || m.unit === 'kg/m²' ? m.value.toFixed(1) : m.value))
                                : m.value;

                            const displayElite = typeof m.eliteValue === 'number'
                                ? (m.unit === 's' ? m.eliteValue.toFixed(2) : (m.unit === 'cm' || m.unit === 'kg' || m.unit === 'kg/m²' ? m.eliteValue.toFixed(1) : m.eliteValue))
                                : m.eliteValue;

                            return (
                                <tr key={idx}>
                                    <td className={styles.metricName} style={{ fontWeight: 800, color: '#111827', fontSize: '0.75rem', padding: '12px 10px', textAlign: 'left' }}>{m.metric}</td>
                                    <td className={styles.metricValue} style={{ padding: '12px 10px', fontSize: '0.8rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                        {displayValue} <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>{m.unit}</span>
                                    </td>
                                    <td className={styles.hideMobile} style={{ padding: '12px 10px', fontSize: '0.8rem', textAlign: 'center', whiteSpace: 'nowrap', color: '#16a34a', fontWeight: 800 }}>
                                        {displayElite} <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>{m.unit}</span>
                                    </td>
                                    <td
                                        className={styles.percentile}
                                        style={{ color: getRatingColor(m.rating), padding: '12px 10px', fontSize: '0.85rem', textAlign: 'center' }}
                                    >
                                        {m.percentile}%
                                    </td>
                                    <td
                                        className={styles.hideMobile}
                                        style={{
                                            color: getRatingColor(m.rating),
                                            fontSize: '0.65rem',
                                            fontWeight: 900,
                                            textTransform: 'uppercase',
                                            padding: '12px 10px',
                                            lineHeight: 1.2,
                                            wordBreak: 'break-word',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {m.rating}
                                    </td>
                                    <td className={styles.hideSmall} style={{ padding: '12px 10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <ProgressBar percentile={m.percentile} />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            </div>
        </>
    );
};
