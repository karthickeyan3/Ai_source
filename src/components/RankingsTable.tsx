import type { MetricResult } from '../types';
import styles from '../App.module.css';
import { ProgressBar } from './ProgressBar';

interface RankingsTableProps {
    metrics: MetricResult[];
}

const getRatingColor = (rating: string) => {
    switch (rating) {
        case 'Elite Potential': return '#16a34a';
        case 'Excellent': return '#22c55e';
        case 'Above Average': return '#eab308';
        case 'Average': return '#f97316';
        case 'Below Average': return '#dc2626';
        default: return '#111827';
    }
};

export const RankingsTable = ({ metrics }: RankingsTableProps) => {
    return (
        <div className={styles.card}>
            <h2 className={styles.tableTitle}>PERCENTILE RANKINGS</h2>
            <div className={styles.tableWrapper}>
                <table className={styles.table} style={{ tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '22%', whiteSpace: 'normal', padding: '12px 6px' }}>METRIC</th>
                            <th style={{ width: '18%', whiteSpace: 'normal', padding: '12px 6px' }}>VALUE</th>
                            <th style={{ width: '15%', whiteSpace: 'normal', padding: '12px 6px' }}>RANK (%)</th>
                            <th style={{ width: '22%', whiteSpace: 'normal', padding: '12px 6px' }}>RATING</th>
                            <th style={{ width: '23%', whiteSpace: 'normal', padding: '12px 6px' }}>PROGRESS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.map((m, idx) => {
                            const displayValue = typeof m.value === 'number'
                                ? (m.unit === 's' ? m.value.toFixed(2) : (m.unit === 'cm' || m.unit === 'kg' ? m.value.toFixed(1) : m.value))
                                : m.value;

                            return (
                                <tr key={idx}>
                                    <td className={styles.metricName} style={{ fontWeight: 800, color: '#111827', fontSize: '0.75rem', padding: '12px 6px' }}>{m.metric}</td>
                                    <td className={styles.metricValue} style={{ padding: '12px 6px', fontSize: '0.8rem' }}>{displayValue} {m.unit}</td>
                                    <td
                                         className={styles.percentile}
                                         style={{ color: getRatingColor(m.rating), padding: '12px 6px', fontSize: '0.85rem' }}
                                     >
                                         {m.percentile}%
                                     </td>
                                    <td
                                         style={{
                                             color: getRatingColor(m.rating),
                                             fontSize: '0.65rem',
                                             fontWeight: 900,
                                             textTransform: 'uppercase',
                                             letterSpacing: '0px',
                                             padding: '12px 6px',
                                             lineHeight: 1.2,
                                             wordBreak: 'break-word'
                                         }}
                                     >
                                         {m.rating}
                                     </td>
                                    <td style={{ padding: '12px 6px' }}>
                                        <ProgressBar percentile={m.percentile} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
