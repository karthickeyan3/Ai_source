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

// ── Default (empty) form state ─────────────────────────────────────────────
const EMPTY: Record<string, string | number> = {
    name: '', age: '', gender: 'Male',
    height: '', weight: '', shoulderGirth: '', hipCircumference: '',
    waistCircumference: '', skinfold: '', hipToToe: '',
    verticalJump: '', sitAndReach: '', plankTest: '',
    tTest: '', reactionTime: '', responseTime: '', sprint40m: '',
};

// ── Validate a single numeric field ───────────────────────────────────────
const validateField = (name: string, value: string | number): string => {
    if (value === '' || value === undefined) return ''; // empty = not yet entered (ok)
    const num = typeof value === 'number' ? value : parseFloat(value as string);
    if (isNaN(num)) return 'Must be a number';
    const limit = METRIC_LIMITS[name];
    if (!limit) return '';
    if (num < limit.min) return `Too low — min is ${limit.min} ${getUnit(name)}`;
    if (num > limit.max) return `Too high — max is ${limit.max} ${getUnit(name)}`;
    return '';
};

const UNITS: Record<string, string> = {
    height: 'cm', weight: 'kg', shoulderGirth: 'cm', hipCircumference: 'cm',
    waistCircumference: 'cm', skinfold: 'mm', hipToToe: 'cm',
    verticalJump: 'cm', sitAndReach: 'cm', plankTest: 's',
    tTest: 's', reactionTime: 's', responseTime: 's', sprint40m: 's',
};
const getUnit = (key: string) => UNITS[key] ?? '';

// ── Component ──────────────────────────────────────────────────────────────
export const InputForm = ({ onAnalyze, isFullPage = false }: InputFormProps) => {
    const [activeTab, setActiveTab] = useState<'body' | 'performance'>('body');
    const [formData, setFormData] = useState<Record<string, string | number>>(EMPTY);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitAttempted, setSubmitAttempted] = useState(false);

    // ── Build real payload: use placeholder default if field is empty ──────
    const buildPayload = (): FormData => {
        const payload: Record<string, string | number> = { ...formData };
        allNumericFields.forEach(f => {
            if (payload[f.name] === '') payload[f.name] = parseFloat(f.placeholder);
        });
        return payload as unknown as FormData;
    };

    // ── Run full validation over all fields and return error map ──────────
    const validateAll = (): Record<string, string> => {
        const errs: Record<string, string> = {};

        if (!formData.name?.toString().trim()) errs['name'] = 'Full Name is required';
        if (!formData.age) errs['age'] = 'Age is required';
        else if (Number(formData.age) < 10 || Number(formData.age) > 16) errs['age'] = 'Age must be between 10-16';

        allNumericFields.forEach(f => {
            const err = validateField(f.name, formData[f.name]);
            if (err) errs[f.name] = err;
        });
        return errs;
    };

    // ── Change handler ────────────────────────────────────────────────────
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isText = name === 'name' || name === 'gender';

        const stored = isText ? value : (value === '' ? '' : parseFloat(value));
        setFormData(prev => ({ ...prev, [name]: stored }));

        // Live-validate once the field has been touched
        if (touched[name] || submitAttempted) {
            let errorMsg = '';
            if (name === 'name') errorMsg = !value.trim() ? 'Full Name is required' : '';
            else if (name === 'age') errorMsg = !value ? 'Age is required' : (Number(value) < 10 || Number(value) > 16 ? 'Age must be between 10-16' : '');
            else errorMsg = validateField(name, stored);

            setErrors(prev => ({ ...prev, [name]: errorMsg }));
        }
    };

    // ── Blur handler: mark field as touched ───────────────────────────────
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const isText = name === 'name' || name === 'gender';
        const stored = isText ? value : (value === '' ? '' : parseFloat(value));

        setTouched(prev => ({ ...prev, [name]: true }));

        let errorMsg = '';
        if (name === 'name') errorMsg = !value.trim() ? 'Full Name is required' : '';
        else if (name === 'age') errorMsg = !value ? 'Age is required' : (Number(value) < 10 || Number(value) > 16 ? 'Age must be between 10-16' : '');
        else errorMsg = validateField(name, stored);

        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    // ── Submit ────────────────────────────────────────────────────────────
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitAttempted(true);

        const allErrors = validateAll();
        setErrors(allErrors);

        // Mark all fields as touched so errors show
        const allTouched: Record<string, boolean> = {};
        allNumericFields.forEach(f => { allTouched[f.name] = true; });
        setTouched(allTouched);

        if (Object.values(allErrors).some(err => err !== '')) {
            // Scroll to the first error tab if needed
            const bodyErr = bodyFields.some(f => allErrors[f.name]);
            const perfErr = perfFields.some(f => allErrors[f.name]);
            if (bodyErr) setActiveTab('body');
            else if (perfErr) setActiveTab('performance');
            return; // BLOCK submission
        }

        onAnalyze(buildPayload());
    };

    // ── Count errors per tab for badge ───────────────────────────────────
    const bodyErrCount = bodyFields.filter(f => errors[f.name]).length;
    const perfErrCount = perfFields.filter(f => errors[f.name]).length;
    const hasAnyError = bodyErrCount + perfErrCount > 0;

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <div className={isFullPage ? '' : styles.card}>
            {!isFullPage && <h3 className={styles.title}>ATHLETE ASSESSMENT FORM</h3>}
            <form onSubmit={handleSubmit} noValidate>

                {/* ── Identity section ── */}
                <div className={isFullPage ? styles.identityGrid : ''} style={!isFullPage ? { display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '24px' } : { marginBottom: '24px' }}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}><User size={14} style={{ marginRight: 6 }} /> Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                className={`${styles.input} ${styles.nameInput}`}
                                style={(submitAttempted || touched['name']) && errors['name'] ? {
                                    borderColor: '#ef4444',
                                    outline: 'none',
                                    boxShadow: '0 0 0 2px rgba(239,68,68,0.25)',
                                } : {}}
                                name="name"
                                value={formData.name as string}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="e.g. John Smith"
                                maxLength={50}
                            />
                            {(submitAttempted || touched['name']) && errors['name'] && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5, fontSize: '0.72rem', color: '#ef4444', fontWeight: 700, animation: 'fadeIn 0.15s ease' }}>
                                    <AlertCircle size={12} /> {errors['name']}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Age (10–16)</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                className={`${styles.input} ${styles.ageInput}`}
                                style={(submitAttempted || touched['age']) && errors['age'] ? {
                                    borderColor: '#ef4444',
                                    outline: 'none',
                                    boxShadow: '0 0 0 2px rgba(239,68,68,0.25)',
                                } : {}}
                                type="number"
                                name="age"
                                min="10"
                                max="16"
                                step="1"
                                value={formData.age as string}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onInput={(e) => {
                                    if (e.currentTarget.value.length > 2) {
                                        e.currentTarget.value = e.currentTarget.value.slice(0, 2);
                                    }
                                }}
                                placeholder="10–16"
                            />
                            {(submitAttempted || touched['age']) && errors['age'] && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5, fontSize: '0.72rem', color: '#ef4444', fontWeight: 700, animation: 'fadeIn 0.15s ease' }}>
                                    <AlertCircle size={12} /> {errors['age']}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Gender</label>
                        <select className={styles.select} name="gender" value={formData.gender as string} onChange={handleChange} required>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>

                {/* ── Tabs with error badges ── */}
                <div className={styles.tabs} style={{ marginBottom: '24px', maxWidth: '320px' }}>
                    <button
                        type="button"
                        className={`${styles.tab} ${activeTab === 'body' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('body')}
                        style={{ position: 'relative' }}
                    >
                        BIOMETRICS
                        {bodyErrCount > 0 && (
                            <span style={{
                                position: 'absolute', top: -6, right: -6,
                                background: '#ef4444', color: '#fff',
                                borderRadius: '50%', fontSize: 10, fontWeight: 800,
                                width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 1px 4px rgba(239,68,68,0.5)'
                            }}>{bodyErrCount}</span>
                        )}
                    </button>
                    <button
                        type="button"
                        className={`${styles.tab} ${activeTab === 'performance' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('performance')}
                        style={{ position: 'relative' }}
                    >
                        PERFORMANCE
                        {perfErrCount > 0 && (
                            <span style={{
                                position: 'absolute', top: -6, right: -6,
                                background: '#ef4444', color: '#fff',
                                borderRadius: '50%', fontSize: 10, fontWeight: 800,
                                width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 1px 4px rgba(239,68,68,0.5)'
                            }}>{perfErrCount}</span>
                        )}
                    </button>
                </div>

                {/* ── Metric fields ── */}
                <div className={isFullPage ? styles.formGrid : ''}>
                    {(activeTab === 'body' ? bodyFields : perfFields).map(field => {
                        const limit = METRIC_LIMITS[field.name];
                        const error = errors[field.name];
                        const isTouched = touched[field.name] || submitAttempted;
                        const showError = isTouched && !!error;

                        return (
                            <div key={field.name} className={styles.formGroup}>
                                <label className={styles.label}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {field.icon} {field.label} ({field.unit})
                                    </span>
                                </label>

                                <div style={{ position: 'relative' }}>
                                    <input
                                        className={styles.input}
                                        style={showError ? {
                                            borderColor: '#ef4444',
                                            outline: 'none',
                                            boxShadow: '0 0 0 2px rgba(239,68,68,0.25)',
                                        } : {}}
                                        type="number"
                                        step={limit?.step ?? 0.1}
                                        min={limit?.min}
                                        max={limit?.max}
                                        name={field.name}
                                        value={formData[field.name] as string | number}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder={field.placeholder}
                                    />

                                    {/* Range hint — shown when no error */}
                                    {limit && !showError && (
                                        <div style={{
                                            fontSize: '0.68rem',
                                            color: '#9ca3af',
                                            marginTop: 4,
                                            paddingLeft: 2,
                                        }}>
                                            {limit.min} – {limit.max} {field.unit}
                                        </div>
                                    )}

                                    {/* Error message — replaces range hint */}
                                    {showError && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 5,
                                            marginTop: 5,
                                            fontSize: '0.72rem',
                                            color: '#ef4444',
                                            fontWeight: 700,
                                            animation: 'fadeIn 0.15s ease',
                                        }}>
                                            <AlertCircle size={12} />
                                            {error}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Global error banner if submit was attempted and errors exist ── */}
                {submitAttempted && hasAnyError && (
                    <div style={{
                        marginTop: 20,
                        padding: '12px 16px',
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.35)',
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        fontSize: '0.8rem',
                        color: '#b91c1c',
                        fontWeight: 600,
                    }}>
                        <AlertCircle size={16} style={{ flexShrink: 0 }} />
                        Please fix the highlighted fields before analyzing.
                        Check both <strong>BIOMETRICS</strong> and <strong>PERFORMANCE</strong> tabs.
                    </div>
                )}

                {/* ── Submit button ── */}
                <div style={{ marginTop: '32px', display: 'flex', justifyContent: isFullPage ? 'center' : 'flex-start' }}>
                    <button
                        type="submit"
                        className={styles.analyzeBtn}
                        style={{ width: isFullPage ? '280px' : '100%', margin: 0, opacity: submitAttempted && hasAnyError ? 0.6 : 1 }}
                    >
                        💾 ANALYZE PERFORMANCE
                    </button>
                </div>
            </form>
        </div>
    );
};
