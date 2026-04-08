import React, { useState } from 'react';
import type { FormData } from '../types';
import styles from '../App.module.css';
import { User, Activity, ShieldCheck, Ruler, Scale, Target, AlertCircle } from 'lucide-react';
import { METRIC_LIMITS } from '../utils/metricLimits';

interface InputFormProps {
    onAnalyze: (data: FormData) => void;
    isFullPage?: boolean;
}

// ── Field definitions ──────────────────────────────────────────────────────
const bodyFields = [
    { name: 'height', label: 'Height', unit: 'cm', placeholder: '175', icon: <Ruler size={16} /> },
    { name: 'weight', label: 'Weight', unit: 'kg', placeholder: '60', icon: <Scale size={16} /> },
    { name: 'shoulderGirth', label: 'Shoulder Girth', unit: 'cm', placeholder: '105', icon: <Activity size={16} /> },
    { name: 'hipCircumference', label: 'Hip Circumference', unit: 'cm', placeholder: '90', icon: <Activity size={16} /> },
    { name: 'waistCircumference', label: 'Waist', unit: 'cm', placeholder: '70', icon: <Activity size={16} /> },
    { name: 'skinfold', label: 'Skinfold', unit: 'mm', placeholder: '8', icon: <Activity size={16} /> },
    { name: 'hipToToe', label: 'Hip to Toe', unit: 'cm', placeholder: '100', icon: <Ruler size={16} /> },
];

const perfFields = [
    { name: 'verticalJump', label: 'Vertical Jump', unit: 'cm', placeholder: '60', icon: <Target size={16} /> },
    { name: 'sitAndReach', label: 'Sit & Reach', unit: 'cm', placeholder: '45', icon: <Activity size={16} /> },
    { name: 'plankTest', label: 'Plank Test', unit: 's', placeholder: '240', icon: <ShieldCheck size={16} /> },
    { name: 'tTest', label: 'T-Test', unit: 's', placeholder: '10.2', icon: <Activity size={16} /> },
    { name: 'reactionTime', label: 'Reaction Time', unit: 's', placeholder: '0.55', icon: <Activity size={16} /> },
    { name: 'responseTime', label: 'Response Time', unit: 's', placeholder: '0.85', icon: <Activity size={16} /> },
    { name: 'sprint40m', label: '40m Sprint', unit: 's', placeholder: '5.8', icon: <Activity size={16} /> },
];

const allNumericFields = [...bodyFields, ...perfFields];

const EMPTY: Record<string, string | number> = {
    name: '', age: '', gender: 'Male',
    height: '', weight: '', shoulderGirth: '', hipCircumference: '',
    waistCircumference: '', skinfold: '', hipToToe: '',
    verticalJump: '', sitAndReach: '', plankTest: '',
    tTest: '', reactionTime: '', responseTime: '', sprint40m: '',
};

const UNITS: Record<string, string> = {
    height: 'cm', weight: 'kg', shoulderGirth: 'cm', hipCircumference: 'cm',
    waistCircumference: 'cm', skinfold: 'mm', hipToToe: 'cm',
    verticalJump: 'cm', sitAndReach: 'cm', plankTest: 's',
    tTest: 's', reactionTime: 's', responseTime: 's', sprint40m: 's',
};

const getUnit = (key: string) => UNITS[key] ?? '';

const validateField = (name: string, value: string | number): string => {
    if (value === '' || value === undefined) return 'Required';
    const num = typeof value === 'number' ? value : parseFloat(value as string);
    if (isNaN(num)) return 'Must be a number';
    const limit = METRIC_LIMITS[name];
    if (!limit) return '';
    if (num < limit.min) return `Min: ${limit.min} ${getUnit(name)}`;
    if (num > limit.max) return `Max: ${limit.max} ${getUnit(name)}`;
    return '';
};

export const InputForm = ({ onAnalyze, isFullPage = false }: InputFormProps) => {
    const [formData, setFormData] = useState<Record<string, string | number>>(EMPTY);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const buildPayload = (): FormData => {
        return formData as unknown as FormData;
    };

    const validateAll = (): Record<string, string> => {
        const errs: Record<string, string> = {};
        if (!formData.name?.toString().trim()) errs['name'] = 'Required';
        if (!formData.age) errs['age'] = 'Required';
        else if (Number(formData.age) < 10 || Number(formData.age) > 16) errs['age'] = '10-16 only';

        allNumericFields.forEach(f => {
            const err = validateField(f.name, formData[f.name]);
            if (err) errs[f.name] = err;
        });
        return errs;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isText = name === 'name' || name === 'gender';
        const stored = isText ? value : (value === '' ? '' : parseFloat(value));
        setFormData(prev => ({ ...prev, [name]: stored }));

        if (touched[name] || submitAttempted) {
            let errorMsg = '';
            if (name === 'name') errorMsg = !value.trim() ? 'Required' : '';
            else if (name === 'age') errorMsg = !value ? 'Required' : (Number(value) < 10 || Number(value) > 16 ? '10-16 only' : '');
            else errorMsg = validateField(name, stored);
            setErrors(prev => ({ ...prev, [name]: errorMsg }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const isText = name === 'name' || name === 'gender';
        const stored = isText ? value : (value === '' ? '' : parseFloat(value));
        setTouched(prev => ({ ...prev, [name]: true }));

        let errorMsg = '';
        if (name === 'name') errorMsg = !value.trim() ? 'Required' : '';
        else if (name === 'age') errorMsg = !value ? 'Required' : (Number(value) < 10 || Number(value) > 16 ? '10-16 only' : '');
        else errorMsg = validateField(name, stored);
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitAttempted(true);
        const allErrors = validateAll();
        setErrors(allErrors);
        const allTouched: Record<string, boolean> = {};
        allNumericFields.forEach(f => { allTouched[f.name] = true; });
        allTouched['name'] = true;
        allTouched['age'] = true;
        setTouched(allTouched);

        if (Object.values(allErrors).some(err => err !== '')) return;
        onAnalyze(buildPayload());
    };

    const renderField = (field: typeof bodyFields[0]) => {
        const limit = METRIC_LIMITS[field.name];
        const error = errors[field.name];
        const isTouched = touched[field.name] || submitAttempted;
        const showError = isTouched && !!error;

        return (
            <div key={field.name} style={{ 
                marginBottom: '1.25rem',
                position: 'relative'
            }}>
                <label className={styles.label} style={{ 
                    fontSize: '0.75rem', 
                    marginBottom: '6px', 
                    opacity: 0.9,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                }}>
                    {field.icon} {field.label}
                </label>
                <div style={{ position: 'relative' }}>
                    <input
                        className={styles.input}
                        style={{
                            padding: '8px 12px',
                            fontSize: '0.9rem',
                            height: '40px',
                            width: '100%',
                            ...(showError ? {
                                borderColor: '#ef4444',
                                outline: 'none',
                                boxShadow: '0 0 0 2px rgba(239,68,68,0.2)',
                            } : {})
                        }}
                        type="number"
                        step={limit?.step ?? 0.1}
                        name={field.name}
                        value={formData[field.name] as string | number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={field.placeholder}
                    />
                    {showError && (
                        <div style={{ position: 'absolute', bottom: -16, left: 0, fontSize: '0.65rem', color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <AlertCircle size={10} /> {error}
                        </div>
                    )}
                    {limit && !showError && (
                        <div style={{ fontSize: '0.65rem', color: '#9ca3af', marginTop: 4, paddingLeft: 2 }}>
                            {limit.min}–{limit.max} {field.unit}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const hasAnyError = Object.values(errors).some(e => e !== '');

    return (
        <div className={isFullPage ? '' : styles.card}>
            {!isFullPage && <h3 className={styles.title}>ATHLETE ASSESSMENT FORM</h3>}
            <form onSubmit={handleSubmit} noValidate>
                {/* ── Identity section ── */}
                <div className={styles.identityGrid} style={{ marginBottom: '32px' }}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} style={{ fontSize: '0.75rem', marginBottom: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <User size={14} /> Full Name
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                className={`${styles.input} ${styles.nameInput}`}
                                style={{ 
                                    padding: '8px 12px', fontSize: '0.9rem', height: '40px',
                                    ...((touched['name'] || submitAttempted) && errors['name'] ? { borderColor: '#ef4444' } : {})
                                }}
                                name="name"
                                value={formData.name as string}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="e.g. John Smith"
                                maxLength={50}
                            />
                            {(touched['name'] || submitAttempted) && errors['name'] && (
                                <div style={{ position: 'absolute', bottom: -18, left: 0, fontSize: '0.65rem', color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <AlertCircle size={10} /> {errors['name']}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label} style={{ fontSize: '0.75rem', marginBottom: '6px', fontWeight: 700 }}>Age (10–16)</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                className={`${styles.input} ${styles.ageInput}`}
                                style={{ 
                                    padding: '8px 12px', fontSize: '0.9rem', height: '40px',
                                    ...((touched['age'] || submitAttempted) && errors['age'] ? { borderColor: '#ef4444' } : {})
                                }}
                                type="number"
                                name="age"
                                min="10"
                                max="16"
                                value={formData.age as string}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onInput={(e) => {
                                    if (e.currentTarget.value.length > 2) {
                                        e.currentTarget.value = e.currentTarget.value.slice(0, 2);
                                    }
                                }}
                                placeholder="12"
                            />
                            {(touched['age'] || submitAttempted) && errors['age'] && (
                                <div style={{ position: 'absolute', bottom: -18, left: 0, fontSize: '0.65rem', color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <AlertCircle size={10} /> {errors['age']}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label} style={{ fontSize: '0.75rem', marginBottom: '6px', fontWeight: 700 }}>Gender</label>
                        <select 
                            className={styles.select} 
                            style={{ padding: '8px 12px', fontSize: '0.9rem', height: '40px' }} 
                            name="gender" 
                            value={formData.gender as string} 
                            onChange={handleChange}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formSectionsGrid}>
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111827', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px', borderLeft: '4px solid #AAFF00', paddingLeft: '12px' }}>Body Metrics</h4>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {bodyFields.map(renderField)}
                        </div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111827', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px', borderLeft: '4px solid #AAFF00', paddingLeft: '12px' }}>Performance</h4>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {perfFields.map(renderField)}
                        </div>
                    </div>
                </div>

                {submitAttempted && hasAnyError && (
                    <div style={{ marginTop: 16, color: '#ef4444', fontSize: '0.7rem', fontWeight: 600, textAlign: 'center' }}>
                        Please correct the errors before proceeding.
                    </div>
                )}

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
                    <button type="submit" className={styles.analyzeBtn} style={{ maxWidth: '280px', width: '100%', margin: 0 }}>
                        💾 ANALYZE PERFORMANCE
                    </button>
                </div>
            </form>
        </div>
    );
};
