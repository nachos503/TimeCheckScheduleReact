// src/components/Modals/TimerModal.jsx
import React, { useState } from 'react';

const TimerModal = ({ isOpen, onClose, onStart }) => {
    const [time, setTime] = useState('00:00');

    const handleStart = () => {
        onStart(time);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal timer">
            <label htmlFor="timer">Введите время таймера</label>
            <input
                type="time"
                name="timer"
                id="timer"
                value={time}
                onChange={(e) => setTime(e.target.value)}
            />
            <button onClick={handleStart}>Старт</button>
        </div>
    );
};

export default TimerModal;
