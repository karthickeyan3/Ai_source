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
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ minWidth: '100px' }}>METRIC</th>
                            <th>VALUE</th>
                            <th>PERCENTILE</th>
                            <th style={{ minWidth: '95px' }}>RATING</th>
                            <th>PROGRESS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.map((m, idx) => {
                            const displayValue = typeof m.value === 'number'
                                ? (m.unit === 's' ? m.value.toFixed(2) : (m.unit === 'cm' || m.unit === 'kg' ? m.value.toFixed(1) : m.value))
                                : m.value;

                            return (
                                <tr key={idx}>
                                    <td className={styles.metricName} style={{ fontWeight: 800, color: '#111827', fontSize: '0.8rem' }}>{m.metric}</td>
                                    <td className={styles.metricValue}>{displayValue} {m.unit}</td>
                                    <td
                                        className={styles.percentile}
                                        style={{ color: getRatingColor(m.rating) }}
                                    >
                                        {m.percentile}%
                                    </td>
                                    <td
                                        style={{
                                            color: getRatingColor(m.rating),
                                            fontSize: '0.7rem',
                                            fontWeight: 900,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0px',
                                            paddingRight: '4px',
                                            lineHeight: 1.1
                                        }}
                                    >
                                        {m.rating}
                                    </td>
                                    <td>
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
