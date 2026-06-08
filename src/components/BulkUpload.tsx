import { Download, FileText } from 'lucide-react';
import Papa from 'papaparse';
import styles from '../App.module.css';
import { runAssessment } from '../utils/percentileEngine';
import type { AssessmentResult, FormData, Gender } from '../types';
import { clampFormData } from '../utils/metricLimits';

interface BulkUploadProps {
    onBulkResults: (results: AssessmentResult[]) => void;
}

export const BulkUpload = ({ onBulkResults }: BulkUploadProps) => {
    const processFile = (file: File) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (results) => {
                const rawRows = results.data as Record<string, unknown>[];

                // Helper to clean keys (remove newlines, units, and spaces)
                const cleanKey = (k: string) => k.replace(/[\n\r]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();

                const assessmentResults: AssessmentResult[] = rawRows.map(row => {
                    // Create a normalized version of the row keys
                    const normalizedRow: Record<string, unknown> = {};
                    Object.keys(row).forEach(k => {
                        normalizedRow[cleanKey(k)] = row[k];
                    });

                    // Helper to parse comma-separated numbers or strings, and scale time metrics
                    const parseVal = (val: unknown, fallback: number, isTime = false) => {
                        if (val === undefined || val === null || val === '') return fallback;
                        if (typeof val === 'number') {
                            // If time in ms (e.g. > 50), convert to seconds
                            if (isTime && val > 50) return val / 1000;
                            return val;
                        }
                        // Replace common comma separators and try parsing
                        const cleaned = val.toString().replace(/,/g, '');
                        const num = parseFloat(cleaned);
                        if (isNaN(num)) return fallback;
                        // If time in ms (e.g. 1256.10), convert to seconds
                        if (isTime && num > 50) return num / 1000;
                        return num;
                    };

                    const rawFormData: FormData = {
                        name: (normalizedRow['student name'] || normalizedRow['name'] || 'Athlete').toString().replace(/^["']|["']$/g, ''),
                        age: Math.min(16, Math.max(10, parseVal(normalizedRow['age'], 12))),
                        gender: 'Female' as Gender, // Default
                        height: parseVal(normalizedRow['height (cm)'] || normalizedRow['height'], 160),
                        weight: parseVal(normalizedRow['weight (kg)'] || normalizedRow['weight'], 50),
                        shoulderGirth: parseVal(normalizedRow['shoulder girth (cm)'] || normalizedRow['shoulder girth'], 80),
                        hipCircumference: parseVal(normalizedRow['hip circumference (cm)'] || normalizedRow['hip'], 70),
                        waistCircumference: parseVal(normalizedRow['waist circumference (cm)'] || normalizedRow['waist'], 60),
                        skinfold: parseVal(normalizedRow['skinfold (mm)'] || normalizedRow['skinfold'], 12),
                        hipToToe: parseVal(normalizedRow['hip to toe (cm)'] || normalizedRow['hip to toe'], 85),
                        verticalJump: parseVal(normalizedRow['vertical jump (cm)'] || normalizedRow['vertical jump'], 35),
                        sitAndReach: parseVal(normalizedRow['sit & reach (cm)'] || normalizedRow['sit & reach'] || normalizedRow['flexibility'], 25),
                        plankTest: parseVal(normalizedRow['plank (s)'] || normalizedRow['plank'], 90),
                        tTest: parseVal(normalizedRow['t-test (s)'] || normalizedRow['t-test'] || normalizedRow['agility'], 11.5),
                        reactionTime: parseVal(normalizedRow['reaction time (s)'] || normalizedRow['reaction time'], 0.3),
                        responseTime: parseVal(normalizedRow['response time (s)'] || normalizedRow['response time'], 0.35),
                        sprint40m: parseVal(normalizedRow['40 m sprint (s)'] || normalizedRow['40m sprint'] || normalizedRow['sprint'], 6.2)
                    };

                    // Normalized gender detection (M/F, Male/Female, etc.)
                    const genderRaw = (normalizedRow['gender'] || normalizedRow['sex'])?.toString().toLowerCase().trim() || 'female';
                    if (genderRaw.startsWith('m')) rawFormData.gender = 'Male';
                    else rawFormData.gender = 'Female';

                    const formData = clampFormData(rawFormData as unknown as Record<string, unknown>) as unknown as FormData;
                    return runAssessment(formData);
                });
                onBulkResults(assessmentResults);
            }
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const downloadTemplate = () => {
        const headers = "age,Gender,Student Name,Height (cm),Hip to Toe (cm),Weight (kg),Shoulder Girth (cm),Waist Circumference (cm),Hip Circumference (cm),Skinfold (mm),Vertical Jump (cm),Plank (s),Sit & Reach (cm),T-test (s),Reaction Time (s),Response Time (s),40 m Sprint (s)\n12,Male,Athlete A,160,95,50,85,65,75,10,45,150,35,11.5,0.3,0.35,6.2";
        const blob = new Blob([headers], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'SRS_template.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className={styles.resultsPanel}>
            <div className={styles.card}>
                <h3 className={styles.title}>CSV BULK UPLOAD</h3>

                <div className={styles.summaryContent} style={{ marginBottom: 24 }}>
                    <div className={`${styles.card} ${styles.summaryItem}`} style={{ background: '#f9fafb' }}>
                        <h5 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FileText size={16} /> CSV FORMAT REQUIREMENTS
                        </h5>
                        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 8 }}>
                            Required Headers: <strong>Name, Age, Gender</strong>. <br />
                            Metrics: Height, Weight, VerticalJump, Flexibility, Plank, T-Test, Reaction, Sprint.
                        </p>
                        <button
                            onClick={downloadTemplate}
                            style={{
                                marginTop: 14,
                                background: '#111827',
                                color: '#AAFF00',
                                border: 'none',
                                padding: '10px 18px',
                                borderRadius: 8,
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                transition: 'transform 0.2s, background 0.2s',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            <Download size={14} /> DOWNLOAD SAMPLE CSV
                        </button>
                    </div>
                </div>

                <label
                    className={styles.uploadZone}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        border: '2px dashed #d1d5db',
                        borderRadius: 12,
                        padding: '2.5rem 1rem',
                        background: '#f9fafb',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s, background 0.2s',
                    }}
                    onDragOver={e => {
                        e.preventDefault();
                        (e.currentTarget as HTMLLabelElement).style.borderColor = '#111827';
                        (e.currentTarget as HTMLLabelElement).style.background = '#f3f4f6';
                    }}
                    onDragLeave={e => {
                        (e.currentTarget as HTMLLabelElement).style.borderColor = '#d1d5db';
                        (e.currentTarget as HTMLLabelElement).style.background = '#f9fafb';
                    }}
                    onDrop={e => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file && file.type === 'text/csv') {
                            processFile(file);
                        } else {
                            alert('Please upload a valid CSV file.');
                        }
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLLabelElement).style.borderColor = '#111827';
                        (e.currentTarget as HTMLLabelElement).style.background = '#f3f4f6';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLLabelElement).style.borderColor = '#d1d5db';
                        (e.currentTarget as HTMLLabelElement).style.background = '#f9fafb';
                    }}
                >
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '2.5rem' }}>📂</span>
                    <div className={styles.uploadTitle}>SELECT CSV FILE</div>
                    <div className={styles.uploadSub}> click here</div>
                </label>
            </div>
        </div>
    );
};
