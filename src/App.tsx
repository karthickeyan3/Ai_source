import { useState } from 'react'
import type { AssessmentResult, FormData } from './types'
import { runAssessment } from './utils/percentileEngine'
import { InputForm } from './components/InputForm'
import { PerformanceRadar } from './components/RadarChart'
import { RankingsTable } from './components/RankingsTable'
import { ScoreCard } from './components/ScoreCard'
import { BulkUpload } from './components/BulkUpload'
import styles from './App.module.css'
import { Activity, Users, Download } from 'lucide-react'

function App() {
  const [activeView, setActiveView] = useState<'single' | 'bulk'>('single')
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null)
  const [bulkResults, setBulkResults] = useState<AssessmentResult[]>([])

  const handleAnalyze = (data: FormData) => {
    const result = runAssessment(data);
    setAssessmentResult(result);
  };

  const handleBulkResults = (results: AssessmentResult[]) => {
    setBulkResults(results);
  };

  const downloadBulkResults = () => {
    if (bulkResults.length === 0) return;

    const rows = bulkResults.map(r => ({
      Athlete: r.athleteName,
      Sport: r.sport,
      OverallScore: r.overallScore,
      Rating: r.overallRating,
      ...Object.fromEntries(r.metrics.map(m => [m.metric, `${m.percentile}%`]))
    }));

    const csvContent = "data:text/csv;charset=utf-8,"
      + Object.keys(rows[0]).join(",") + "\n"
      + rows.map(row => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "scout_ai_bulk_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span>SCOUT</span> AI
        </div>
        <div className={styles.tabs} style={{ margin: 0, width: '300px' }}>
          <button
            className={`${styles.tab} ${activeView === 'single' ? styles.tabActive : ''}`}
            onClick={() => setActiveView('single')}
          >
            <Activity size={14} style={{ marginRight: 6 }} /> ASSESSMENT
          </button>
          <button
            className={`${styles.tab} ${activeView === 'bulk' ? styles.tabActive : ''}`}
            onClick={() => setActiveView('bulk')}
          >
            <Users size={14} style={{ marginRight: 6 }} /> BULK UPLOAD
          </button>
        </div>
      </header>

      <div className={styles.container}>
        <aside>
          <InputForm onAnalyze={handleAnalyze} />
        </aside>

        <main>
          {activeView === 'single' ? (
            assessmentResult ? (
              <div className={styles.resultsPanel}>
                <ScoreCard result={assessmentResult} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <PerformanceRadar metrics={assessmentResult.metrics} />
                  <RankingsTable metrics={assessmentResult.metrics} />
                </div>
              </div>
            ) : (
              <div className={styles.card} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <Activity size={64} color="#e5e7eb" style={{ marginBottom: 24 }} />
                <h2 style={{ color: '#9ca3af' }}>READY FOR ANALYSIS</h2>
                <p style={{ color: '#6b7280', maxWidth: '300px' }}>Fill in the athlete metrics on the left to generate a performance report.</p>
              </div>
            )
          ) : (
            <div className={styles.resultsPanel}>
              <BulkUpload onBulkResults={handleBulkResults} />

              {bulkResults.length > 0 && (
                <div className={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className={styles.tableTitle}>BULK ASSESSMENT RESULTS ({bulkResults.length})</h2>
                    <button
                      onClick={downloadBulkResults}
                      style={{
                        background: '#AAFF00',
                        color: '#000',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: 6,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      <Download size={16} /> DOWNLOAD RESULTS CSV
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>ATHLETE</th>
                          <th>SPORT</th>
                          <th>OVERALL SCORE</th>
                          <th>RATING</th>
                          <th>TOP STRENGTH</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bulkResults.map((result, idx) => (
                          <tr key={idx} onClick={() => { setAssessmentResult(result); setActiveView('single'); }} style={{ cursor: 'pointer' }}>
                            <td className={styles.metricName}>{result.athleteName}</td>
                            <td>{result.sport}</td>
                            <td className={styles.percentile}>{result.overallScore}%</td>
                            <td>
                              <span
                                className={styles.ratingBadge}
                                style={{
                                  backgroundColor: result.overallRating === 'EXCELLENT' ? '#16a34a' :
                                    result.overallRating === 'NEEDS WORK' ? '#dc2626' : '#f3f4f6',
                                  color: result.overallRating === 'EXCELLENT' || result.overallRating === 'NEEDS WORK' ? '#fff' : '#000',
                                  margin: 0
                                }}
                              >
                                {result.overallRating}
                              </span>
                            </td>
                            <td style={{ color: '#16a34a', fontWeight: 600 }}>{result.strengths[0].metric}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
