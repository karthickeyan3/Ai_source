import { useState, useMemo } from 'react';
import { getSportWeights, saveSportWeights, addSportWeight, deleteSportWeight } from '../utils/weightService';
import type { SportConfig, SportWeights } from '../utils/weightService';
import styles from '../App.module.css';
import { Save, LogOut, Plus, Trash2, ShieldCheck, AlertCircle, } from 'lucide-react';

interface AdminDashboardProps {
    onLogout: () => void;
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
    const [configs, setConfigs] = useState<Record<string, SportConfig>>(() => getSportWeights());
    const [searchTerm, setSearchTerm] = useState('');
    const [newSport, setNewSport] = useState({ name: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    const handleSave = () => {
        // Validate all totals
        const invalidSports = Object.values(configs).filter(config => {
            const total = Object.values(config.weights).reduce((a, b) => a + b, 0);
            return total !== 100;
        });

        if (invalidSports.length > 0) {
            alert(`Cannot save. The following sports do not have a total weight of 100%: ${invalidSports.map(s => s.name).join(', ')}`);
            return;
        }

        saveSportWeights(configs);
        alert('All sport weights saved successfully!');
    };

    const handleAddSport = () => {
        if (!newSport.name.trim()) return;
        addSportWeight(newSport.name.trim());
        setConfigs(getSportWeights());
        setNewSport({ name: '' });
        setShowAddForm(false);
    };

    const handleDelete = (name: string) => {
        if (confirm(`Delete ${name}? This will remove its weighting profile.`)) {
            deleteSportWeight(name);
            setConfigs(getSportWeights());
        }
    };

    const updateWeight = (sportName: string, attr: keyof SportWeights, value: string) => {
        const num = parseInt(value) || 0;
        setConfigs(prev => ({
            ...prev,
            [sportName]: {
                ...prev[sportName],
                weights: {
                    ...prev[sportName].weights,
                    [attr]: num
                }
            }
        }));
    };

    const filteredSports = useMemo(() => {
        return Object.values(configs)
            .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [configs, searchTerm]);

    return (
        <div className={styles.adminContainer} style={{ background: '#0a0a0a', minHeight: '100vh', borderRadius: 20 }}>
            {/* Header */}
            <div className={styles.adminHeader}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-1.5px', color: '#fff' }}>
                        ADMIN <span style={{ color: '#AAFF00' }}>DASHBOARD</span>
                    </h1>
                    <p style={{ color: '#666', margin: '4px 0 0 0', fontWeight: 500 }}>Global Weight Normalization & Sport Management</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleSave} style={{ background: '#AAFF00', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 10, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 14px rgba(170, 255, 0, 0.3)' }}>
                        <Save size={20} /> SAVE CHANGES
                    </button>
                    <button onClick={onLogout} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <LogOut size={20} /> LOGOUT
                    </button>
                </div>
            </div>

            {/* Info Cards */}
            {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className={styles.card} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ background: 'rgba(170, 255, 0, 0.1)', padding: 8, borderRadius: 8 }}><ShieldCheck size={20} color="#AAFF00" /></div>
                        <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#999' }}>NORMALIZATION RULES</h3>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#bbb', lineHeight: 1.6 }}>Each sport's total weight must equal <strong>100%</strong>. This ensures fair comparison across attributes and age groups using the Relative Age Effect (RAE) growth coefficients.</p>
                </div>
                <div className={styles.card} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: 8, borderRadius: 8 }}><Info size={20} color="#3b82f6" /></div>
                        <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#999' }}>DATA OPTIMIZATION</h3>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#bbb', lineHeight: 1.6 }}>Modifying these weights affects the "Recommended Sports" logic in real-time. Use higher weights for attributes that are critical for elite performance in that discipline.</p>
                </div>
            </div> */}

            {/* Add Sport Section */}
            {!showAddForm ? (
                <button
                    onClick={() => setShowAddForm(true)}
                    style={{ background: '#111', color: '#fff', border: '1px solid #333', padding: '12px 24px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 10 }}
                >
                    <Plus size={18} /> ADD NEW SPORT PROFILE
                </button>
            ) : (
                <div className={styles.addSportCard}>
                    <h3 style={{ margin: '0 0 1.5rem', color: '#AAFF00' }}>CREATE NEW SPORT PROFILE</h3>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label className={styles.label} style={{ color: '#aaa' }}>Sport Name</label>
                            <input
                                className={styles.input}
                                style={{ background: '#222', border: '1px solid #444', color: '#fff' }}
                                value={newSport.name}
                                onChange={e => setNewSport(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g. Rugby"
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleAddSport} style={{ background: '#AAFF00', color: '#000', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>CREATE SPORT</button>
                            <button onClick={() => setShowAddForm(false)} style={{ background: 'transparent', color: '#666', border: '1px solid #333', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>CANCEL</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Weight Table */}
            <div className={styles.weightTableWrapper}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>NORMALIZATION WEIGHTS (%)</h2>
                    <input
                        className={styles.input}
                        style={{ width: '250px', background: 'rgba(255,255,255,0.05)', border: '1px solid #333', color: '#fff' }}
                        placeholder="Search sports..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <table className={styles.weightTable}>
                    <thead>
                        <tr>
                            <th>SPORT / EVENT</th>
                            <th style={{ textAlign: 'center' }}>SPEED</th>
                            <th style={{ textAlign: 'center' }}>AGILITY</th>
                            <th style={{ textAlign: 'center' }}>POWER</th>
                            <th style={{ textAlign: 'center' }}>ENDURANCE</th>
                            <th style={{ textAlign: 'center' }}>STRENGTH</th>
                            <th style={{ textAlign: 'center' }}>FLEXIBILITY</th>
                            <th style={{ textAlign: 'center' }}>JUMPING</th>
                            <th style={{ textAlign: 'center' }}>TOTAL</th>
                            <th style={{ textAlign: 'center' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSports.map(config => {
                            const total = Object.values(config.weights).reduce((a, b) => a + b, 0);
                            const isError = total !== 100;

                            return (
                                <tr key={config.name} className={styles.weightRow}>
                                    <td style={{ fontWeight: 800, color: '#fff' }}>
                                        {config.name}
                                    </td>
                                    <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.speed} onChange={e => updateWeight(config.name, 'speed', e.target.value)} /></td>
                                    <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.agility} onChange={e => updateWeight(config.name, 'agility', e.target.value)} /></td>
                                    <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.power} onChange={e => updateWeight(config.name, 'power', e.target.value)} /></td>
                                    <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.endurance} onChange={e => updateWeight(config.name, 'endurance', e.target.value)} /></td>
                                    <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.strength} onChange={e => updateWeight(config.name, 'strength', e.target.value)} /></td>
                                    <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.flexibility} onChange={e => updateWeight(config.name, 'flexibility', e.target.value)} /></td>
                                    <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.jumping} onChange={e => updateWeight(config.name, 'jumping', e.target.value)} /></td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div className={`${styles.statusIndicator} ${isError ? styles.statusError : styles.statusOk}`}>
                                            {isError ? <AlertCircle size={10} /> : <ShieldCheck size={10} />}
                                            {total}%
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button onClick={() => handleDelete(config.name)} className={styles.adminActionBtn} title="Delete Profile">
                                            <Trash2 size={16} />
                                        </button>
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
