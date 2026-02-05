import { useState, useEffect, useRef } from 'react'
import { riddles } from './data'
import SoloGame from './components/SoloGame'

import avatarMan from './assets/ghibli/avatar_man_1770314228842.png';
import avatarWoman from './assets/ghibli/avatar_woman_1770314242810.png';
import avatarBoy from './assets/ghibli/avatar_boy_1770314264310.png';
import avatarGirl from './assets/ghibli/avatar_girl_1770314277182.png';

function App() {
  const [lang, setLang] = useState('es');
  const [view, setView] = useState('HOME'); // HOME, SOLO, GROUP
  const [dailyCount, setDailyCount] = useState(0);
  const [isPro, setIsPro] = useState(true); // Default to PRO unlocked
  const [showProModal, setShowProModal] = useState(false);
  const [avatarType, setAvatarType] = useState('man');

  // Freemium Logic
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
    if (dailyCount >= 2000) { // Limit increased to 2000
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
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed (user interaction needed)", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio ref={audioRef} loop src="/puzzle_fun_extra_paused.wav" />

      <div className="shapes-container">
        {/* Background characters cleared */}
      </div>

      <div className="container">
        {/* Header / Stats */}
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem' }}>
          <div className="header-title" style={{ fontWeight: '900', letterSpacing: '1px', fontFamily: 'Bangers, cursive', fontSize: '1.5rem', color: 'black' }}>ADIVINAME</div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={toggleMusic} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
              {isPlaying ? '🔊' : '🔇'}
            </button>

            <div
              onClick={() => setIsPro(!isPro)}
              style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', fontFamily: 'Comic Neue', color: isPro ? '#ff0055' : 'black', display: 'flex', alignItems: 'center' }}
            >
              {isPro ? '👑 PRO' : `⚡ FREE: ${dailyCount}/2000`}
            </div>
          </div>
        </header>

        {view === 'HOME' && (
          <div className="card">
            <h1>Adiviname</h1>
            <p style={{ marginBottom: '2rem', fontSize: '1.2rem', fontWeight: '600' }}>
              🥑 El reto de palabras 🧠
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
            <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '4px', border: '2px solid black', marginBottom: '2rem' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: 'Bangers', letterSpacing: '1px' }}>ELIGE TU PERSONAJE:</p>
              <div className="avatar-selection-grid" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'man', icon: avatarMan },
                  { id: 'woman', icon: avatarWoman },
                  { id: 'boy', icon: avatarBoy },
                  { id: 'girl', icon: avatarGirl }
                ].map(av => (
                  <button
                    key={av.id}
                    className="avatar-btn"
                    onClick={() => setAvatarType(av.id)}
                    style={{
                      padding: 0,
                      background: 'none',
                      border: avatarType === av.id ? '4px solid #ffe600' : '2px solid transparent',
                      borderRadius: '50%',
                      width: '70px',
                      height: '70px',
                      cursor: 'pointer',
                      transform: avatarType === av.id ? 'scale(1.15)' : 'scale(1)',
                      boxShadow: avatarType === av.id ? '0 4px 8px rgba(0,0,0,0.2)' : 'none',
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
              🚀 JUGAR SOLO
            </button>

            <button className="btn btn-secondary" onClick={() => startGame('GROUP')} style={{ marginTop: '1rem' }}>
              👥 MODO GRUPO
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
            <h2>Modo Grupo</h2>
            <p style={{ margin: '1rem 0' }}>¡Únete con amigos!</p>
            <div style={{ padding: '2rem', background: '#f1f2f6', border: '3px dashed var(--border-color)', margin: '2rem 0', borderRadius: 'var(--radius)', fontSize: '2rem', fontWeight: '900', letterSpacing: '5px' }}>
              X7R2
            </div>
            <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Esperando jugadores...</p>
            <button className="btn btn-secondary" onClick={() => setView('HOME')} style={{ marginTop: '1rem' }}>
              VOLVER
            </button>
          </div>
        )}

        {showProModal && (
          <div className="modal-overlay">
            <div className="card" style={{ maxWidth: '400px', animation: 'shake 0.5s' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚫</div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>¡OH NO!</h2>
              <p style={{ margin: '1rem 0', fontSize: '1.2rem' }}>Se acabaron las partidas gratis.</p>

              <div style={{ background: '#feca57', border: '3px solid black', padding: '1rem', borderRadius: '15px', color: 'black', fontWeight: 'bold', marginBottom: '1.5rem', transform: 'rotate(-2deg)', boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
                💎 HAZTE PRO
                <div style={{ fontSize: '0.9rem', fontWeight: 'normal', marginTop: '0.2rem' }}>Juega SIN LÍMITES por 1.99€</div>
              </div>

              <button className="btn" onClick={() => { setIsPro(true); setShowProModal(false); }}>
                DESBLOQUEAR AHORA
              </button>
              <button className="btn btn-secondary" onClick={() => setShowProModal(false)} style={{ marginTop: '1rem' }}>
                Volver mañana
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
