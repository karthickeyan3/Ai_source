import { useState, useMemo, useCallback } from 'react'
import type { AssessmentResult, FormData, Sport, MetricResult } from './types'
import { runAssessment, recalculateMetricsForSport } from './utils/percentileEngine'
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
import { Activity, Download, ChevronLeft, Filter, FileDown, Home, Plus, Upload } from 'lucide-react'
import { exportToPDF } from './utils/reportExporter'


type AppView = 'landing' | 'assessment' | 'dashboard' | 'bulk' | 'admin';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};


function App() {
  const [appView, setAppView] = useState<AppView>('landing')
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null)
  const [bulkResults, setBulkResults] = useState<AssessmentResult[]>([])
  const [sportFilter, setSportFilter] = useState('All')
  const [ageFilter, setAgeFilter] = useState('All')
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [activeSport, setActiveSport] = useState<Sport | null>(null)
  const [previousView, setPreviousView] = useState<AppView>('landing')

  const handleSportSelect = useCallback((sport: string) => {
    setActiveSport(sport as Sport);
  }, []);

  const handleAnalyze = (data: FormData) => {
    const result = runAssessment(data);
    setAssessmentResult(result);
    setActiveSport(null);
    setPreviousView('assessment');
    setAppView('dashboard');
    scrollToTop();
  };

  const handleBulkResults = (results: AssessmentResult[]) => {
    setBulkResults(results);
    setAssessmentResult(null); // Clear single report when new bulk upload happens
    setAppView('bulk');
    scrollToTop();
  };

  const handleNewBulkUpload = () => {
    setBulkResults([]);
    setAssessmentResult(null);
    setAppView('bulk');
    scrollToTop();
  };

  const handleLogout = () => {
    setAppView('landing');
    setIsUserLoggedIn(false);
    setIsAdminLoggedIn(false);
    setAssessmentResult(null);
    setBulkResults([]);
    setActiveSport(null);
    scrollToTop();
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

  const comparisonMetrics = useMemo(() => {
    if (!assessmentResult) return [];
    const sportToUse = activeSport || assessmentResult.sport;
    return recalculateMetricsForSport(
      assessmentResult.metrics,
      sportToUse,
      assessmentResult.gender,
      assessmentResult.age
    );
  }, [assessmentResult, activeSport]);

  const handleLandingStart = (view: 'single' | 'bulk' | 'admin') => {
    setAppView(view === 'single' ? 'assessment' : (view === 'bulk' ? 'bulk' : 'admin'));
    scrollToTop();
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
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleString('en-GB', { month: 'short' });
    const year = now.getFullYear();
    const dateStr = `${day}-${month}-${year}`;

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SRS_bulk_report_${dateStr}.csv`);
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
          {((appView === 'admin' && !isAdminLoggedIn) || (['assessment', 'dashboard', 'bulk'].includes(appView) && !isUserLoggedIn)) && (
            <button
              onClick={() => { setAppView('landing'); scrollToTop(); }}
              style={{
                background: '#000000',
                border: '1px solid #000000',
                borderRadius: 6,
                padding: '6px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#ffffff',
                marginRight: 10
              }}
            >
              <Home size={14} /> HOME
            </button>
          )}
          {appView === 'dashboard' && (
            <button
              onClick={() => { setAppView(previousView); scrollToTop(); }}
              style={{
                background: '#000000',
                border: '1px solid #000000',
                borderRadius: 6,
                padding: '6px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#ffffff',
              }}
            >
              <ChevronLeft size={14} /> BACK
            </button>
          )}
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
                  onClick={() => { setAppView('assessment'); scrollToTop(); }}
                  style={{ padding: '8px 18px' }}
                >
                  <Activity size={13} strokeWidth={2.5} /> NEW ASSESSMENT
                </button>
                <button
                  className={`${styles.tab} ${appView === 'bulk' ? styles.tabActive : ''}`}
                  onClick={handleNewBulkUpload}
                  style={{ padding: '8px 18px' }}
                >
                  <Upload size={13} strokeWidth={2.5} />Bulk CSV Upload
                </button>

              </>
            )}
            {(isUserLoggedIn || isAdminLoggedIn) && appView !== 'admin' && (
              <button
                className={styles.tab}
                onClick={handleLogout}
                style={{
                  background: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: 8,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.75rem'
                }}
              >
                LOGOUT
              </button>
            )}
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
            <div id="individual-report-content" style={{ padding: '4px' }}>
              <ScoreCard
                result={assessmentResult}
                onSportSelect={handleSportSelect}
                actions={
                  <button
                    onClick={() => exportToPDF('individual-report-content', assessmentResult.athleteName)}
                    className={styles.pdfBtn}
                    data-html2canvas-ignore="true"
                    style={{ padding: '6px 12px', fontSize: '0.7rem' }}
                  >
                    <FileDown size={16} /> Export
                  </button>
                }
              />
              <div className={styles.chartsRowGrid} style={{ marginTop: '32px' }}>
                {assessmentResult.recommendedSports.slice(0, 3).map((reco, idx) => (
                  <PerformanceRadar
                    key={`${reco.sport}-${idx}`}
                    metrics={assessmentResult.metrics}
                    age={assessmentResult.age}
                    gender={assessmentResult.gender}
                    sport={reco.sport}
                    athleteName={assessmentResult.athleteName}
                  />
                ))}
              </div>

              <div style={{ marginTop: '80px', marginBottom: '60px' }}>
                <RankingsTable
                  metrics={comparisonMetrics}
                  sport={activeSport || assessmentResult.sport}
                />
              </div>
            </div>
          </div>
        )}


        {appView === 'bulk' && isUserLoggedIn && (
          <div className={styles.resultsPanel}>
            {bulkResults.length === 0 ? (
              <BulkUpload onBulkResults={handleBulkResults} />
            ) : (
              <div className={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
                  <h2 className={styles.tableTitle}>BULK ASSESSMENT RESULTS ({bulkResults.length})</h2>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      onClick={handleNewBulkUpload}
                      style={{
                        background: '#000',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: 8,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        fontSize: '0.85rem',
                      }}
                    >
                      <Plus size={18} /> New Bulk CSV Upload
                    </button>
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
                          <th style={{ textAlign: 'center' }}>RANK</th>
                          <th style={{ textAlign: 'center' }}>ATHLETE</th>
                          <th style={{ textAlign: 'center' }}>AGE</th>
                          <th style={{ textAlign: 'center' }}>RECOMMENDED SPORT</th>
                          <th style={{ textAlign: 'center' }}>OVERALL SCORE ↓</th>
                          <th style={{ textAlign: 'center' }}>RATING</th>
                          <th style={{ textAlign: 'center' }}>TOP STRENGTH</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBulkResults.map((result: AssessmentResult, idx: number) => (
                          <tr key={idx} onClick={() => { setPreviousView('bulk'); setAssessmentResult(result); setAppView('dashboard'); scrollToTop(); }} style={{ cursor: 'pointer' }}>
                            <td style={{ fontWeight: 800, color: '#9ca3af', width: '50px', textAlign: 'center' }}>#{idx + 1}</td>
                            <td className={styles.metricName} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className={styles.overallScoreBadge} style={{ fontSize: '0.7rem', padding: '2px 6px', minWidth: '40px' }}>{result.overallScore}%</span>
                              {result.athleteName}
                            </td>
                            <td style={{ fontWeight: 700, color: '#6b7280', textAlign: 'center' }}>{result.age}</td>
                            <td style={{ fontWeight: 800, color: '#3b82f6', textAlign: 'center' }}>{result.sport}</td>
                            <td className={styles.percentile} style={{ textAlign: 'center' }}>{result.overallScore}%</td>
                            <td style={{ textAlign: 'center' }}>
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
                            <td style={{ color: '#000', fontWeight: 600, textAlign: 'center' }}>{result.strengths[0].metric}</td>
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

