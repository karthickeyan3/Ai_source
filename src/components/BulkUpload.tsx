import { Download, FileText } from 'lucide-react';
import Papa from 'papaparse';
import styles from '../App.module.css';
import { runAssessment } from '../utils/percentileEngine';
import type { AssessmentResult, FormData, Sport, Gender } from '../types';

interface BulkUploadProps {
    onBulkResults: (results: AssessmentResult[]) => void;
}

export const BulkUpload = ({ onBulkResults }: BulkUploadProps) => {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (results) => {
                const rawRows = results.data as any[];
                const assessmentResults: AssessmentResult[] = rawRows.map(row => {
                    // Map CSV headers to FormData keys
                    const formData: FormData = {
                        name: row.Name || 'Athlete',
                        age: row.Age || 12,
                        gender: (row.Gender as Gender) || 'Male',
                        sport: (row.Sport as Sport) || 'Basketball',
                        height: row.Height || 160,
                        weight: row.Weight || 50,
                        shoulderGirth: row.ShoulderGirth || 80,
                        hipCircumference: row.Hip || 70,
                        waistCircumference: row.Waist || 60,
                        skinfold: row.Skinfold || 12,
                        hipToToe: row.HipToToe || 85,
                        verticalJump: row.VerticalJump || 35,
                        sitAndReach: row.Flexibility || 25,
                        plankTest: row.Plank || 90,
                        tTest: row.TTest || 12,
                        reactionTime: row.Reaction || 0.4,
                        responseTime: row.Response || 0.45,
                        sprint40m: row.Sprint || 7.0
                    };
                    return runAssessment(formData);
                });
                onBulkResults(assessmentResults);
            }
        });
    };

    const downloadTemplate = () => {
        const headers = "Name,Age,Gender,Sport,Height,Weight,ShoulderGirth,Hip,Waist,Skinfold,HipToToe,VerticalJump,Flexibility,Plank,TTest,Reaction,Response,Sprint\nAthlete A,12,Male,Basketball,160,50,85,75,65,10,95,45,35,150,11.5,0.3,0.35,6.2";
        const blob = new Blob([headers], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'scout_ai_template.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className={styles.resultsPanel}>
            <div className={styles.card}>
                <h3 className={styles.title}>CSV BULK UPLOAD</h3>

                <div className={styles.summaryContent} style={{ marginBottom: 24 }}>
                    <div className={`${styles.card} ${styles.summaryItem}`} style={{ gridColumn: 'span 2', background: '#f9fafb' }}>
                        <h5 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FileText size={16} /> CSV FORMAT REQUIREMENTS
                        </h5>
                        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 8 }}>
                            Required Headers: <strong>Name, Age, Gender</strong>. <br />
                            Metrics (Optional): Height, Weight, VerticalJump, Flexibility, Plank, TTest, Reaction, Sprint.
                        </p>
                        <button
                            onClick={downloadTemplate}
                            style={{
                                marginTop: 12,
                                background: 'transparent',
                                border: '1px solid #111827',
                                padding: '4px 12px',
                                borderRadius: 4,
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4
                            }}
                        >
                            <Download size={12} /> DOWNLOAD TEMPLATE
                        </button>
                    </div>
                </div>

                <label className={styles.uploadZone}>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    <div className={styles.uploadTitle}>DRAG & DROP CSV FILE</div>
                    <div className={styles.uploadSub}>or click to browse from your computer</div>
                </label>
            </div>
        </div>
    );
};
