// src/components/UI/Timer.jsx
import React, { useState, useEffect } from 'react';

const Timer = ({ initialTime, onStop }) => {
    const [time, setTime] = useState(initialTime); // В формате "HH:MM"
    const [isRunning, setIsRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval = null;
        if (isRunning) {
            interval = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        } else if (!isRunning && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning, seconds]);

    const startTimer = () => {
        setIsRunning(true);
    };

    const stopTimer = () => {
        setIsRunning(false);
        onStop(seconds);
        setSeconds(0); 
    };

    const formatTime = (secs) => {
        const hrs = Math.floor(secs / 3600)
            .toString()
            .padStart(2, '0');
        const mins = Math.floor((secs % 3600) / 60)
            .toString()
            .padStart(2, '0');
        const sec = (secs % 60).toString().padStart(2, '0');
        return `${hrs}:${mins}:${sec}`;
    };

    return (
        <div>
            <h3>Таймер</h3>
            <div>{formatTime(seconds)}</div>
            {!isRunning ? (
                <button onClick={startTimer}>Старт</button>
            ) : (
                <button onClick={stopTimer}>Стоп</button>
            )}
        </div>
    );
};

export default Timer;
