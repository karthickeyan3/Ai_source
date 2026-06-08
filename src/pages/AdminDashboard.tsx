import { useState, useMemo } from 'react';
import { getSportWeights, saveSportWeights, addSportWeight, deleteSportWeight } from '../utils/weightService';
import type { SportConfig, SportWeights } from '../utils/weightService';
import {
    getSportProfiles, saveSportProfiles, resetSportProfile,
    DEFAULT_SPORT_ANCHORS, METRIC_KEYS
} from '../utils/sportProfileService';
import type { SportAnchor } from '../utils/sportProfileService';
import { rebuildNormativeData } from '../data/normativeData';
import styles from '../App.module.css';
import { Save, LogOut, Plus, Trash2, ShieldCheck, AlertCircle, RotateCcw, Info, ChevronUp, ChevronDown } from 'lucide-react';

interface AdminDashboardProps {
    onLogout: () => void;
}

const PERCENTILES = ['p10', 'p25', 'p50', 'p75', 'p90'] as const;

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
    const [activeTab, setActiveTab] = useState<'weights' | 'profiles'>('weights');

    // ── Weight tab state ──────────────────────────────────────────────────────
    const [configs, setConfigs] = useState<Record<string, SportConfig>>(() => getSportWeights());
    const [searchTerm, setSearchTerm] = useState('');
    const [newSport, setNewSport] = useState({ name: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    // ── Sport Profiles tab state ──────────────────────────────────────────────
    const [profiles, setProfiles] = useState<Record<string, SportAnchor>>(() => getSportProfiles());
    const [profileSearch, setProfileSearch] = useState('');
    const [expandedSport, setExpandedSport] = useState<string | null>(null);
    const [profilesSaved, setProfilesSaved] = useState(false);
    const [selectedGender, setSelectedGender] = useState<'Male' | 'Female'>('Male');

    const [newProfileSport, setNewProfileSport] = useState({ name: '' });
    const [showAddProfileForm, setShowAddProfileForm] = useState(false);

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

    const handleAddSportProfileSubmit = () => {
        if (!newProfileSport.name.trim()) return;
        const name = newProfileSport.name.trim();
        if (profiles[name]) {
            alert("Sport already exists!");
            return;
        }
        // Deep copy Basketball as template
        const template = JSON.parse(JSON.stringify(profiles['Basketball'] || DEFAULT_SPORT_ANCHORS['Basketball']));
        setProfiles(prev => ({ ...prev, [name]: template }));
        setProfilesSaved(false);
        setExpandedSport(name);
        setNewProfileSport({ name: '' });
        setShowAddProfileForm(false);
    };

    const updateProfileMetric = (sport: string, gender: 'Male' | 'Female', metric: string, pLevel: string, value: string) => {
        let num = parseFloat(value);
        if (isNaN(num)) num = 0;

        setProfiles(prev => {
            const sportData = { ...prev[sport] };
            const genderData = { ...sportData[gender] };
            const metricData = { ...genderData[metric] };
            (metricData as any)[pLevel] = num;

            genderData[metric] = metricData;
            sportData[gender] = genderData;

            return { ...prev, [sport]: sportData };
        });
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
        const def = DEFAULT_SPORT_ANCHORS[sport];
        if (!def) return true; // Custom sport
        const cur = profiles[sport];
        return JSON.stringify(cur) !== JSON.stringify(def);
    };

    const updateWeight = (sportName: string, attr: keyof SportWeights, value: string) => {
        const val = value === '' ? '' : (parseInt(value) || 0);
        setConfigs(prev => ({
            ...prev,
            [sportName]: {
                ...prev[sportName],
                weights: { ...prev[sportName].weights, [attr]: val as any }
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

            {/* ── Weights Tab ───────────────────────────────────────────── */}
            {activeTab === 'weights' && (
                <>
                    {/* Add Sport Section */}
                    {!showAddForm ? (
                        <button
                            onClick={() => setShowAddForm(true)}
                            style={{ background: '#111', color: '#fff', border: '1px solid #333', padding: '12px 24px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 10 }}
                        >
                            <Plus size={18} /> ADD NEW SPORT WEIGHT
                        </button>
                    ) : (
                        <div className={styles.addSportCard}>
                            <h3 style={{ margin: '0 0 1.5rem', color: '#AAFF00' }}>CREATE NEW SPORT WEIGHT</h3>
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
                                    <button onClick={handleAddSport} style={{ background: '#AAFF00', color: '#000', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>CREATE SPORT WEIGHT</button>
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
                                    <th style={{ textAlign: 'center' }}>ANATOMY</th>
                                    <th style={{ textAlign: 'center' }}>SPEED</th>
                                    <th style={{ textAlign: 'center' }}>AGILITY</th>
                                    <th style={{ textAlign: 'center' }}>POWER</th>
                                    <th style={{ textAlign: 'center' }}>ENDURANCE</th>
                                    <th style={{ textAlign: 'center' }}>STRENGTH</th>
                                    <th style={{ textAlign: 'center' }}>FLEXIBILITY</th>
                                    <th style={{ textAlign: 'center' }}>JUMPING</th>
                                    <th style={{ textAlign: 'center' }}>ACCURACY</th>
                                    <th style={{ textAlign: 'center' }}>BALANCE</th>
                                    <th style={{ textAlign: 'center' }}>COORDINATION</th>
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
                                            <td style={{ fontWeight: 800, color: '#fff' }}>{config.name}</td>
                                            <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.anatomy} onChange={e => updateWeight(config.name, 'anatomy', e.target.value)} /></td>
                                            <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.speed} onChange={e => updateWeight(config.name, 'speed', e.target.value)} /></td>
                                            <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.agility} onChange={e => updateWeight(config.name, 'agility', e.target.value)} /></td>
                                            <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.power} onChange={e => updateWeight(config.name, 'power', e.target.value)} /></td>
                                            <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.endurance} onChange={e => updateWeight(config.name, 'endurance', e.target.value)} /></td>
                                            <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.strength} onChange={e => updateWeight(config.name, 'strength', e.target.value)} /></td>
                                            <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.flexibility} onChange={e => updateWeight(config.name, 'flexibility', e.target.value)} /></td>
                                            <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.jumping} onChange={e => updateWeight(config.name, 'jumping', e.target.value)} /></td>
                                            <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.accuracy} onChange={e => updateWeight(config.name, 'accuracy', e.target.value)} /></td>
                                            <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.balance} onChange={e => updateWeight(config.name, 'balance', e.target.value)} /></td>
                                            <td style={{ textAlign: 'center' }}><input type="number" className={styles.weightInput} value={config.weights.coordination} onChange={e => updateWeight(config.name, 'coordination', e.target.value)} /></td>
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

            {/* ── Sport Profiles Tab (Anchors) ───────────────────────────── */}
            {activeTab === 'profiles' && (
                <div>
                    {!showAddProfileForm ? (
                        <button
                            onClick={() => setShowAddProfileForm(true)}
                            style={{ background: '#111', color: '#fff', border: '1px solid #333', padding: '12px 24px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 10 }}
                        >
                            <Plus size={18} /> ADD NEW SPORT PROFILE
                        </button>
                    ) : (
                        <div className={styles.addSportCard} style={{ marginBottom: '2rem' }}>
                            <h3 style={{ margin: '0 0 1.5rem', color: '#AAFF00' }}>CREATE NEW SPORT PROFILE</h3>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <label className={styles.label} style={{ color: '#aaa' }}>Sport Name</label>
                                    <input
                                        className={styles.input}
                                        style={{ background: '#222', border: '1px solid #444', color: '#fff' }}
                                        value={newProfileSport.name}
                                        onChange={e => setNewProfileSport(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g. Rugby"
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={handleAddSportProfileSubmit} style={{ background: '#AAFF00', color: '#000', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>CREATE PROFILE</button>
                                    <button onClick={() => setShowAddProfileForm(false)} style={{ background: 'transparent', color: '#666', border: '1px solid #333', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>CANCEL</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>AGE 14 BASELINE ANCHORS (p10-p90)</h2>
                        </div>
                        <input className={styles.input}
                            style={{ width: '260px', background: 'rgba(255,255,255,0.05)', border: '1px solid #333', color: '#fff' }}
                            placeholder='Search sports...'
                            value={profileSearch}
                            onChange={e => setProfileSearch(e.target.value)}
                        />
                    </div>

                    <div style={{ background: 'rgba(170,255,0,0.05)', border: '1px solid rgba(170,255,0,0.15)', borderRadius: 12, padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <Info size={18} color='#AAFF00' style={{ flexShrink: 0, marginTop: 2 }} />
                        <div style={{ fontSize: '0.85rem', color: '#bbb', lineHeight: 1.7 }}>
                            Edit the direct un-multiplied perfection standard (Age 14) for any sport. The system automatically calculates 10-16 growth targets using these explicit base numbers. Any modifications here are immediately saved into browser memory ensuring your custom datasets override defaults. All new sports added get generated automatically within the Assessment Engine.
                        </div>
                    </div>

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
                                        <div style={{ padding: '1rem 1.2rem 1.5rem', borderTop: '1px solid #1e1e1e', overflowX: 'auto' }}>
                                            <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                                                <button onClick={(e) => { e.stopPropagation(); setSelectedGender('Male'); }} style={{ background: selectedGender === 'Male' ? '#22c55e' : '#222', color: selectedGender === 'Male' ? '#000' : '#fff', border: 'none', padding: '6px 16px', borderRadius: 20, fontWeight: 700, cursor: 'pointer' }}>MALE</button>
                                                <button onClick={(e) => { e.stopPropagation(); setSelectedGender('Female'); }} style={{ background: selectedGender === 'Female' ? '#a855f7' : '#222', color: selectedGender === 'Female' ? '#fff' : '#fff', border: 'none', padding: '6px 16px', borderRadius: 20, fontWeight: 700, cursor: 'pointer' }}>FEMALE</button>
                                            </div>

                                            <table className={styles.weightTable} style={{ minWidth: 600, background: 'rgba(0,0,0,0.2)' }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ textAlign: 'left', width: 140, color: '#888', borderBottom: '1px solid #333' }}>METRIC</th>
                                                        {PERCENTILES.map(pName => <th key={pName} style={{ textAlign: 'center', color: '#888', borderBottom: '1px solid #333' }}>{pName.toUpperCase()}</th>)}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {METRIC_KEYS.map(metric => {
                                                        // Ensure data exists because we might have added a new metric that wasn't in an old save
                                                        if (!p[selectedGender]) (p as any)[selectedGender] = {};
                                                        if (!p[selectedGender][metric]) (p[selectedGender] as any)[metric] = { p10: 0, p25: 0, p50: 0, p75: 0, p90: 0 };

                                                        return (
                                                            <tr key={metric} className={styles.weightRow}>
                                                                <td style={{ fontWeight: 700, color: '#aaa', fontSize: '0.75rem', textTransform: 'uppercase' }}>{metric}</td>
                                                                {PERCENTILES.map(pString => {
                                                                    const val = (p[selectedGender] as any)[metric][pString];
                                                                    return (
                                                                        <td key={pString} style={{ textAlign: 'center' }}>
                                                                            <input
                                                                                type="number"
                                                                                step="0.1"
                                                                                style={{ width: '60px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '6px 8px', borderRadius: 6, textAlign: 'center', fontSize: '0.85rem' }}
                                                                                value={val === undefined ? 0 : val}
                                                                                onChange={e => updateProfileMetric(sport, selectedGender, metric, pString, e.target.value)}
                                                                            />
                                                                        </td>
                                                                    )
                                                                })}
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
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
