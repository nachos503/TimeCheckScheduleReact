import React, { useState, useEffect } from 'react';

const Timer = ({ initialTime, onStop }) => {
    const [timeLeft, setTimeLeft] = useState(parseTimeToSeconds(initialTime)); // Переводим HH:MM в секунды
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        let interval;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            alert('Время на задачу окончено. Сделайте перерыв.');
            onStop(); // Остановка таймера при завершении
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft, onStop]);

    const stopTimer = () => {
        setIsRunning(false);
        onStop();
    };

    const formatTime = (secs) => {
        const mins = Math.floor(secs / 60).toString().padStart(2, '0');
        const sec = (secs % 60).toString().padStart(2, '0');
        return `${mins}:${sec}`;
    };

    const parseTimeToSeconds = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60;
    };

    return (
        <div style={{ background: '#fff', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', width: '200px' }}>
            <h3>Таймер</h3>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>{formatTime(timeLeft)}</div>
            <button onClick={stopTimer} style={{ background: '#f44336', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '4px' }}>
                Стоп
            </button>
        </div>
    );
};

export default Timer;
