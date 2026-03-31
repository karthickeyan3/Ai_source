import { useState, useMemo } from 'react';
import { getSportWeights, saveSportWeights, addSportWeight, deleteSportWeight } from '../utils/weightService';
import type { SportConfig, SportWeights } from '../utils/weightService';
import {
    getSportProfiles, saveSportProfiles, resetSportProfile,
    DEFAULT_SPORT_PROFILES, MULTIPLIER_FIELDS,
} from '../utils/sportProfileService';
import type { SportProfileOverride } from '../utils/sportProfileService';
import { rebuildNormativeData } from '../data/normativeData';
import styles from '../App.module.css';
import { Save, LogOut, Plus, Trash2, ShieldCheck, AlertCircle, RotateCcw, Info, ChevronUp, ChevronDown } from 'lucide-react';

interface AdminDashboardProps {
    onLogout: () => void;
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
    const [activeTab, setActiveTab] = useState<'weights' | 'profiles'>('weights');

    // ── Weight tab state ──────────────────────────────────────────────────────
    const [configs, setConfigs] = useState<Record<string, SportConfig>>(() => getSportWeights());
    const [searchTerm, setSearchTerm] = useState('');
    const [newSport, setNewSport] = useState({ name: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    // ── Sport Profiles tab state ──────────────────────────────────────────────
    const [profiles, setProfiles] = useState<Record<string, SportProfileOverride>>(() => getSportProfiles());
    const [profileSearch, setProfileSearch] = useState('');
    const [expandedSport, setExpandedSport] = useState<string | null>(null);
    const [profilesSaved, setProfilesSaved] = useState(false);

    const handleSave = () => {
        // Validate all totals (handle empty strings as 0 for calculation)
        const invalidSports = Object.values(configs).filter(config => {
            const total = Object.values(config.weights).reduce((a, b) => Number(a) + (Number(b) || 0), 0);
            return total !== 100;
        });

        if (invalidSports.length > 0) {
            alert(`Cannot save. The following sports do not have a total weight of 100%: ${invalidSports.map(s => s.name).join(', ')}`);
            return;
        }

        // Clean up empty values to 0 before saving
        const cleaned: Record<string, SportConfig> = {};
        Object.entries(configs).forEach(([sportName, config]) => {
            const weights = { ...config.weights };
            (Object.keys(weights) as (keyof SportWeights)[]).forEach(k => {
                if ((weights[k] as any) === '') weights[k] = 0;
            });
            cleaned[sportName] = { ...config, weights };
        });

        saveSportWeights(cleaned);
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

    // ── Sport Profile handlers ────────────────────────────────────────────────
    const updateProfile = (sport: string, field: keyof SportProfileOverride, value: string) => {
        const num = parseFloat(value);
        setProfiles(prev => ({
            ...prev,
            [sport]: { ...prev[sport], [field]: isNaN(num) ? 0 : num }
        }));
        setProfilesSaved(false);
    };

    const handleSaveProfiles = () => {
        saveSportProfiles(profiles);
        rebuildNormativeData();
        setProfilesSaved(true);
        setTimeout(() => setProfilesSaved(false), 3000);
    };

    const handleResetProfile = (sport: string) => {
        if (!confirm(`Reset "${sport}" to default values?`)) return;
        resetSportProfile(sport);
        setProfiles(getSportProfiles());
        rebuildNormativeData();
    };

    const filteredProfiles = useMemo(() =>
        Object.keys(profiles)
            .filter(s => s.toLowerCase().includes(profileSearch.toLowerCase()))
            .sort(),
        [profiles, profileSearch]
    );

    const isModified = (sport: string): boolean => {
        const def = DEFAULT_SPORT_PROFILES[sport];
        if (!def) return true;
        const cur = profiles[sport];
        return JSON.stringify(cur) !== JSON.stringify(def);
    };

    const updateWeight = (sportName: string, attr: keyof SportWeights, value: string) => {
        // Allow empty string in state so user can delete the value
        const val = value === '' ? '' : (parseInt(value) || 0);
        setConfigs(prev => ({
            ...prev,
            [sportName]: {
                ...prev[sportName],
                weights: {
                    ...prev[sportName].weights,
                    [attr]: val as any
                }
            }
        }));
    };

    const filteredSports = useMemo(() => {
        return Object.values(configs)
            .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [configs, searchTerm]);

    // multiplier colour helper
    const multColor = (val: number, inverse: boolean) => {
        const isGood = inverse ? val < 1.0 : val > 1.0;
        const isBad  = inverse ? val > 1.0 : val < 1.0;
        if (isGood) return '#AAFF00';
        if (isBad)  return '#f97316';
        return '#888';
    };

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
                    {activeTab === 'weights'
                        ? <button onClick={handleSave} style={{ background: '#AAFF00', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 10, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 14px rgba(170,255,0,0.3)' }}>
                            <Save size={20} /> SAVE WEIGHTS
                          </button>
                        : <button onClick={handleSaveProfiles} style={{ background: profilesSaved ? '#22c55e' : '#AAFF00', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 10, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 14px rgba(170,255,0,0.3)', transition: 'background 0.3s' }}>
                            <Save size={20} /> {profilesSaved ? 'APPLIED ✓' : 'SAVE & APPLY'}
                          </button>
                    }
                    <button onClick={onLogout} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '12px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <LogOut size={20} /> LOGOUT
                    </button>
                </div>
            </div>

            {/* Tab Switcher */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
                {(['weights', 'profiles'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        background: activeTab === tab ? '#AAFF00' : 'transparent',
                        color: activeTab === tab ? '#000' : '#888',
                        border: activeTab === tab ? 'none' : '1px solid #333',
                        padding: '8px 20px', borderRadius: 8, fontWeight: 800, cursor: 'pointer',
                        textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px',
                        transition: 'all 0.2s',
                    }}>
                        {tab === 'weights' ? '⚖️  Attribute Weights' : '📐  Sport Profiles'}
                    </button>
                ))}
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

            {/* ── Weights Tab ───────────────────────────────────────────── */}
            {activeTab === 'weights' && (
            <>
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
                            const total = Object.values(config.weights).reduce((a, b) => Number(a) + (Number(b) || 0), 0);
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
            </>
            )}

            {/* ── Sport Profiles Tab ─────────────────────────────────────── */}
            {activeTab === 'profiles' && (
            <div>
                {/* Explainer */}
                <div style={{ background: 'rgba(170,255,0,0.05)', border: '1px solid rgba(170,255,0,0.15)', borderRadius: 12, padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <Info size={18} color='#AAFF00' style={{ flexShrink: 0, marginTop: 2 }} />
                    <div style={{ fontSize: '0.85rem', color: '#bbb', lineHeight: 1.7 }}>
                        <strong style={{ color: '#AAFF00' }}>Height & Weight</strong> — Set the <em>Age-14 Male baseline</em> (cm / kg).
                        The engine auto-scales other ages (±2.5%/yr from 14) and Female (×0.91).<br />
                        <strong style={{ color: '#AAFF00' }}>Multipliers</strong> — Applied to Basketball baseline percentiles.
                        <span style={{ color: '#AAFF00' }}>&gt;1</span> raises the bar for that metric; <span style={{ color: '#f97316' }}>&lt;1</span> lowers it.
                        For <em>inverse</em> metrics (sprint, t-test, reaction) a lower multiplier means <em>faster/better</em> is required.
                    </div>
                </div>

                {/* Search */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>SPORT NORMATIVE PROFILES</h2>
                    <input className={styles.input}
                        style={{ width: '260px', background: 'rgba(255,255,255,0.05)', border: '1px solid #333', color: '#fff' }}
                        placeholder='Search sports...'
                        value={profileSearch}
                        onChange={e => setProfileSearch(e.target.value)}
                    />
                </div>

                {/* Accordion cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filteredProfiles.map(sport => {
                        const p = profiles[sport];
                        const modified = isModified(sport);
                        const open = expandedSport === sport;
                        if (!p) return null;
                        return (
                            <div key={sport} style={{ background: '#111', border: `1px solid ${modified ? 'rgba(170,255,0,0.25)' : '#222'}`, borderRadius: 14, overflow: 'hidden', transition: 'border 0.2s' }}>
                                {/* Header row */}
                                <div onClick={() => setExpandedSport(open ? null : sport)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 1.2rem', cursor: 'pointer', userSelect: 'none' }}>
                                    <span style={{ flex: 1, fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{sport}</span>
                                    {modified && <span style={{ fontSize: '0.7rem', background: 'rgba(170,255,0,0.15)', color: '#AAFF00', border: '1px solid rgba(170,255,0,0.3)', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>MODIFIED</span>}
                                    <button onClick={e => { e.stopPropagation(); handleResetProfile(sport); }}
                                        title='Reset to default'
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #333', color: '#666', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}>
                                        <RotateCcw size={12} /> Reset
                                    </button>
                                    {open ? <ChevronUp size={18} color='#555' /> : <ChevronDown size={18} color='#555' />}
                                </div>

                                {/* Expanded editor */}
                                {open && (
                                    <div style={{ padding: '0 1.2rem 1.2rem', borderTop: '1px solid #1e1e1e' }}>
                                        {/* Height + Weight section */}
                                        <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                                            <p style={{ margin: '0 0 0.6rem', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Height & Weight — Age 14, Male Baseline</p>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                                                {([
                                                    { field: 'heightP50' as const, label: 'Height Median (cm)', hint: 'p50' },
                                                    { field: 'heightP90' as const, label: 'Height Elite (cm)',   hint: 'p90' },
                                                    { field: 'weightP50' as const, label: 'Weight Median (kg)', hint: 'p50' },
                                                    { field: 'weightP90' as const, label: 'Weight Elite (kg)',  hint: 'p90' },
                                                ]).map(({ field, label, hint }) => (
                                                    <div key={field}>
                                                        <label style={{ fontSize: '0.72rem', color: '#555', display: 'block', marginBottom: 4, fontWeight: 700 }}>
                                                            {label} <span style={{ color: '#333' }}>({hint})</span>
                                                        </label>
                                                        <input type='number' step='1'
                                                            style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '6px 10px', borderRadius: 8, fontSize: '0.9rem', fontWeight: 700 }}
                                                            value={p[field]}
                                                            onChange={e => updateProfile(sport, field, e.target.value)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Multipliers section */}
                                        <div>
                                            <p style={{ margin: '0 0 0.6rem', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Performance Multipliers (relative to Basketball baseline)</p>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                                {MULTIPLIER_FIELDS.map(({ key, label, tooltip, inverse }) => {
                                                    const val = p[key] as number;
                                                    const col = multColor(val, inverse);
                                                    return (
                                                        <div key={key} title={tooltip}>
                                                            <label style={{ fontSize: '0.72rem', color: '#555', display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontWeight: 700 }}>
                                                                <span>{label}{inverse ? <span style={{ color: '#444', fontWeight: 400, marginLeft: 4 }}>(inverse)</span> : null}</span>
                                                                <span style={{ color: col, fontWeight: 900 }}>{val.toFixed(2)}×</span>
                                                            </label>
                                                            <input type='number' step='0.01' min='0.3' max='2.5'
                                                                style={{ width: '100%', background: '#1a1a1a', border: `1px solid ${col}44`, color: col, padding: '6px 10px', borderRadius: 8, fontSize: '0.9rem', fontWeight: 700 }}
                                                                value={val}
                                                                onChange={e => updateProfile(sport, key, e.target.value)}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            )}
        </div>
    );
};
