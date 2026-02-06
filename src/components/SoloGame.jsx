import { useState, useEffect, useRef } from 'react'
import { getChallenge } from '../data'
import Avatar from './Avatar'

// Backgrounds
import bgForest from '../assets/ghibli/bg_forest_1770314298231.png';
import bgSky from '../assets/ghibli/bg_sky_1770314324055.png';
import bgVillage from '../assets/ghibli/bg_village_1770314337439.png';
import bgMeadow from '../assets/ghibli/bg_meadow_1770314359744.png';

const backgrounds = [bgForest, bgSky, bgVillage, bgMeadow];

export default function SoloGame({ lang, avatarType, onExit, incrementCount, checkLimit }) {

    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [bgIndex, setBgIndex] = useState(0);

    // NO REPEAT LOGIC
    // We store seen IDs in a ref so it persists across renders but resets on unmount (new game)
    // If the user wants "Every time game starts it is new", unmount/remount does this.
    const seenIds = useRef(new Set());

    // Game State
    const [input, setInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(20);
    const [status, setStatus] = useState('PLAYING');
    const [shake, setShake] = useState(false);
    const [combo, setCombo] = useState(0);

    const timerRef = useRef(null);

    useEffect(() => {
        loadQuestion();
    }, []);

    const loadQuestion = () => {
        if (!checkLimit()) {
            onExit();
            return;
        }

        // --- INFINITE CONTENT GENERATOR WITH UNIQUE GUARD ---
        let nextChallenge;
        let attempts = 0;

        // Try up to 20 times to find a unique challenge
        do {
            nextChallenge = getChallenge(lang);
            attempts++;
        } while (seenIds.current.has(nextChallenge.id) && attempts < 20);

        // Mark as seen
        seenIds.current.add(nextChallenge.id);

        setCurrentChallenge(nextChallenge);
        setBgIndex(prev => (prev + 1) % backgrounds.length);

        setInput('');
        setStatus('PLAYING');
        setTimeLeft(nextChallenge.time_limit || 20);
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
        setCombo(0);
        clearInterval(timerRef.current);
        incrementCount();
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

        setTimeout(() => {
            loadQuestion();
        }, 3500);
    };

    const handleWin = () => {
        setStatus('WIN');
        setCombo(c => c + 1);
        clearInterval(timerRef.current);
        incrementCount();
        if (navigator.vibrate) navigator.vibrate(50);

        setTimeout(() => {
            loadQuestion();
        }, 1500);
    };

    // --- LOGIC ---

    const checkTextAnswer = (val) => {
        const clean = (str) => str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const info = currentChallenge.answer.toString();
        if (clean(val) === clean(info)) {
            handleWin();
        }
    };

    const checkOption = (opt) => {
        if (status !== 'PLAYING') return;

        if (opt.toString() === currentChallenge.answer.toString()) {
            handleWin();
        } else {
            setShake(true);
            if (navigator.vibrate) navigator.vibrate(200);
            setTimeout(() => setShake(false), 500);
            setTimeLeft(t => Math.max(0, t - 5));
        }
    };

    const togglePause = () => setStatus(prev => prev === 'PLAYING' ? 'PAUSED' : 'PLAYING');

    if (!currentChallenge) return null;

    const currentBg = backgrounds[bgIndex];
    const progressPct = (timeLeft / 20) * 100;

    return (
        <>
            <div
                style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: `url(${currentBg})`, backgroundSize: 'cover', backgroundPosition: 'center',
                    zIndex: -1, transition: 'background-image 0.5s ease-out'
                }}
            />

            <div className={`card ${status === 'WIN' ? 'pop-in' : ''} ${shake ? 'shake' : ''}`} style={{ padding: '1.5rem 1rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <button className="icon-btn" onClick={onExit} style={{ background: '#FF4757', color: 'white', border: 'none', width: '35px', height: '35px' }}>✕</button>

                    {combo > 1 && (
                        <div style={{ background: '#ffa502', padding: '0.2rem 0.6rem', borderRadius: '15px', color: 'white', fontWeight: 'bold', fontSize: '0.9rem', transform: 'rotate(-5deg)' }}>
                            🔥 {combo}
                        </div>
                    )}

                    <div style={{ fontWeight: '900', fontSize: '1.2rem', fontFamily: 'monospace', color: timeLeft < 5 ? '#ff4757' : '#2f3542' }}>
                        {Math.ceil(timeLeft)}s
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar" style={{ height: '10px', marginBottom: '1rem' }}>
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

                        {/* Tags */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', background: '#dfe4ea', padding: '2px 8px', borderRadius: '10px', color: '#747d8c', fontWeight: 'bold' }}>
                                {currentChallenge.type}
                            </span>
                            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', background: '#ffeaa7', padding: '2px 8px', borderRadius: '10px', color: '#d35400', fontWeight: 'bold' }}>
                                UNIQ
                            </span>
                        </div>

                        {/* Question */}
                        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', minHeight: '50px', color: '#2f3542', lineHeight: '1.2' }}>
                            {currentChallenge.question}
                        </h2>

                        {/* Options or Input */}
                        {currentChallenge.options ? (
                            <div className="options-grid">
                                {currentChallenge.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        className="btn btn-option"
                                        onClick={() => checkOption(opt)}
                                        style={{ fontSize: '1.2rem', padding: '0.8rem' }}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <>
                                {status === 'LOSE' ? (
                                    <div style={{ margin: '1rem 0', animation: 'bounce 0.5s' }}>
                                        <div style={{ color: '#ff4757', fontSize: '1.2rem', fontWeight: '900' }}>
                                            {currentChallenge.answer}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#57606f', marginTop: '5px' }}>
                                            {currentChallenge.explanation}
                                        </div>
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
                                        placeholder="Respuesta..."
                                        disabled={status !== 'PLAYING'}
                                        autoComplete="off"
                                        style={{ fontSize: '1.2rem' }}
                                    />
                                )}
                            </>
                        )}

                        {/* Viral Share */}
                        {(status === 'WIN' || status === 'LOSE') && (
                            <button
                                className="btn shake"
                                onClick={() => {
                                    const text = `🧠 Reto: ${currentChallenge.question}\n👉 Juega en Adiviname`;
                                    navigator.clipboard.writeText(text);
                                    alert('¡Copiado!');
                                }}
                                style={{ marginTop: '0.5rem', background: '#3742FA', boxShadow: '0 6px 0 #2F35DF', fontSize: '1rem', padding: '0.6rem' }}
                            >
                                📲 COMPARTIR
                            </button>
                        )}

                        {status === 'WIN' && (
                            <div style={{ position: 'absolute', top: '35%', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', zIndex: 100 }}>
                                <span style={{ fontSize: '5rem', animation: 'pop 0.5s', display: 'block' }}>🎉</span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}
