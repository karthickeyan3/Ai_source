import { useState, useMemo, useCallback } from 'react'
import type { AssessmentResult, FormData, Sport, MetricResult } from './types'
import { runAssessment } from './utils/percentileEngine'
import { AssessmentFormPage } from './pages/AssessmentFormPage'
import { RankingsTable } from './components/RankingsTable'
import { ScoreCard } from './components/ScoreCard'
import { PerformanceRadar } from './components/RadarChart'
import { BulkUpload } from './components/BulkUpload'
import { LandingPage } from './pages/LandingPage'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminLogin } from './pages/AdminLogin'
import { UserLogin } from './pages/UserLogin'
import styles from './App.module.css'
import { Activity, Users, Download, ChevronLeft, Filter, Lock } from 'lucide-react'

type AppView = 'landing' | 'assessment' | 'dashboard' | 'bulk' | 'admin';

function App() {
  const [appView, setAppView] = useState<AppView>('landing')
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null)
  const [bulkResults, setBulkResults] = useState<AssessmentResult[]>([])
  const [sportFilter, setSportFilter] = useState('All')
  const [ageFilter, setAgeFilter] = useState('All')
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [activeSport, setActiveSport] = useState<Sport | null>(null)

  const handleSportSelect = useCallback((sport: string) => {
    setActiveSport(sport as Sport);
  }, []);

  const handleAnalyze = (data: FormData) => {
    const result = runAssessment(data);
    setAssessmentResult(result);
    setActiveSport(null);
    setAppView('dashboard');
  };

  const handleBulkResults = (results: AssessmentResult[]) => {
    setBulkResults(results);
    setAppView('bulk');
  };
  const filteredBulkResults = useMemo(() => {
    return bulkResults
      .filter((r: AssessmentResult) => {
        const matchesSport = sportFilter === 'All' || r.sport === sportFilter;
        const matchesAge = ageFilter === 'All' || r.age.toString() === ageFilter;
        return matchesSport && matchesAge;
      })
      .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
  }, [bulkResults, sportFilter, ageFilter]);

  const uniqueAges = useMemo<string[]>(() => {
    return ['All', ...Array.from(new Set(bulkResults.map((r: AssessmentResult) => r.age.toString()))).sort((a, b) => parseInt(a) - parseInt(b))];
  }, [bulkResults]);

  const uniqueSports = useMemo<string[]>(() => {
    return ['All', ...Array.from(new Set(bulkResults.map((r: AssessmentResult) => r.sport)))];
  }, [bulkResults]);

  const handleLandingStart = (view: 'single' | 'bulk' | 'admin') => {
    setAppView(view === 'single' ? 'assessment' : (view === 'bulk' ? 'bulk' : 'admin'));
  };

  const downloadBulkResults = () => {
    if (bulkResults.length === 0) return;

    const rows = bulkResults.map((r: AssessmentResult) => ({
      Athlete: r.athleteName,
      Age: r.age,
      Sport: r.sport,
      OverallScore: `${r.overallScore}%`,
      Rating: r.overallRating,
      ...Object.fromEntries(r.metrics.map((m: MetricResult) => [m.metric, `${m.percentile}%`]))
    }));

    const csvContent = "data:text/csv;charset=utf-8,"
      + Object.keys(rows[0]).join(",") + "\n"
      + rows.map((row: Record<string, unknown>) => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "SRS_bulk_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Landing page ────────────────────────────────────────────
  if (appView === 'landing') {
    return <LandingPage onStart={handleLandingStart} />;
  }

  // ── Main App Layout ─────────────────────────────────────────
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => {
              setAppView('landing');
              setIsUserLoggedIn(false);
              setIsAdminLoggedIn(false);
              setAssessmentResult(null);
              setBulkResults([]);
              setActiveSport(null);
            }}
            style={{
              background: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              padding: '6px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#374151',
            }}
          >
            <ChevronLeft size={14} /> LOGOUT
          </button>
          <div className={styles.logo}>
            <span>SRS</span> Analytics
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.tabs} style={{ margin: 0 }}>
            {isUserLoggedIn && (
              <>
                <button
                  className={`${styles.tab} ${appView === 'assessment' ? styles.tabActive : ''}`}
                  onClick={() => setAppView('assessment')}
                  style={{ padding: '8px 18px' }}
                >
                  <Activity size={13} strokeWidth={2.5} /> NEW ASSESSMENT
                </button>
                <button
                  className={`${styles.tab} ${appView === 'bulk' ? styles.tabActive : ''}`}
                  onClick={() => setAppView('bulk')}
                  style={{ padding: '8px 18px' }}
                >
                  <Users size={13} strokeWidth={2.5} /> BULK UPLOAD
                </button>
                {assessmentResult && (
                  <button
                    className={`${styles.tab} ${appView === 'dashboard' ? styles.tabActive : ''}`}
                    onClick={() => setAppView('dashboard')}
                    style={{ padding: '8px 18px' }}
                  >
                    <Activity size={13} strokeWidth={2.5} /> PERFORMANCE INSIGHTS
                  </button>
                )}
              </>
            )}
            <button
              className={`${styles.tab} ${appView === 'admin' ? styles.tabActive : ''}`}
              onClick={() => setAppView('admin')}
              style={{ padding: '8px 18px' }}
            >
              <Lock size={13} strokeWidth={2.5} /> ADMIN
            </button>
          </div>
        </div>
      </header>

      <div className={styles.fullContainer}>
        {['assessment', 'dashboard', 'bulk'].includes(appView) && !isUserLoggedIn && (
          <UserLogin onLoginSuccess={() => setIsUserLoggedIn(true)} />
        )}

        {appView === 'assessment' && isUserLoggedIn && (
          <AssessmentFormPage onAnalyze={handleAnalyze} />
        )}

        {appView === 'dashboard' && assessmentResult && isUserLoggedIn && (
          <div className={styles.resultsPanel}>
            <ScoreCard result={assessmentResult} onSportSelect={handleSportSelect} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              <PerformanceRadar
                metrics={assessmentResult.metrics}
                age={assessmentResult.age}
                gender={assessmentResult.gender}
                sport={activeSport || assessmentResult.sport}
              />
              <RankingsTable metrics={assessmentResult.metrics} />
            </div>
          </div>
        )}

        {appView === 'bulk' && isUserLoggedIn && (
          <div className={styles.resultsPanel}>
            <BulkUpload onBulkResults={handleBulkResults} />

            {bulkResults.length > 0 && (
              <div className={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
                  <h2 className={styles.tableTitle}>BULK ASSESSMENT RESULTS ({bulkResults.length})</h2>
                  <button
                    onClick={downloadBulkResults}
                    style={{
                      background: '#AAFF00',
                      color: '#000',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: 8,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontSize: '0.85rem',
                    }}
                  >
                    <Download size={18} /> EXPORT CSV REPORT
                  </button>
                </div>

                <div className={styles.filterSection}>
                  <div className={styles.filterGroup}>
                    <label className={styles.label}>
                      <Filter size={12} style={{ marginRight: 4 }} /> Filter by Recommendation
                    </label>
                    <select
                      className={styles.select}
                      value={sportFilter}
                      onChange={(e) => setSportFilter(e.target.value)}
                    >
                      {uniqueSports.map(sport => (
                        <option key={sport} value={sport}>{sport}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.filterGroup}>
                    <label className={styles.label}>
                      <Filter size={12} style={{ marginRight: 4 }} /> Filter by Age
                    </label>
                    <select
                      className={styles.select}
                      value={ageFilter}
                      onChange={(e) => setAgeFilter(e.target.value)}
                    >
                      {uniqueAges.map(age => (
                        <option key={age} value={age}>{age === 'All' ? 'All Ages' : `Age ${age}`}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.scrollableTable}>
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>RANK</th>
                          <th>ATHLETE</th>
                          <th>AGE</th>
                          <th>RECOMMENDED SPORT</th>
                          <th>OVERALL SCORE ↓</th>
                          <th>RATING</th>
                          <th>TOP STRENGTH</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBulkResults.map((result: AssessmentResult, idx: number) => (
                          <tr key={idx} onClick={() => { setAssessmentResult(result); setAppView('dashboard'); }} style={{ cursor: 'pointer' }}>
                            <td style={{ fontWeight: 800, color: '#9ca3af', width: '50px' }}>#{idx + 1}</td>
                            <td className={styles.metricName}>{result.athleteName}</td>
                            <td style={{ fontWeight: 700, color: '#6b7280' }}>{result.age}</td>
                            <td style={{ fontWeight: 800, color: '#3b82f6' }}>{result.sport}</td>
                            <td className={styles.percentile}>{result.overallScore}%</td>
                            <td>
                              <span
                                style={{
                                  color: result.overallRating === 'Elite Potential' || result.overallRating === 'Excellent' ? '#16a34a' :
                                    result.overallRating === 'Below Average' ? '#dc2626' :
                                      result.overallRating === 'Above Average' ? '#ca8a04' : '#6b7280',
                                  fontWeight: 800,
                                }}
                              >
                                {result.overallRating}
                              </span>
                            </td>
                            <td style={{ color: '#000', fontWeight: 600 }}>{result.strengths[0].metric}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {appView === 'admin' && (
          isAdminLoggedIn ? (
            <AdminDashboard onLogout={() => { setIsAdminLoggedIn(false); setAppView('landing'); }} />
          ) : (
            <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />
          )
        )}
      </div>
    </div>
  )
}

export default App

