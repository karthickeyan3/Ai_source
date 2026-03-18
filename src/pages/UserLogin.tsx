import React, { useState } from 'react';
import { User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import styles from '../App.module.css';

interface UserLoginProps {
    onLoginSuccess: () => void;
}

export const UserLogin = ({ onLoginSuccess }: UserLoginProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleCredentialsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'simhss' && password === '5!mh55') {
            setError('');
            onLoginSuccess();
        } else {
            setError('Invalid username or password.');
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
                        <User size={32} color="#000" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', margin: 0 }}>USER LOGIN</h2>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '8px' }}>
                        Enter your credentials to continue
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

                <form onSubmit={handleCredentialsSubmit}>
                    <div className={styles.formGroup} style={{ marginBottom: '20px' }}>
                        <label className={styles.label}>
                            <User size={14} style={{ marginRight: 6 }} /> Username
                        </label>
                        <input
                            className={styles.input}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="username"
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
                        LOGIN <ArrowRight size={18} style={{ marginLeft: 8 }} />
                    </button>
                </form>
            </div>
        </div>
    );
};
