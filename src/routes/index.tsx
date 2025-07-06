import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RoleProtectedRoute from '../components/common/RoleProtectedRoute';
import Dashboard from '../pages/admin/AdminDashboard';
import Students from '../pages/shared/Students';
import CreateStudent from '../pages/shared/CreateStudent';
import EditStudent from '../pages/shared/EditStudent';
import StudentDetails from '../pages/shared/StudentDetails';
import Teachers from '../pages/admin/Teachers';
import CreateTeacher from '../pages/admin/CreateTeacher';
import TeacherActions from '../pages/admin/TeacherActions';
import EditTeacher from '../pages/admin/EditTeacher';
import Classes from '../pages/shared/Classes';
import CreateClass from '../pages/shared/CreateClass';
import ClassDetails from '../pages/shared/ClassDetails';
import EditClass from '../pages/shared/EditClass';
import Checkin from '../pages/student/Checkin';
import BeltProgression from '../pages/shared/BeltProgression';
import { VideoContent } from '../pages/shared/VideoContent';
import Financial from '../pages/admin/Financial';
import Reports from '../pages/admin/Reports';
import Profile from '../pages/common/Profile';
import { AppRoutes as RoutesConstants } from './routes.constants';


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={RoutesConstants.DASHBOARD} replace />} />
      
      {/* Dashboard - accessible to all authenticated users */}
      <Route path={RoutesConstants.DASHBOARD} element={<Dashboard />} />
      
      {/* Student Routes - Admin and Receptionist only */}
      <Route 
        path={RoutesConstants.STUDENTS} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'receptionist', 'teacher']}>
            <Students />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path={RoutesConstants.STUDENTS_CREATE} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'receptionist']}>
            <CreateStudent />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path={RoutesConstants.STUDENTS_EDIT + '/:id'} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'receptionist']}>
            <EditStudent />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path={RoutesConstants.STUDENTS + '/:id'} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'receptionist', 'teacher']}>
            <StudentDetails />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Teacher Routes - Admin only */}
      <Route 
        path={RoutesConstants.TEACHERS} 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <Teachers />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path={RoutesConstants.TEACHERS_CREATE} 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <CreateTeacher />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path={RoutesConstants.TEACHERS + '/:id'} 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <TeacherActions />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path={RoutesConstants.TEACHERS_EDIT + '/:id'} 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <EditTeacher />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Classes Routes - Admin and Teacher */}
      <Route 
        path={RoutesConstants.CLASSES} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
            <Classes />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path={RoutesConstants.CLASSES_CREATE} 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <CreateClass />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path={RoutesConstants.CLASSES + '/:id'} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
            <ClassDetails />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path={RoutesConstants.CLASSES_EDIT + '/:id'} 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <EditClass />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path={RoutesConstants.MY_CLASSES} 
        element={
          <RoleProtectedRoute allowedRoles={['teacher', 'student']}>
            <Classes />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Check-in Routes - Admin, Teacher, and Receptionist */}
      <Route 
        path={RoutesConstants.CHECKIN} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher', 'receptionist']}>
            <Checkin />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path={RoutesConstants.MY_CHECKINS} 
        element={
          <RoleProtectedRoute allowedRoles={['student']}>
            <Checkin />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Belt Progression Routes - Admin and Teacher */}
      <Route 
        path={RoutesConstants.BELT_PROGRESSION} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
            <BeltProgression />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Video Content Routes - Admin and Teacher */}
      <Route 
        path={RoutesConstants.VIDEO_CONTENT} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
            <VideoContent />
          </RoleProtectedRoute>
        } 
      />
      

      
      {/* Financial Routes - Admin only */}
      <Route 
        path={RoutesConstants.FINANCIAL} 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <Financial />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path={RoutesConstants.MY_PAYMENTS} 
        element={
          <RoleProtectedRoute allowedRoles={['student']}>
            <Financial />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Reports Routes - Admin only */}
      <Route 
        path={RoutesConstants.REPORTS} 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <Reports />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Profile Route - All authenticated users */}
      <Route 
        path={RoutesConstants.PROFILE} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher', 'receptionist', 'student']}>
            <Profile />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to={RoutesConstants.DASHBOARD} replace />} />
    </Routes>
  );
};

export default AppRoutes; 