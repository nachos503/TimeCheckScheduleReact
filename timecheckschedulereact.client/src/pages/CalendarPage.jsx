// src/pages/CalendarPage.jsx
import React from 'react';
import Calendar from '../components/Calendar/Calendar';

const CalendarPage = () => {
    const currentWeek = getCurrentWeek(); // Реализуйте функцию получения текущей недели

    return (
        <div className="cal-body">
            <div className="cal-header">
                {/* Реализуйте аналогичную логику, как в Home.jsx */}
            </div>
            <Calendar currentWeek={currentWeek} />
        </div>
    );
};

// Вспомогательные функции аналогичны Home.jsx
function getCurrentWeek() {
    const now = new Date();
    const first = now.getDate() - now.getDay() + 1; // Понедельник
    const week = [];
    for (let i = 0; i < 7; i++) {
        week.push(new Date(now.setDate(first + i)));
    }
    return week;
}

export default CalendarPage;
 