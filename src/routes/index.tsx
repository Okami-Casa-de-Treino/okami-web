import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import CreateStudent from '../pages/CreateStudent';
import Teachers from '../pages/Teachers';
import Classes from '../pages/Classes';
import Checkin from '../pages/Checkin';
import Financial from '../pages/Financial';
import Reports from '../pages/Reports';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Student Routes */}
      <Route path="/students" element={<Students />} />
      <Route path="/students/create" element={<CreateStudent />} />
      
      {/* Other Routes */}
      <Route path="/teachers" element={<Teachers />} />
      <Route path="/classes" element={<Classes />} />
      <Route path="/checkin" element={<Checkin />} />
      <Route path="/financial" element={<Financial />} />
      <Route path="/reports" element={<Reports />} />
      
      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes; 