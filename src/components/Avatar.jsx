import React from 'react';

import wizardMale from '../assets/ghibli/pixar_wizard_male_1770352949377.png';
import wizardFemale from '../assets/ghibli/pixar_wizard_female_1770353002544.png';
import scholarBoy from '../assets/ghibli/pixar_scholar_boy_1770352976814.png';
import scholarGirl from '../assets/ghibli/pixar_scholar_girl_1770353015970.png';

export default function Avatar({ state, type = 'man' }) {
    // state: 'PLAYING', 'WIN', 'LOSE', 'PAUSED'
    // type: 'man', 'woman', 'boy', 'girl' (Maps to Wizards/Scholars)

    const getAvatarSrc = () => {
        switch (type) {
            case 'woman': return wizardFemale;
            case 'boy': return scholarBoy;
            case 'girl': return scholarGirl;
            default: return wizardMale;
        }
    };

    const getAnimationClass = () => {
        switch (state) {
            case 'WIN': return 'avatar-win';
            case 'LOSE': return 'avatar-lose';
            case 'PAUSED': return 'avatar-paused';
            default: return 'avatar-playing';
        }
    };

    return (
        <div className={`avatar-container ${getAnimationClass()}`} style={{ width: '180px', height: '180px', margin: '0 auto 1.5rem', position: 'relative' }}>
            <img
                src={getAvatarSrc()}
                alt="Avatar"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: '50%',
                    border: '4px solid white',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    background: 'white'
                }}
            />
            {state === 'WIN' && <div style={{ position: 'absolute', top: -10, right: -10, fontSize: '3rem', animation: 'bounce 0.5s infinite alternate' }}>✨</div>}
            {state === 'LOSE' && <div style={{ position: 'absolute', top: -10, right: -10, fontSize: '3rem' }}>💧</div>}
        </div>
    );
}
