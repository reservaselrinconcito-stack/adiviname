import React, { useState, useEffect } from 'react';

// NEUTRAL (IDLE is now HAPPY/ENERGETIC)
import wizardMale from '../assets/ghibli/pixar_wizard_male_happy_idle_1770380276670.png';
import wizardFemale from '../assets/ghibli/pixar_wizard_female_happy_idle_1770380292752.png';
import scholarBoy from '../assets/ghibli/pixar_scholar_boy_happy_idle_retry_1770380331389.png';
import scholarGirl from '../assets/ghibli/pixar_scholar_girl_happy_idle_1770380306559.png';

// WIN (HAPPY)
import wizardMaleWin from '../assets/ghibli/pixar_wizard_male_win_1770354642306.png';
import wizardFemaleWin from '../assets/ghibli/pixar_wizard_female_win_1770354669432.png';
import scholarBoyWin from '../assets/ghibli/pixar_scholar_boy_win_1770354697457.png';
import scholarGirlWin from '../assets/ghibli/pixar_scholar_girl_win_1770354727024.png';

// LOSE (SAD)
import wizardMaleLose from '../assets/ghibli/pixar_wizard_male_lose_1770354655595.png';
import wizardFemaleLose from '../assets/ghibli/pixar_wizard_female_lose_1770354682656.png';
import scholarBoyLose from '../assets/ghibli/pixar_scholar_boy_lose_1770354712160.png';
import scholarGirlLose from '../assets/ghibli/pixar_scholar_girl_lose_1770354741732.png';

const avatars = {
    man: { idle: wizardMale, win: wizardMaleWin, lose: wizardMaleLose },
    woman: { idle: wizardFemale, win: wizardFemaleWin, lose: wizardFemaleLose },
    boy: { idle: scholarBoy, win: scholarBoyWin, lose: scholarBoyLose },
    girl: { idle: scholarGirl, win: scholarGirlWin, lose: scholarGirlLose }
};

export default function Avatar({ state, type = 'man' }) {
    // state: 'PLAYING', 'WIN', 'LOSE', 'PAUSED'
    const [idleAnim, setIdleAnim] = useState('avatar-bounce');

    // Randomize idle animation on mount or infrequently to keep it fresh
    useEffect(() => {
        if (state === 'PLAYING') {
            const variant = Math.random() > 0.5 ? 'avatar-bounce' : 'avatar-sway';
            setIdleAnim(variant);
        }
    }, [state]);

    const getAvatarSrc = () => {
        const charSet = avatars[type] || avatars['man'];

        switch (state) {
            case 'WIN': return charSet.win;
            case 'LOSE': return charSet.lose;
            default: return charSet.idle;
        }
    };

    const getAnimationClass = () => {
        switch (state) {
            case 'WIN': return 'avatar-win';
            case 'LOSE': return 'avatar-lose';
            case 'PAUSED': return 'avatar-paused';
            default: return idleAnim;
        }
    };

    return (
        <div className={`avatar-container ${getAnimationClass()}`} style={{ width: '220px', height: '220px', margin: '0 auto 1rem', position: 'relative' }}>
            <img
                src={getAvatarSrc()}
                alt="Avatar"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.3))', // Stronger shadow for 3D depth
                    transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            />
            {state === 'WIN' && (
                <div style={{ position: 'absolute', inset: -50, pointerEvents: 'none', background: 'radial-gradient(circle, rgba(255,255,0,0.4) 0%, transparent 70%)', animation: 'pulse 1s infinite', zIndex: -1 }} />
            )}
        </div>
    );
}
