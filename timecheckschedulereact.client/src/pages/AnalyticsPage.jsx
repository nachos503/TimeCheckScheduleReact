// src/pages/AnalyticsPage.jsx
import React, { useState } from 'react';
import AnalyticsModal from '../components/modals/AnalyticsModal';

const AnalyticsPage = () => {
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(true); // Автоматически открывается

  return (
    <div>
      {isAnalyticsModalOpen && (
        <AnalyticsModal
          isOpen={isAnalyticsModalOpen}
          onClose={() => setIsAnalyticsModalOpen(false)}
        />
      )}
      {/* Добавьте отображение отчётов здесь */}
    </div>
  );
};

export default AnalyticsPage;
 