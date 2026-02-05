import { useState, useEffect, useRef } from 'react'
import { riddles } from '../data'
import Avatar from './Avatar'

import bgForest from '../assets/ghibli/bg_forest_1770314298231.png';
import bgSky from '../assets/ghibli/bg_sky_1770314324055.png';
import bgVillage from '../assets/ghibli/bg_village_1770314337439.png';
import bgMeadow from '../assets/ghibli/bg_meadow_1770314359744.png';

const backgrounds = [bgForest, bgSky, bgVillage, bgMeadow];

export default function SoloGame({ lang, avatarType, onExit, incrementCount, checkLimit }) {

    // Filter riddles by language for initial check
    const langPool = riddles.filter(r => r.lang === lang);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [input, setInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(20);
    const [status, setStatus] = useState('PLAYING'); // PLAYING, WIN, LOSE, PAUSED
    const [shake, setShake] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [difficulty, setDifficulty] = useState(1); // 1: Fácil, 2: Medio, 3: Difícil

    // Timer Ref to clear it
    const timerRef = useRef(null);

    // Init on mount
    useEffect(() => {
        loadQuestion();
    }, []);

    // Sound refs (placeholder)
    const successSound = useRef(null);
    const failSound = useRef(null);

    // Load next question or end if no more
    const loadQuestion = () => {
        if (!checkLimit()) {
            onExit();
            return;
        }

        // Filter by lang
        let langPool = riddles.filter(r => r.lang === lang);

        // Filter by difficulty
        let pool = langPool.filter(r => r.difficulty === difficulty);

        // Fallback if no riddles for this difficulty (e.g. incomplete languages), use any
        if (pool.length === 0) pool = langPool;

        if (pool.length === 0) return; // No riddles at all for this language

        let nextIdx;
        // Ensure we don't repeat the same question immediately if possible
        // Note: ID based check is safer as indices change with filtering
        const currentId = riddles[currentIndex]?.id;

        if (pool.length > 1) {
            let attempts = 0;
            do {
                nextIdx = Math.floor(Math.random() * pool.length);
                attempts++;
            } while (pool[nextIdx].id === currentId && attempts < 5);
        } else {
            nextIdx = 0;
        }

        // Find the global index of the chosen riddle
        const globalIndex = riddles.findIndex(r => r.id === pool[nextIdx].id);

        setCurrentIndex(globalIndex);
        setInput('');
        setStatus('PLAYING');
        setTimeLeft(20);
        setShowHint(false);
        setShake(false);
    };

    // Start Timer Logic
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
    }, [status, currentIndex]);

    const handleLose = () => {
        setStatus('LOSE');
        clearInterval(timerRef.current);
        incrementCount();
        if (navigator.vibrate) navigator.vibrate(200);

        setTimeout(() => {
            loadQuestion();
        }, 4000);
    };

    const handleWin = () => {
        // Difficulty Logic
        const timeTaken = 20 - timeLeft;
        if (timeTaken < 8) {
            setDifficulty(prev => Math.min(prev + 1, 3));
        } else if (timeTaken > 15) {
            setDifficulty(prev => Math.max(prev - 1, 1));
        }

        setStatus('WIN');
        clearInterval(timerRef.current);
        incrementCount();
        if (navigator.vibrate) navigator.vibrate(50);

        setTimeout(() => {
            loadQuestion();
        }, 1500);
    };

    const checkAnswer = (val) => {
        const currentRiddle = riddles[currentIndex];
        if (!currentRiddle) return;

        const clean = (str) => str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        if (clean(val) === clean(currentRiddle.answer)) {
            handleWin();
        }
    };

    const handleChange = (e) => {
        if (status !== 'PLAYING') return;
        setInput(e.target.value);
        checkAnswer(e.target.value);
    };

    const togglePause = () => {
        if (status === 'PLAYING') {
            setStatus('PAUSED');
        } else if (status === 'PAUSED') {
            setStatus('PLAYING');
        }
    };

    // Skip if no riddles for lang
    if (langPool.length === 0) {
        return (
            <div className="card">
                <h2>Lo sentimos</h2>
                <p>No hay adivinanzas en este idioma aún.</p>
                <button className="btn" onClick={onExit}>Volver</button>
            </div>
        );
    }

    // Use global riddles based on global index
    const currentRiddle = riddles[currentIndex];

    // Checking safety of currentRiddle
    if (!currentRiddle) return null;

    // Auto-show hint after 5 seconds
    useEffect(() => {
        if (timeLeft < 15 && status === 'PLAYING') {
            setShowHint(true);
        }
    }, [timeLeft, status]);

    // Calculate Progress for Bar (Total 20s)
    const progressPct = (timeLeft / 20) * 100;

    // Background Selection based on index
    const currentBg = backgrounds[currentIndex % backgrounds.length];

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${currentBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: -1,
                    transition: 'background-image 1s ease-in-out'
                }}
            />

            <div className={`card ${status === 'WIN' ? 'success-glow' : ''}`} style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                    <button
                        className="icon-btn"
                        onClick={onExit}
                        style={{ fontSize: '1.5rem', color: 'white', background: '#e74c3c' }}
                    >
                        ✕
                    </button>

                    {/* Pause Button */}
                    {(status === 'PLAYING' || status === 'PAUSED') && (
                        <button
                            className="icon-btn"
                            onClick={togglePause}
                            style={{ fontSize: '2rem' }}
                        >
                            {status === 'PAUSED' ? '▶️' : '⏸️'}
                        </button>
                    )}

                    <div style={{ fontWeight: '900', fontSize: '1.5rem', fontFamily: 'monospace', color: timeLeft < 5 ? 'var(--error)' : 'black' }}>
                        {Math.ceil(timeLeft)}s
                    </div>
                </div>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${progressPct}%`,
                            background: timeLeft < 5 ? 'var(--error)' : undefined
                        }}
                    />
                </div>

                {status === 'PAUSED' ? (
                    <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏸️</div>
                        <h3 style={{ fontSize: '2rem' }}>PAUSA</h3>
                        <p style={{ opacity: 0.8 }}>Relájate y piensa...</p>
                        <button className="btn" onClick={togglePause} style={{ marginTop: '2rem' }}>REANUDAR</button>
                    </div>
                ) : (
                    <>
                        <Avatar state={status} type={avatarType} />

                        <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold', marginBottom: '0.5rem', letterSpacing: '1px' }}>
                            NIVEL: {difficulty === 1 ? '⭐ FÁCIL' : difficulty === 2 ? '⭐⭐ MEDIO' : '⭐⭐⭐ DIFÍCIL'}
                        </div>

                        <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', minHeight: '80px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            {currentRiddle.text}
                        </h2>

                        {status === 'LOSE' ? (
                            <div style={{ margin: '1rem 0', color: 'var(--primary)', fontSize: '1.5rem', fontWeight: '900', animation: 'bounce 0.5s' }}>
                                ¡Ooops! 🙈 <br />
                                Era: {currentRiddle.answer}
                            </div>
                        ) : (
                            <input
                                autoFocus
                                className={`input ${shake ? 'shake' : ''}`}
                                value={input}
                                onChange={handleChange}
                                placeholder="TU RESPUESTA..."
                                disabled={status !== 'PLAYING'}
                                autoComplete="off"
                            />
                        )}

                        {/* Hint Area */}
                        <div className={`hint-box ${showHint ? 'hint-visible' : ''}`}>
                            <div className="hint-pill">
                                💡 Pista: {currentRiddle.hint}
                            </div>
                        </div>

                        {status === 'WIN' && (
                            <div className="success-text">
                                ¡CORRECTO! 🎉
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}
