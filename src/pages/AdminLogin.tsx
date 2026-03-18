import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import styles from '../App.module.css';

interface AdminLoginProps {
    onLoginSuccess: () => void;
}

export const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
    const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleCredentialsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Dummy check: admin@sras.com / admin123
        if (email === 'admin@srs.com' && password === 'admin123') {
            setError('');
            setStep('otp');
        } else {
            setError('Invalid email or password. Hint: admin@srs.com / admin123');
        }
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // OTP: 743200
        if (otp === '743200') {
            onLoginSuccess();
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };

    return (
        <div style={{
            height: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div className={`${styles.card} ${styles.focusedForm}`} style={{ maxWidth: '400px', width: '100%', border: '1px solid #e5e7eb' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        background: '#AAFF00',
                        width: '60px',
                        height: '60px',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <Lock size={32} color="#000" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', margin: 0 }}>ADMIN ACCESS</h2>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '8px' }}>
                        {step === 'credentials' ? 'Enter your credentials to continue' : 'Enter the 6-digit code sent to your email'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: '#fef2f2',
                        color: '#dc2626',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        marginBottom: '20px',
                        border: '1px solid #fecaca',
                        textAlign: 'center',
                        fontWeight: 600
                    }}>
                        {error}
                    </div>
                )}

                {step === 'credentials' ? (
                    <form onSubmit={handleCredentialsSubmit}>
                        <div className={styles.formGroup} style={{ marginBottom: '20px' }}>
                            <label className={styles.label}>
                                <Mail size={14} style={{ marginRight: 6 }} /> Email Address
                            </label>
                            <input
                                className={styles.input}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@srs.com"
                                required
                            />
                        </div>
                        <div className={styles.formGroup} style={{ marginBottom: '32px' }}>
                            <label className={styles.label}>
                                <Lock size={14} style={{ marginRight: 6 }} /> Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className={styles.input}
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{ paddingRight: '40px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#6b7280',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 0
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className={styles.analyzeBtn}>
                            CONTINUE <ArrowRight size={18} style={{ marginLeft: 8 }} />
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleOtpSubmit}>
                        <div className={styles.formGroup} style={{ marginBottom: '32px' }}>
                            <label className={styles.label}>
                                <ShieldCheck size={14} style={{ marginRight: 6 }} /> OTP Code
                            </label>
                            <input
                                className={styles.input}
                                type="text"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder=""
                                style={{
                                    textAlign: 'center',
                                    letterSpacing: '8px',
                                    fontSize: '1.5rem',
                                    fontWeight: 900
                                }}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.analyzeBtn}>
                            VERIFY & LOGIN
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep('credentials')}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                color: '#6b7280',
                                marginTop: '16px',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                            }}
                        >
                            Back to credentials
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
