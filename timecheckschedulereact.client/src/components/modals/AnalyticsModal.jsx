// src/components/Analytics/AnalyticsModal.jsx
import React, { useState } from 'react';
import DateAnalytics from '../Analytics/DateAnalytics';
import ProjectAnalytics from '../Analytics/ProjectAnalytics';

const AnalyticsModal = ({ isOpen, onClose }) => {
    const [reportType, setReportType] = useState(null);

    if (!isOpen) return null;

    const renderContent = () => {
        if (reportType === 'dates') {
            return <DateAnalytics onBack={() => setReportType(null)} />;
        }
        if (reportType === 'projects') {
            return <ProjectAnalytics onBack={() => setReportType(null)} />;
        }
        return (
            <div className="modal"> 
                <h3>Аналитика</h3>
                <div>Выберите тип отчёта</div>
                <div className="row-buttons">
                    <button onClick={() => setReportType('dates')}>По датам</button>
                    <button onClick={() => setReportType('projects')}>По проектам</button>
                </div>
                <button className="cancel" onClick={onClose}>
                    Выход
                </button>
            </div>
        );
    };

    return renderContent();
};

export default AnalyticsModal;
