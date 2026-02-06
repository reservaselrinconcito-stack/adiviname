import { useState, useEffect, useRef } from 'react'
import SoloGame from './components/SoloGame'
import { getTranslation } from './translations'

import wizardMale from './assets/ghibli/pixar_wizard_male_1770352949377.png';
import wizardFemale from './assets/ghibli/pixar_wizard_female_1770353002544.png';
import scholarBoy from './assets/ghibli/pixar_scholar_boy_1770352976814.png';
import scholarGirl from './assets/ghibli/pixar_scholar_girl_1770353015970.png';

function App() {
  const [lang, setLang] = useState('es');
  // Get translation strings based on current state
  const t = getTranslation(lang);

  const [view, setView] = useState('HOME');
  const [dailyCount, setDailyCount] = useState(0);
  const [isPro, setIsPro] = useState(true);
  const [showProModal, setShowProModal] = useState(false);
  const [avatarType, setAvatarType] = useState('man');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('adiviname_date');
    const storedCount = parseInt(localStorage.getItem('adiviname_count') || '0');

    if (storedDate !== today) {
      localStorage.setItem('adiviname_date', today);
      localStorage.setItem('adiviname_count', '0');
      setDailyCount(0);
    } else {
      setDailyCount(storedCount);
    }
  }, []);

  const incrementCount = () => {
    if (isPro) return;
    const newCount = dailyCount + 1;
    setDailyCount(newCount);
    localStorage.setItem('adiviname_count', newCount.toString());
  };

  const checkLimit = () => {
    if (isPro) return true;
    if (dailyCount >= 2000) {
      setShowProModal(true);
      return false;
    }
    return true;
  };

  const startGame = (mode) => {
    if (checkLimit()) {
      setView(mode);
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio ref={audioRef} loop src="/puzzle_fun_extra_paused.wav" />

      {/* Global Background (Simulated Pixar Sky) */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Soft pastel gradient
        zIndex: -2
      }} />

      <div className="container" style={{ paddingTop: '0' }}> {/* Cleaned padding */}

        {/* Header */}
        <header style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '500px' }}>
          <div className="header-title" style={{ fontWeight: '900', letterSpacing: '1px', fontFamily: 'Bangers, cursive', fontSize: '1.8rem', color: '#ff4757' }}>
            {t.title}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={toggleMusic} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
              {isPlaying ? '🔊' : '🔇'}
            </button>

            <div
              onClick={() => setIsPro(!isPro)}
              style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', fontFamily: 'Comic Neue', color: isPro ? '#ff0055' : 'black', display: 'flex', alignItems: 'center' }}
            >
              {isPro ? t.pro_btn : `${t.free_limit} ${dailyCount}/2000`}
            </div>
          </div>
        </header>

        {view === 'HOME' && (
          <div className="card">
            <h1>{t.title}</h1>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '600' }}>
              {t.subtitle}
            </p>

            <div className="language-selector">
              {['es', 'cat', 'gal', 'eus', 'aran'].map(l => (
                <button
                  key={l}
                  className={`lang-btn ${lang === l ? 'active' : ''}`}
                  onClick={() => setLang(l)}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Avatar Selection */}
            <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '15px', border: '2px dashed #ccc', marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: 'Bangers', letterSpacing: '1px' }}>{t.choose_char}</p>
              <div className="avatar-selection-grid" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'man', icon: wizardMale },
                  { id: 'woman', icon: wizardFemale },
                  { id: 'boy', icon: scholarBoy },
                  { id: 'girl', icon: scholarGirl }
                ].map(av => (
                  <button
                    key={av.id}
                    className="avatar-btn"
                    onClick={() => setAvatarType(av.id)}
                    style={{
                      padding: 0,
                      background: 'none',
                      border: avatarType === av.id ? '4px solid #ff4757' : '2px solid transparent',
                      borderRadius: '50%',
                      width: '70px',
                      height: '70px',
                      cursor: 'pointer',
                      transform: avatarType === av.id ? 'scale(1.15)' : 'scale(1)',
                      boxShadow: avatarType === av.id ? '0 8px 16px rgba(0,0,0,0.2)' : 'none',
                      transition: 'all 0.2s',
                      overflow: 'hidden'
                    }}
                  >
                    <img src={av.icon} alt={av.id} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>

            <button className="btn" onClick={() => startGame('SOLO')}>
              {t.play_solo}
            </button>

            <button className="btn btn-secondary" onClick={() => startGame('GROUP')} style={{ marginTop: '0.8rem' }}>
              {t.play_group}
            </button>
          </div>
        )}

        {view === 'SOLO' && (
          <SoloGame
            lang={lang}
            avatarType={avatarType}
            onExit={() => setView('HOME')}
            incrementCount={incrementCount}
            checkLimit={checkLimit}
          />
        )}

        {view === 'GROUP' && (
          <div className="card">
            <h2>{t.group_mode}</h2>
            <p style={{ margin: '1rem 0' }}>{t.join_friends}</p>
            <div style={{ padding: '2rem', background: '#f1f2f6', border: '3px dashed var(--border-color)', margin: '2rem 0', borderRadius: 'var(--radius)', fontSize: '2rem', fontWeight: '900', letterSpacing: '5px' }}>
              X7R2
            </div>
            <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{t.waiting}</p>
            <button className="btn btn-secondary" onClick={() => setView('HOME')} style={{ marginTop: '1rem' }}>
              {t.back}
            </button>
          </div>
        )}

        {showProModal && (
          <div className="modal-overlay">
            <div className="card" style={{ maxWidth: '400px', animation: 'shake 0.5s' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚫</div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t.modal_limit_title}</h2>
              <p style={{ margin: '1rem 0', fontSize: '1.2rem' }}>{t.modal_limit_msg}</p>

              <div style={{ background: '#feca57', border: '3px solid black', padding: '1rem', borderRadius: '15px', color: 'black', fontWeight: 'bold', marginBottom: '1.5rem', transform: 'rotate(-2deg)', boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
                💎 PRO
                <div style={{ fontSize: '0.9rem', fontWeight: 'normal', marginTop: '0.2rem' }}>1.99€</div>
              </div>

              <button className="btn" onClick={() => { setIsPro(true); setShowProModal(false); }}>
                {t.modal_unlock}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowProModal(false)} style={{ marginTop: '1rem' }}>
                {t.modal_later}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
