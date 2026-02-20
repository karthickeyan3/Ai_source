import type { MetricResult } from '../types';
import styles from '../App.module.css';
import { ProgressBar } from './ProgressBar';

interface RankingsTableProps {
    metrics: MetricResult[];
}

const getRatingColor = (rating: string) => {
    switch (rating) {
        case 'EXCELLENT': return '#16a34a';
        case 'GOOD': return '#111827';
        case 'AVERAGE': return '#f97316';
        case 'NEEDS WORK': return '#dc2626';
        default: return '#111827';
    }
};

export const RankingsTable = ({ metrics }: RankingsTableProps) => {
    return (
        <div className={styles.card}>
            <h2 className={styles.tableTitle}>PERCENTILE RANKINGS</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>METRIC</th>
                        <th>VALUE</th>
                        <th>PERCENTILE</th>
                        <th>RATING</th>
                        <th>PROGRESS</th>
                    </tr>
                </thead>
                <tbody>
                    {metrics.map((m, idx) => (
                        <tr key={idx}>
                            <td className={styles.metricName}>{m.metric}</td>
                            <td className={styles.metricValue}>{m.value} {m.unit}</td>
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
                                    fontWeight: 800
                                }}
                            >
                                {m.rating}
                            </td>
                            <td>
                                <ProgressBar percentile={m.percentile} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
