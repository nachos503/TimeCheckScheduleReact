import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const ProjectAnalytics = ({ onBack }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [report, setReport] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await API.get('/projects');
                if (response.data && response.data.length > 0) {
                    setProjects(response.data);
                } else {
                    alert('Нет доступных проектов для анализа.');
                }
            } catch (error) {
                console.error('Ошибка при получении проектов:', error);
                alert('Не удалось загрузить проекты.');
            }
        };

        fetchProjects();
    }, []);

    const handleGenerateReport = async () => {
        if (!selectedProject) {
            alert('Выберите проект для формирования отчёта.');
            return;
        }

        try {
            const response = await API.get('/analytics/project', {
                params: { projectId: selectedProject },
            });
            if (response.data) {
                setReport(response.data);
            } else {
                alert('Отчёт не найден.');
            }
        } catch (error) {
            console.error('Ошибка при генерации отчёта:', error);
            alert('Не удалось сгенерировать отчёт.');
        }
    };

    return (
        <div className="modal project-anal">
            <h3>Аналитика по проекту</h3>
            <label htmlFor="project-dropdown">Выберите проект</label>
            <select
                name="project-dropdown"
                id="project-dropdown"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
            >
                <option value="">--Выберите проект--</option>
                {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                        {project.name}
                    </option>
                ))}
            </select>
            <div className="row-buttons">
                <button onClick={handleGenerateReport}>Сформировать отчёт</button>
                <button className="cancel" onClick={onBack}>
                    Назад
                </button>
            </div>
            {report && (
                <div className="anal-table">
                    <h3>Отчёт по проекту: {report.projectName}</h3>
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
                                    <td>{task.hours.toFixed(2)} ч.</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="row-buttons">
                        <button onClick={() => alert('Сохранение отчёта!')}>Сохранить</button>
                        <button className="cancel" onClick={onBack}>
                            Выход
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectAnalytics;
