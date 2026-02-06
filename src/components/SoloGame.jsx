import { useState, useEffect, useRef } from 'react'
import { getChallenge } from '../data'
import Avatar from './Avatar'
import { getTranslation } from '../translations'

// Backgrounds
import bgForest from '../assets/ghibli/bg_forest_1770314298231.png';
import bgSky from '../assets/ghibli/bg_sky_1770314324055.png';
import bgVillage from '../assets/ghibli/bg_village_1770314337439.png';
import bgMeadow from '../assets/ghibli/bg_meadow_1770314359744.png';

const backgrounds = [bgForest, bgSky, bgVillage, bgMeadow];

export default function SoloGame({ lang, avatarType, onExit, incrementCount, checkLimit }) {

    const t = getTranslation(lang);
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [bgIndex, setBgIndex] = useState(0);

    // NO REPEAT LOGIC
    const seenIds = useRef(new Set());

    // Game State
    const [input, setInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);
    const [status, setStatus] = useState('PLAYING');
    const [shake, setShake] = useState(false);
    const [combo, setCombo] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const timerRef = useRef(null);

    useEffect(() => {
        loadQuestion();
    }, []);

    const loadQuestion = () => {
        if (!checkLimit()) {
            onExit();
            return;
        }

        let nextChallenge;
        let attempts = 0;

        do {
            nextChallenge = getChallenge(lang);
            attempts++;
        } while (seenIds.current.has(nextChallenge.id) && attempts < 20);

        seenIds.current.add(nextChallenge.id);

        setCurrentChallenge(nextChallenge);
        setBgIndex(prev => (prev + 1) % backgrounds.length);

        setInput('');
        setStatus('PLAYING');
        setTimeLeft(nextChallenge.time_limit || 30);
        setShake(false);
        setIsTransitioning(false);
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
    };

    const handleWin = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);

        setStatus('WIN');
        setCombo(c => c + 1);
        clearInterval(timerRef.current);
        incrementCount();
        if (navigator.vibrate) navigator.vibrate(50);

        setTimeout(() => {
            loadQuestion();
        }, 1200); // Slightly longer to appreciate the animation
    };

    const handleRestart = () => {
        seenIds.current.clear();
        setCombo(0);
        loadQuestion();
    };

    // --- LOGIC ---

    const checkTextAnswer = () => {
        if (!input) return;

        const clean = (str) => str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const info = currentChallenge.answer.toString();

        if (clean(input) === clean(info)) {
            handleWin();
        } else {
            setShake(true);
            if (navigator.vibrate) navigator.vibrate(200);
            setTimeout(() => setShake(false), 500);
            setTimeLeft(t => Math.max(0, t - 5));
        }
    };

    // For text input, we still check on Enter key for convenience
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') checkTextAnswer();
    };

    const checkOption = (opt) => {
        if (status !== 'PLAYING' || isTransitioning) return;

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
    const progressPct = (timeLeft / 30) * 100;

    return (
        <>
            <div
                style={{
                    position: 'fixed', top: -20, left: -20, right: -20, bottom: -20,
                    backgroundImage: `url(${currentBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: -1,
                    transition: 'background-image 0.5s ease-out',
                    animation: 'bgPan 20s infinite ease-in-out alternate'
                }}
            />

            <div className={`card ${status === 'WIN' ? 'pop-in' : ''} ${shake ? 'shake' : ''}`} style={{ padding: '1.2rem 1rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="icon-btn" onClick={onExit} style={{ background: '#FF4757', color: 'white', border: 'none', width: '35px', height: '35px', fontSize: '1.2rem' }}>✕</button>
                        <button className="icon-btn" onClick={handleRestart} style={{ background: '#ffa502', color: 'white', border: 'none', width: '35px', height: '35px', fontSize: '1.2rem' }}>↻</button>
                    </div>

                    {combo > 1 && (
                        <div style={{ background: '#2ed573', padding: '0.2rem 0.6rem', borderRadius: '15px', color: 'white', fontWeight: 'bold', fontSize: '0.9rem', transform: 'rotate(-5deg)' }}>
                            🔥 {combo}
                        </div>
                    )}

                    <div style={{ fontWeight: '900', fontSize: '1.2rem', fontFamily: 'monospace', color: timeLeft < 5 ? '#ff4757' : '#2f3542' }}>
                        {Math.ceil(timeLeft)}s
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar" style={{ height: '8px', marginBottom: '1rem' }}>
                    <div className="progress-fill" style={{ width: `${progressPct}%`, background: timeLeft < 5 ? '#ff4757' : '#2ed573' }} />
                </div>

                {status === 'PAUSED' ? (
                    <div style={{ padding: '2rem 0' }}>
                        <h1>{t.paused}</h1>
                        <button className="btn" onClick={togglePause}>{t.resume}</button>
                    </div>
                ) : (
                    <>
                        <Avatar state={status} type={avatarType} />

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', background: '#dfe4ea', padding: '2px 8px', borderRadius: '10px', color: '#747d8c', fontWeight: 'bold' }}>
                                {t[currentChallenge.type] || currentChallenge.type}
                            </span>
                        </div>

                        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', minHeight: '60px', color: '#2f3542', lineHeight: '1.2', textAlign: 'center' }}>
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
                                        <button className="btn" onClick={loadQuestion} style={{ marginTop: '1rem' }}>Siguiente</button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <input
                                            autoFocus
                                            className="input"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="..."
                                            disabled={status !== 'PLAYING'}
                                            autoComplete="off"
                                            style={{ fontSize: '1.2rem' }}
                                        />
                                        <button
                                            className="btn"
                                            onClick={checkTextAnswer}
                                            style={{ background: '#2ed573', boxShadow: '0 6px 0 #26af61' }}
                                        >
                                            {t.check}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Share */}
                        {(status === 'WIN' || status === 'LOSE') && (
                            <button
                                className="btn shake"
                                onClick={() => {
                                    const text = status === 'WIN' ? t.share_text_win : t.share_text_lose;
                                    navigator.clipboard.writeText(text);
                                    alert(t.copy_success);
                                }}
                                style={{ marginTop: '0.5rem', background: '#3742FA', boxShadow: '0 6px 0 #2F35DF', fontSize: '1rem', padding: '0.6rem' }}
                            >
                                {t.share}
                            </button>
                        )}
                    </>
                )}
            </div>
        </>
    )
}
