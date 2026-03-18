import { InputForm } from '../components/InputForm';
import styles from '../App.module.css';
import type { FormData } from '../types';

interface AssessmentFormPageProps {
    onAnalyze: (data: FormData) => void;
}

export const AssessmentFormPage = ({ onAnalyze }: AssessmentFormPageProps) => {
    return (
        <div className={styles.assessmentPage}>
            <div className={styles.assessmentHeader}>
                <h1>Comprehensive Assessment Form</h1>
                <p>
                    Please provide the athlete's biometric and performance data below.
                    The form is now organized in a wide grid to make data entry easier and more efficient.
                </p>
            </div>

            <div className={styles.focusedForm}>
                <InputForm onAnalyze={onAnalyze} isFullPage={true} />
            </div>
        </div>
    );
};
