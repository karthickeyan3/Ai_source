import React, { useState } from 'react';
import type { FormData } from '../types';
import styles from '../App.module.css';

interface InputFormProps {
    onAnalyze: (data: FormData) => void;
}

export const InputForm = ({ onAnalyze }: InputFormProps) => {
    const [activeTab, setActiveTab] = useState<'body' | 'performance'>('body');
    const [formData, setFormData] = useState<FormData>({
        name: '',
        age: 12,
        gender: 'Male',
        sport: 'Basketball',
        height: 155,
        weight: 45,
        shoulderGirth: 85,
        hipCircumference: 75,
        waistCircumference: 65,
        skinfold: 10,
        hipToToe: 90,
        verticalJump: 40,
        sitAndReach: 30,
        plankTest: 120,
        tTest: 11,
        reactionTime: 0.25,
        responseTime: 0.30,
        sprint40m: 6.5
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'name' || name === 'gender' || name === 'sport' ? value : parseFloat(value)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAnalyze(formData);
    };

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>ATHLETE ASSESSMENT FORM</h3>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Name</label>
                    <input
                        className={styles.input}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Age</label>
                        <input
                            className={styles.input}
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Gender</label>
                        <select
                            className={styles.select}
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Sport</label>
                    <select
                        className={styles.select}
                        name="sport"
                        value={formData.sport}
                        onChange={handleChange}
                    >
                        <option value="Basketball">Basketball</option>
                        <option value="Football">Football</option>
                        <option value="Cricket">Cricket</option>
                        <option value="Athletics">Athletics</option>
                        <option value="Swimming">Swimming</option>
                        <option value="Gymnastics">Gymnastics</option>
                    </select>
                </div>

                <div className={styles.tabs}>
                    <button
                        type="button"
                        className={`${styles.tab} ${activeTab === 'body' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('body')}
                    >
                        BODY
                    </button>
                    <button
                        type="button"
                        className={`${styles.tab} ${activeTab === 'performance' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('performance')}
                    >
                        PERFORMANCE
                    </button>
                </div>

                {activeTab === 'body' ? (
                    <div className="tabContent">
                        {[
                            { name: 'height', label: 'Height (cm)', placeholder: '155' },
                            { name: 'weight', label: 'Weight (kg)', placeholder: '45' },
                            { name: 'shoulderGirth', label: 'Shoulder Girth (cm)', placeholder: '85' },
                            { name: 'hipCircumference', label: 'Hip (cm)', placeholder: '75' },
                            { name: 'waistCircumference', label: 'Waist (cm)', placeholder: '65' },
                            { name: 'skinfold', label: 'Skinfold (mm)', placeholder: '10' },
                            { name: 'hipToToe', label: 'Hip to Toe (cm)', placeholder: '90' },
                        ].map(field => (
                            <div key={field.name} className={styles.formGroup}>
                                <label className={styles.label}>{field.label}</label>
                                <input
                                    className={styles.input}
                                    type="number"
                                    step="0.1"
                                    name={field.name}
                                    value={(formData as any)[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="tabContent">
                        {[
                            { name: 'verticalJump', label: 'Vertical Jump (cm)', placeholder: '40' },
                            { name: 'sitAndReach', label: 'Sit & Reach (cm)', placeholder: '30' },
                            { name: 'plankTest', label: 'Plank Test (s)', placeholder: '120' },
                            { name: 'tTest', label: 'T-Test (s)', placeholder: '11' },
                            { name: 'reactionTime', label: 'Reaction Time (s)', placeholder: '0.25' },
                            { name: 'responseTime', label: 'Response Time (s)', placeholder: '0.30' },
                            { name: 'sprint40m', label: '40m Sprint (s)', placeholder: '6.5' },
                        ].map(field => (
                            <div key={field.name} className={styles.formGroup}>
                                <label className={styles.label}>{field.label}</label>
                                <input
                                    className={styles.input}
                                    type="number"
                                    step="0.01"
                                    name={field.name}
                                    value={(formData as any)[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <button type="submit" className={styles.analyzeBtn}>
                    💾 ANALYZE PERFORMANCE
                </button>
            </form>
        </div>
    );
};
