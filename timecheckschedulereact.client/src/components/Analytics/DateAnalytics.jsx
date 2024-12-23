// src/components/Analytics/DateAnalytics.jsx
import React, { useState } from 'react';
import API from '../../services/api';

const DateAnalytics = ({ onBack }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [report, setReport] = useState(null);

    const handleGenerateReport = async () => {
        try {
            const response = await API.get('/analytics/date', {
                params: { startDate, endDate },
            });
            setReport(response.data);
        } catch (error) {
            console.error('Ошибка при генерации отчёта:', error);
            alert('Не удалось сгенерировать отчёт.');
        }
    }; 

    return (
        <div className="modal date-anal">
            <h3>Аналитика по датам</h3>
            <label htmlFor="date-anal-start">Выберите дату начала отчета</label>
            <input
                type="date"
                name="date-anal-start"
                id="date-anal-start"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <label htmlFor="date-anal-end">Выберите дату конца отчета</label>
            <input
                type="date"
                name="date-anal-end"
                id="date-anal-end"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
            <div className="row-buttons">
                <button onClick={handleGenerateReport}>Сформировать отчёт</button>
                <button className="cancel" onClick={onBack}>
                    Назад
                </button>
            </div>
            {report && (
                <div className="anal-table">
                    <h3>Отчёт по задачам</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Задача</th>
                                <th>Дата</th>
                                <th>Время выполнения</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.tasks.map((task) => (
                                <tr key={task.id}>
                                    <td>{task.title}</td>
                                    <td>{new Date(task.date).toLocaleDateString()}</td>
                                    <td>{task.hours} ч.</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="row-buttons">
                        <button>Сохранить</button>
                        <button className="cancel" onClick={onBack}>
                            Выход
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateAnalytics;
