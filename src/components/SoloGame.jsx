import { useState, useEffect, useRef } from 'react'
import { challenges } from '../data'
import Avatar from './Avatar'

// Backgrounds (using existing Ghibli ones as placeholders for now)
import bgForest from '../assets/ghibli/bg_forest_1770314298231.png';
import bgSky from '../assets/ghibli/bg_sky_1770314324055.png';
import bgVillage from '../assets/ghibli/bg_village_1770314337439.png';
import bgMeadow from '../assets/ghibli/bg_meadow_1770314359744.png';

const backgrounds = [bgForest, bgSky, bgVillage, bgMeadow];

export default function SoloGame({ lang, avatarType, onExit, incrementCount, checkLimit }) {

    const [currentChallenge, setCurrentChallenge] = useState(null);

    // Game State
    const [input, setInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(20);
    const [status, setStatus] = useState('PLAYING'); // PLAYING, WIN, LOSE, PAUSED
    const [shake, setShake] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [combo, setCombo] = useState(0); // Viral mechanic: streaks
    const [score, setScore] = useState(0);

    const timerRef = useRef(null);

    // Initial Load
    useEffect(() => {
        loadQuestion();
    }, []);

    const loadQuestion = () => {
        if (!checkLimit()) {
            onExit();
            return;
        }

        // 1. Filter by Language
        const langPool = challenges.filter(c => c.lang === lang);
        if (langPool.length === 0) return;

        // 2. Pick Random Challenge (Viral mix)
        let nextIdx;
        let nextChallenge;
        let attempts = 0;

        do {
            nextIdx = Math.floor(Math.random() * langPool.length);
            nextChallenge = langPool[nextIdx];
            attempts++;
        } while (currentChallenge && nextChallenge.id === currentChallenge.id && attempts < 5);

        setCurrentChallenge(nextChallenge);

        // Reset State
        setInput('');
        setStatus('PLAYING');
        setTimeLeft(20); // Fast pacing!
        setShowHint(false);
        setShake(false);
    };

    // Timer Logic
    useEffect(() => {
        if (status !== 'PLAYING') return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0.1) {
                    handleLose();
                    return 0;
                }
                return prev - 0.1;
            });
        }, 100);

        return () => clearInterval(timerRef.current);
    }, [status, currentChallenge]);

    const handleLose = () => {
        setStatus('LOSE');
        setCombo(0); // Reset combo
        clearInterval(timerRef.current);
        incrementCount();
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Angry vibe

        setTimeout(() => {
            loadQuestion();
        }, 3000);
    };

    const handleWin = () => {
        setStatus('WIN');
        setCombo(c => c + 1); // Increase combo
        setScore(s => s + 10 * (combo + 1));
        clearInterval(timerRef.current);
        incrementCount();
        if (navigator.vibrate) navigator.vibrate(50); // Nice tick

        // Viral: Check for "Juicy" moments
        // TODO: Confetti trigger here

        setTimeout(() => {
            loadQuestion();
        }, 1500);
    };

    // --- LOGIC FOR DIFFERENT TYPES ---

    // 1. Text Input (Classic Riddle)
    const checkTextAnswer = (val) => {
        const clean = (str) => str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (clean(val) === clean(currentChallenge.answer)) {
            handleWin();
        }
    };

    // 2. Option Selection (Logic/Math)
    const checkOption = (idx) => {
        if (status !== 'PLAYING') return;

        if (idx === currentChallenge.correctOption) {
            handleWin();
        } else {
            // Wrong option clicked
            setShake(true);
            if (navigator.vibrate) navigator.vibrate(200);
            setTimeout(() => setShake(false), 500);
            // Optional: Penalize time?
            setTimeLeft(t => Math.max(0, t - 5));
        }
    };

    const togglePause = () => {
        setStatus(prev => prev === 'PLAYING' ? 'PAUSED' : 'PLAYING');
    };

    // Render Helpers
    if (!currentChallenge) return null;

    const bgImage = backgrounds[(currentChallenge.id) % backgrounds.length];
    const progressPct = (timeLeft / 20) * 100;

    return (
        <>
            {/* Background Layer */}
            <div
                style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: -1,
                    transition: 'background-image 0.5s ease-out'
                }}
            />

            <div className={`card ${status === 'WIN' ? 'pop-in' : ''} ${shake ? 'shake' : ''}`}>

                {/* Header: Score & Timer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                    <button className="icon-btn" onClick={onExit} style={{ background: '#FF4757', color: 'white', border: 'none' }}>✕</button>

                    {/* Combo Counter (Viral Element) */}
                    {combo > 1 && (
                        <div style={{ background: '#ffa502', padding: '0.2rem 0.8rem', borderRadius: '20px', color: 'white', fontWeight: 'bold', transform: 'rotate(-5deg)' }}>
                            🔥 {combo}
                        </div>
                    )}

                    <div style={{ fontWeight: '900', fontSize: '1.5rem', fontFamily: 'monospace', color: timeLeft < 5 ? '#ff4757' : '#2f3542' }}>
                        {Math.ceil(timeLeft)}s
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progressPct}%`, background: timeLeft < 5 ? '#ff4757' : '#2ed573' }} />
                </div>

                {status === 'PAUSED' ? (
                    <div style={{ padding: '2rem 0' }}>
                        <h1>PAUSA</h1>
                        <button className="btn" onClick={togglePause}>CONTINUAR</button>
                    </div>
                ) : (
                    <>
                        <Avatar state={status} type={avatarType} />

                        {/* Challenge Text */}
                        <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', minHeight: '60px', color: '#2f3542' }}>
                            {currentChallenge.text}
                        </h2>

                        {/* --- RENDER BASED ON TYPE --- */}

                        {/* TYPE: LOGIC / MATH / TRICK (Buttons) */}
                        {['LOGIC', 'MATH', 'TRICK'].includes(currentChallenge.type) && currentChallenge.options && (
                            <div className="options-grid">
                                {currentChallenge.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        className="btn btn-option"
                                        onClick={() => checkOption(idx)}
                                        style={{ fontSize: '1.2rem', padding: '0.8rem' }}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* TYPE: RIDDLE (Text Input) */}
                        {currentChallenge.type === 'RIDDLE' && (
                            <>
                                {status === 'LOSE' ? (
                                    <div style={{ margin: '1rem 0', color: '#ff4757', fontSize: '1.4rem', fontWeight: '900' }}>
                                        {currentChallenge.answer}
                                    </div>
                                ) : (
                                    <input
                                        autoFocus
                                        className="input"
                                        value={input}
                                        onChange={(e) => {
                                            setInput(e.target.value);
                                            checkTextAnswer(e.target.value);
                                        }}
                                        placeholder="Escribe tu respuesta..."
                                        disabled={status !== 'PLAYING'}
                                        autoComplete="off"
                                    />
                                )}
                            </>
                        )}

                        {/* Viral Share Button */}
                        {(status === 'WIN' || status === 'LOSE') && (
                            <button
                                className="btn shake"
                                onClick={() => {
                                    const text = status === 'WIN'
                                        ? `🧠 ¡He acertado esta adivinanza en Adiviname! ¿Puedes tú?`
                                        : `🙈 ¡Casi! Esta adivinanza me ha ganado. Juega en Adiviname.`;
                                    navigator.clipboard.writeText(text);
                                    alert('¡Copiado al portapapeles! Compártelo 📲');
                                }}
                                style={{ marginTop: '1rem', background: '#3742FA', boxShadow: '0 8px 0 #2F35DF' }}
                            >
                                📲 RETAR AMIGOS
                            </button>
                        )}

                        {/* WIN STATE OVERLAY */}
                        {status === 'WIN' && (
                            <div style={{
                                position: 'absolute', top: '40%', left: 0, right: 0,
                                textAlign: 'center', textShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                pointerEvents: 'none'
                            }}>
                                <span style={{ fontSize: '4rem', animation: 'pop 0.3s' }}>🎉</span>
                            </div>
                        )}

                        {/* HINT */}
                        {(timeLeft < 10 && currentChallenge.hint) && (
                            <div className="hint-pill" style={{ marginTop: '1rem', opacity: 0.8 }}>
                                💡 {currentChallenge.hint}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}
