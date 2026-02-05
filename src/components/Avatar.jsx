import React from 'react';

import avatarMan from '../assets/ghibli/avatar_man_1770314228842.png';
import avatarWoman from '../assets/ghibli/avatar_woman_1770314242810.png';
import avatarBoy from '../assets/ghibli/avatar_boy_1770314264310.png';
import avatarGirl from '../assets/ghibli/avatar_girl_1770314277182.png';

export default function Avatar({ state, type = 'man' }) {
    // state: 'PLAYING', 'WIN', 'LOSE', 'PAUSED'
    // type: 'man', 'woman', 'boy', 'girl'

    const getAvatarSrc = () => {
        switch (type) {
            case 'woman': return avatarWoman;
            case 'boy': return avatarBoy;
            case 'girl': return avatarGirl;
            default: return avatarMan;
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
