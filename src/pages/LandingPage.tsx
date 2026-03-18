import { useEffect, useRef } from 'react';
import { ClipboardCheck, Target, BarChart3 } from 'lucide-react';
import heroImg from '../assets/hero_athlete.png';

interface LandingPageProps {
    onStart: (view: 'single' | 'bulk' | 'admin') => void;
}

const SPORTS = [
    { name: 'Soccer' },
    { name: 'Basketball' },
    { name: 'Cricket' },
    { name: 'Tennis' },
    { name: 'Gymnastics' },
    { name: 'Volleyball' },
    { name: 'Cycling' },
    { name: 'Rowing' },
    { name: 'Swimming (Sprint)' },
    { name: 'Swimming (Distance)' },
    { name: 'Track: Sprint' },
    { name: 'Track: Middle Dist' },
    { name: 'Track: Long Dist' },
    { name: 'Track: Jumps' },
    { name: 'Track: Throws' },
];

const STATS = [
    { value: '15', label: 'Sports & Events' },
    { value: '14', label: 'Metrics Tracked' },
    { value: '7', label: 'Age Groups (10–16)' },
];

export const LandingPage = ({ onStart }: LandingPageProps) => {
    const tickerRef = useRef<HTMLDivElement>(null);

    // Infinite ticker animation via JS
    useEffect(() => {
        const el = tickerRef.current;
        if (!el) return;
        let pos = 0;
        const speed = 0.5;
        const half = el.scrollWidth / 2;
        const tick = () => {
            pos += speed;
            if (pos >= half) pos = 0;
            el.style.transform = `translateX(-${pos}px)`;
            requestAnimationFrame(tick);
        };
        const id = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0d0d0d',
            color: '#fff',
            fontFamily: "'Inter', system-ui, sans-serif",
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
        }}>
            <style>{`
                .lp-hero { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 62px); position: relative; }
                .lp-hero-img { position: relative; overflow: hidden; }
                .how-it-works-card:hover {
                    transform: translateY(-8px);
                    border-color: rgba(170,255,0,0.3) !important;
                    background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%) !important;
                }
                .lp-nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.25rem 2rem;
                    border-bottom: 1px solid rgba(255,255,255,0.07);
                    position: sticky;
                    top: 0;
                    zIndex: 50;
                    background: rgba(13,13,13,0.92);
                    backdrop-filter: blur(12px);
                }
                .lp-nav-logo { display: flex; alignItems: center; gap: 10px; }
                .lp-nav-buttons { display: flex; gap: 12px; }
                
                @media (max-width: 768px) {
                    .lp-hero { grid-template-columns: 1fr; }
                    .lp-hero-img { height: 280px; order: -1; } /* Image on top for mobile */
                    .lp-nav { padding: 1rem; flex-direction: column; gap: 1rem; position: relative; }
                    .lp-nav-buttons { width: 100%; justify-content: center; }
                    .lp-nav-buttons button { flex: 1; padding: 10px 12px !important; font-size: 0.7rem !important; }
                    .lp-hide-mobile { display: none; }
                    .lp-hero-content { padding: 2rem 1.5rem !important; text-align: center; align-items: center; }
                    .lp-hero-content p { margin-left: auto; margin-right: auto; }
                    .lp-hero-ctas { justify-content: center; width: 100%; }
                    .lp-hero-ctas button { width: 100%; }
                    .lp-stats { justify-content: center; gap: 20px !important; }
                    .lp-footer { flex-direction: column; text-align: center; gap: 1.5rem !important; padding: 2rem 1rem !important; }
                    .lp-footer-right { flex-direction: column; gap: 1rem !important; }
                }
            `}</style>

            {/* ── MARQUEE SPORTS TICKER ──────────────────────────── */}
            <div style={{
                background: '#AAFF00',
                padding: '10px 0',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
            }}>
                <div ref={tickerRef} style={{ display: 'inline-flex', gap: 0 }}>
                    {[...SPORTS, ...SPORTS, ...SPORTS, ...SPORTS].map((s, i) => (
                        <span key={i} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '0 24px',
                            fontSize: '0.78rem',
                            fontWeight: 900,
                            color: '#000',
                            letterSpacing: 1.5,
                            textTransform: 'uppercase',
                            borderRight: '1px solid rgba(0,0,0,0.2)',
                        }}>
                            {s.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── NAV ─────────────────────────────────────────────── */}
            <nav className="lp-nav">
                <div className="lp-nav-logo">
                    <span style={{
                        background: '#AAFF00',
                        color: '#000',
                        fontWeight: 900,
                        fontSize: '1rem',
                        padding: '3px 10px',
                        borderRadius: 4,
                        letterSpacing: 1,
                    }}>SRS</span>
                    <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: 2, color: '#fff', marginLeft: '6px' }} className="lp-hide-mobile">Sports Analytics</span>
                </div>
                <div className="lp-nav-buttons">
                    <button
                        onClick={() => onStart('admin')}
                        style={{
                            background: 'transparent',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.2)',
                            padding: '9px 22px',
                            borderRadius: 6,
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            letterSpacing: 1,
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                        }}>
                        Admin Access
                    </button>
                </div>
            </nav>

            {/* ── HERO ─────────────────────────────────────────────── */}
            <section className="lp-hero">
                {/* Left */}
                <div className="lp-hero-content" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: 'clamp(2rem, 5vw, 5rem)',
                    zIndex: 2,
                }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        border: '1px solid #AAFF00',
                        borderRadius: 4,
                        padding: '4px 12px',
                        marginBottom: '1.5rem',
                        width: 'fit-content',
                    }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#AAFF00', display: 'inline-block' }} />
                        <span style={{ color: '#AAFF00', fontSize: '0.7rem', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>
                            Ages 10–16
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 style={{
                        margin: 0,
                        lineHeight: 1.05,
                        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: -1,
                    }}>
                        Unlock Your<br />
                        <span style={{ color: '#AAFF00' }}>Elite</span><br />
                        Potential
                    </h1>

                    <p style={{
                        color: '#9ca3af',
                        fontSize: '1.2rem',
                        lineHeight: 1.6,
                        maxWidth: 480,
                        marginTop: '1.5rem',
                    }}>
                        Compare your child's physical metrics against <span style={{ color: '#AAFF00', fontWeight: 700 }}> elite youth benchmarks</span> across 15 sports and events. Get <span style={{ color: '#AAFF00', fontWeight: 700 }}> data-driven insights</span> and
                        <span style={{ color: '#AAFF00', fontWeight: 700 }}> talent identification</span>.
                    </p>

                    {/* CTAs */}
                    <div className="lp-hero-ctas" style={{ display: 'flex', gap: 12, marginTop: '2rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => onStart('single')}
                            style={{
                                background: '#AAFF00',
                                color: '#000',
                                border: 'none',
                                padding: '14px 32px',
                                borderRadius: 6,
                                fontWeight: 900,
                                fontSize: '0.85rem',
                                letterSpacing: 1.5,
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                transition: 'transform 0.15s, box-shadow 0.15s',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';
                                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(170,255,0,0.35)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                            }}
                        >
                            Start Assessment
                        </button>
                    </div>

                    {/* Mini stats */}
                    <div className="lp-stats" style={{
                        display: 'flex',
                        gap: 28,
                        marginTop: '3rem',
                        flexWrap: 'wrap',
                    }}>
                        {STATS.map(s => (
                            <div key={s.label}>
                                <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 900, color: '#AAFF00', lineHeight: 1 }}>{s.value}</div>
                                <div style={{ fontSize: '0.68rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — hero image */}
                <div className="lp-hero-img">
                    {/* Dark gradient overlay on left edge */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to right, #0d0d0d 0%, transparent 30%)',
                        zIndex: 1,
                        pointerEvents: 'none',
                    }} />
                    {/* Green tint overlay */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(170,255,0,0.12) 0%, transparent 50%)',
                        zIndex: 1,
                        pointerEvents: 'none',
                    }} />
                    <img
                        src={heroImg}
                        alt="Young athlete sprinting"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center top',
                            filter: 'contrast(1.08) saturate(0.9)',
                        }}
                    />
                </div>
            </section>

            {/* ── SPORT CARDS SECTION ───────────────────────────── */}
            <section style={{
                padding: 'clamp(3rem, 6vw, 4.5rem) 5% 1rem',
                background: '#0a0a0a',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
            }}>
                <div style={{
                    maxWidth: 1300,
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: 'clamp(2rem, 4vw, 4rem)',
                    alignItems: 'flex-start'
                }}>
                    {/* Left Column: Context */}
                    <div style={{ position: 'sticky', top: 120 }}>
                        <p style={{ color: '#AAFF00', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 4, marginBottom: '1.5rem' }}>
                            Sport Discovery
                        </p>
                        <h2 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                            fontWeight: 900,
                            margin: '0 0 2rem',
                            letterSpacing: -2,
                            lineHeight: 1,
                            textTransform: 'uppercase'
                        }}>
                            15 Events.<br />
                            One Hub.<br />
                            <span style={{ color: '#AAFF00' }}>Infinite</span> Data.
                        </h2>
                        <p style={{
                            color: '#9ca3af',
                            fontSize: '1.25rem',
                            lineHeight: 1.6,
                            maxWidth: 480,
                            marginBottom: '2.5rem'
                        }}>
                            We compare every metric against <span style={{ color: '#fff', fontWeight: 700 }}>elite regional benchmarks</span>
                            to find where you fit best. Select a sport to explore the performance profiles.
                        </p>
                    </div>

                    <div className="sport-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '1px',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        width: '100%'
                    }}>
                        {SPORTS.map((sport, index) => (
                            <button
                                key={sport.name}
                                onClick={() => onStart('single')}
                                style={{
                                    background: '#0d0d0d',
                                    border: 'none',
                                    padding: '28px 24px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    minHeight: '90px'
                                }}
                                onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLButtonElement;
                                    el.style.background = '#AAFF00';
                                    (el.querySelector('.sport-label') as HTMLElement).style.color = '#000';
                                    (el.querySelector('.sport-index') as HTMLElement).style.color = 'rgba(0,0,0,0.5)';
                                    (el.querySelector('.sport-marker') as HTMLElement).style.opacity = '1';
                                    (el.querySelector('.sport-marker') as HTMLElement).style.transform = 'translateX(0)';
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLButtonElement;
                                    el.style.background = '#0d0d0d';
                                    (el.querySelector('.sport-label') as HTMLElement).style.color = '#fff';
                                    (el.querySelector('.sport-index') as HTMLElement).style.color = '#AAFF00';
                                    (el.querySelector('.sport-marker') as HTMLElement).style.opacity = '0';
                                    (el.querySelector('.sport-marker') as HTMLElement).style.transform = 'translateX(-10px)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <span className="sport-index" style={{
                                        fontSize: '0.85rem',
                                        fontWeight: 800,
                                        color: '#AAFF00',
                                        fontFamily: 'monospace',
                                        transition: 'color 0.3s',
                                        flexShrink: 0
                                    }}>
                                        [{(index + 1).toString().padStart(2, '0')}]
                                    </span>
                                    <span className="sport-label" style={{
                                        color: '#fff',
                                        fontWeight: 900,
                                        fontSize: '1.25rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '-0.5px',
                                        lineHeight: 1.2,
                                        transition: 'all 0.3s ease'
                                    }}>
                                        {sport.name}
                                    </span>
                                </div>
                                <span className="sport-marker" style={{
                                    opacity: 0,
                                    fontSize: '1.2rem',
                                    fontWeight: 900,
                                    color: '#000',
                                    transition: 'all 0.3s ease',
                                    transform: 'translateX(-10px)'
                                }}>
                                    →
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ─────────────────────────────────── */}
            <section style={{
                padding: '1.5rem clamp(1.5rem, 4vw, 4rem)',
                background: '#0d0d0d',
                position: 'relative',
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <p style={{ color: '#AAFF00', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 4, marginBottom: '0.5rem', opacity: 0.9 }}>
                        The Process
                    </p>
                    <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 900, margin: '0 0 2rem', letterSpacing: -1, lineHeight: 1.1 }}>
                        Three Steps to <span style={{ color: '#AAFF00' }}>Elite Insight</span>
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 24,
                    }}>
                        {[
                            { step: '01', title: 'Enter Metrics', desc: 'Input body measurements and performance test results for your athlete aged 10–16.', icon: <ClipboardCheck size={32} color="#AAFF00" strokeWidth={1.5} /> },
                            { step: '02', title: 'Get Analysis', desc: 'Our engine automatically calculates the best fit across 15 sports and events.', icon: <Target size={32} color="#AAFF00" strokeWidth={1.5} /> },
                            { step: '03', title: 'SRS Insights', desc: 'View percentile rankings, radar charts, talent clusters, and sport recommendations.', icon: <BarChart3 size={32} color="#AAFF00" strokeWidth={1.5} /> },
                        ].map(item => (
                            <div key={item.step}
                                className="how-it-works-card"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 24,
                                    padding: '48px 32px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    cursor: 'default',
                                }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                                    <div style={{
                                        background: 'rgba(170,255,0,0.1)',
                                        padding: 14,
                                        borderRadius: 16,
                                        border: '1px solid rgba(170,255,0,0.2)'
                                    }}>
                                        {item.icon}
                                    </div>
                                    <span style={{
                                        fontSize: '4.5rem',
                                        fontWeight: 900,
                                        color: 'rgba(170,255,0,0.07)',
                                        lineHeight: 0.7,
                                        fontStyle: 'italic',
                                        letterSpacing: -4,
                                        userSelect: 'none'
                                    }}>{item.step}</span>
                                </div>
                                <h3 style={{ margin: '0 0 14px', fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: -0.2 }}>{item.title}</h3>
                                <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ──────────────────────────────────── */}
            <section style={{
                background: '#AAFF00',
                padding: 'clamp(2.5rem, 4vw, 4rem) clamp(1.5rem, 4vw, 4rem)',
                textAlign: 'center',
            }}>
                <h2 style={{ color: '#000', fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', fontWeight: 900, margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: -0.5 }}>
                    Ready to Find Your Future Champion?
                </h2>
                <p style={{ color: 'rgba(0,0,0,0.6)', marginBottom: '1.75rem', fontSize: '1rem' }}>

                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => onStart('single')}
                        style={{
                            background: '#000',
                            color: '#AAFF00',
                            border: 'none',
                            padding: '14px 36px',
                            borderRadius: 6,
                            fontWeight: 900,
                            fontSize: '0.9rem',
                            letterSpacing: 1.5,
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                        }}
                    >
                        Start Assessment
                    </button>
                </div>
            </section>
        </div>
    );
};
