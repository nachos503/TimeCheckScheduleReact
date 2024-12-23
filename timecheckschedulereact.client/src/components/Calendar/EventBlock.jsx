// src/components/Calendar/EventBlock.jsx
import React from 'react';

const EventBlock = ({ event, onClick }) => {
    const { title, startTime, endTime } = event;

    return (
        <div
            className="event-block"
            onClick={() => onClick(event)}
            style={{
                top: calculateTop(startTime),
                height: calculateHeight(startTime, endTime),
                position: 'absolute',
                width: '100%',
                backgroundColor: '#99f',
                borderRadius: '4px',
                color: '#fff',
                padding: '5px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
        >
            <div className="event-title">{title}</div>
            <div className="event-time">{formatTimeRange(startTime, endTime)}</div>
        </div>
    );
};

// Вспомогательные функции для расчёта положения и высоты задачи
function calculateTop(startTime) {
    const date = new Date(startTime);
    const totalMinutes = (date.getHours() - 8) * 60 + date.getMinutes(); // Считаем минуты с 8:00
    return (totalMinutes / 15) * 35; // 35px за 15 минут
}

function calculateHeight(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMinutes = (end - start) / 60000;
    return (diffMinutes / 15) * 35; // 35px за 15 минут
}


function formatTimeRange(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${start.getHours()}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours()}:${end.getMinutes().toString().padStart(2, '0')}`;
}

export default EventBlock;
