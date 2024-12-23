// src/components/Analytics/ProjectAnalytics.jsx
import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const ProjectAnalytics = ({ onBack }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    // Получение списка проектов с бэкенда
    const fetchProjects = async () => {
      try {
        const response = await API.get('/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Ошибка при получении проектов:', error);
        alert('Не удалось загрузить проекты.');
      }
    };

    fetchProjects();
  }, []); 

  const handleGenerateReport = () => {
    // Логика генерации отчёта по проекту
    alert(`Отчёт по проекту: ${selectedProject}`);
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
          <option key={project.id} value={project.name}>
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
    </div>
  );
};

export default ProjectAnalytics;
