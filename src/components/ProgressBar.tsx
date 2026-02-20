import styles from '../App.module.css';

interface ProgressBarProps {
    percentile: number;
}

export const ProgressBar = ({ percentile }: ProgressBarProps) => {
    return (
        <div className={styles.progressTrack}>
            <div
                className={styles.progressBar}
                style={{ width: `${percentile}%` }}
            />
        </div>
    );
};
