import type { MetricResult } from '../types';
import styles from '../App.module.css';
import { ProgressBar } from './ProgressBar';
import { getRatingColor } from '../utils/colorUtils';

interface RankingsTableProps {
    metrics: MetricResult[];
}

export const RankingsTable = ({ metrics }: RankingsTableProps) => {
    return (
        <div className={styles.card}>
            <h2 className={styles.tableTitle}>PERCENTILE RANKINGS</h2>
            <div className={styles.tableWrapper}>
                <table className={styles.table} style={{ tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '22%', whiteSpace: 'nowrap', padding: '12px 8px', verticalAlign: 'middle', textAlign: 'left' }}>TEST NAME</th>
                            <th style={{ width: '15%', whiteSpace: 'nowrap', padding: '12px 8px', verticalAlign: 'middle', textAlign: 'center' }}>SCORE</th>
                            <th style={{ width: '13%', whiteSpace: 'nowrap', padding: '12px 8px', verticalAlign: 'middle', textAlign: 'center' }}>PERCENTILE</th>
                            <th style={{ width: '30%', whiteSpace: 'nowrap', padding: '12px 8px', verticalAlign: 'middle', textAlign: 'center' }}>PERFORMANCE LEVEL</th>
                            <th style={{ width: '20%', whiteSpace: 'nowrap', padding: '12px 8px', verticalAlign: 'middle', textAlign: 'center' }}>PROGRESS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.map((m, idx) => {
                            const displayValue = typeof m.value === 'number'
                                ? (m.unit === 's' ? m.value.toFixed(2) : (m.unit === 'cm' || m.unit === 'kg' ? m.value.toFixed(1) : m.value))
                                : m.value;

                            return (
                                <tr key={idx}>
                                    <td className={styles.metricName} style={{ fontWeight: 800, color: '#111827', fontSize: '0.75rem', padding: '12px 10px', textAlign: 'left' }}>{m.metric}</td>
                                    <td className={styles.metricValue} style={{ padding: '12px 10px', fontSize: '0.8rem', textAlign: 'center', whiteSpace: 'nowrap' }}>{displayValue} <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>{m.unit}</span></td>
                                    <td
                                        className={styles.percentile}
                                        style={{ color: getRatingColor(m.rating), padding: '12px 10px', fontSize: '0.85rem', textAlign: 'center' }}
                                    >
                                        {m.percentile}%
                                    </td>
                                    <td
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
                                    <td style={{ padding: '12px 10px' }}>
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
    );
};
