import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RoleProtectedRoute from '../components/common/RoleProtectedRoute';
import Dashboard from '../pages/admin/AdminDashboard';
import Students from '../pages/shared/Students';
import CreateStudent from '../pages/shared/CreateStudent';
import EditStudent from '../pages/shared/EditStudent';
import Teachers from '../pages/admin/Teachers';
import CreateTeacher from '../pages/admin/CreateTeacher';
import TeacherActions from '../pages/admin/TeacherActions';
import EditTeacher from '../pages/admin/EditTeacher';
import Classes from '../pages/shared/Classes';
import CreateClass from '../pages/shared/CreateClass';
import ClassDetails from '../pages/shared/ClassDetails';
import EditClass from '../pages/shared/EditClass';
import Checkin from '../pages/student/Checkin';
import Financial from '../pages/admin/Financial';
import Reports from '../pages/admin/Reports';
import Profile from '../pages/common/Profile';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Dashboard - accessible to all authenticated users */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Student Routes - Admin and Receptionist only */}
      <Route 
        path="/students" 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'receptionist', 'teacher']}>
            <Students />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path="/students/create" 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'receptionist']}>
            <CreateStudent />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path="/students/edit/:id" 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'receptionist']}>
            <EditStudent />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Teacher Routes - Admin only */}
      <Route 
        path="/teachers" 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <Teachers />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path="/teachers/create" 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <CreateTeacher />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path="/teachers/:id" 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <TeacherActions />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path="/teachers/:id/edit" 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <EditTeacher />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Classes Routes - Admin and Teacher */}
      <Route 
        path="/classes" 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
            <Classes />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path="/classes/create" 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <CreateClass />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path="/classes/:id" 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
            <ClassDetails />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path="/classes/:id/edit" 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <EditClass />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path="/my-classes" 
        element={
          <RoleProtectedRoute allowedRoles={['teacher', 'student']}>
            <Classes />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Check-in Routes - Admin, Teacher, and Receptionist */}
      <Route 
        path="/checkin" 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher', 'receptionist']}>
            <Checkin />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path="/my-checkins" 
        element={
          <RoleProtectedRoute allowedRoles={['student']}>
            <Checkin />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Financial Routes - Admin only */}
      <Route 
        path="/financial" 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <Financial />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path="/my-payments" 
        element={
          <RoleProtectedRoute allowedRoles={['student']}>
            <Financial />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Reports Routes - Admin only */}
      <Route 
        path="/reports" 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <Reports />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Profile Route - All authenticated users */}
      <Route 
        path="/profile" 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher', 'receptionist', 'student']}>
            <Profile />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes; 