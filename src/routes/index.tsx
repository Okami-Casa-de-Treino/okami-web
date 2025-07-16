import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RoleProtectedRoute from '../components/common/RoleProtectedRoute';
import { AppRoutes as RoutesConstants } from './routes.constants';

// Page imports
import Dashboard from '../pages/admin/AdminDashboard';
import Profile from '../pages/common/Profile';

// Student pages
import Students from '../pages/shared/Students';
import CreateStudent from '../pages/shared/CreateStudent';
import EditStudent from '../pages/shared/EditStudent';
import StudentDetails from '../pages/shared/StudentDetails';

// Teacher pages
import Teachers from '../pages/admin/Teachers';
import CreateTeacher from '../pages/admin/CreateTeacher';
import TeacherActions from '../pages/admin/TeacherActions';
import EditTeacher from '../pages/admin/EditTeacher';

// Class pages
import Classes from '../pages/shared/Classes';
import CreateClass from '../pages/shared/CreateClass';
import ClassDetails from '../pages/shared/ClassDetails';
import EditClass from '../pages/shared/EditClass';
import StudentClasses from '../pages/student/Classes';

// Other pages
import Checkin from '../pages/student/Checkin';
import BeltProgression from '../pages/shared/BeltProgression';
import { VideoContent } from '../pages/shared/VideoContent';
import Financial from '../pages/admin/Financial';
import Reports from '../pages/admin/Reports';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ========================================
          ROOT & DASHBOARD ROUTES
          ======================================== */}
      
      {/* Root redirect */}
      <Route path="/" element={<Navigate to={RoutesConstants.DASHBOARD} replace />} />
      
      {/* Dashboard - accessible to all authenticated users */}
      <Route path={RoutesConstants.DASHBOARD} element={<Dashboard />} />
      
      {/* ========================================
          PROFILE ROUTES (User-specific)
          ======================================== */}
      
      {/* Profile Route - All authenticated users */}
      <Route 
        path={RoutesConstants.PROFILE} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher', 'receptionist', 'student']}>
            <Profile />
          </RoleProtectedRoute>
        } 
      />
      
      {/* My classes - Teacher */}
      <Route 
        path={RoutesConstants.MY_CLASSES} 
        element={
          <RoleProtectedRoute allowedRoles={['teacher']}>
            <Classes />
          </RoleProtectedRoute>
        } 
      />

      {/* My classes -  Student */}
      <Route 
        path={RoutesConstants.MY_CLASSES_STUDENT} 
        element={
          <RoleProtectedRoute allowedRoles={['student']}>
            <StudentClasses />
          </RoleProtectedRoute>
        } 
      />
      
      {/* My check-ins - Student */}
      <Route 
        path={RoutesConstants.MY_CHECKINS} 
        element={
          <RoleProtectedRoute allowedRoles={['student']}>
            <Checkin />
          </RoleProtectedRoute>
        } 
      />
      
      {/* My payments - Student */}
      <Route 
        path={RoutesConstants.MY_PAYMENTS} 
        element={
          <RoleProtectedRoute allowedRoles={['student']}>
            <Financial />
          </RoleProtectedRoute>
        } 
      />
      
      {/* ========================================
          COMMON/SHARED MANAGEMENT ROUTES
          ======================================== */}
      
      {/* ========================================
          STUDENT MANAGEMENT
          ======================================== */}
      
      {/* Student list - Admin, Receptionist, and Teacher */}
      <Route 
        path={RoutesConstants.STUDENTS} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'receptionist', 'teacher']}>
            <Students />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Create student - Admin and Receptionist only */}
      <Route 
        path={RoutesConstants.STUDENTS_CREATE} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'receptionist']}>
            <CreateStudent />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Edit student - Admin and Receptionist only */}
      <Route 
        path={RoutesConstants.STUDENTS_EDIT + '/:id'} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'receptionist']}>
            <EditStudent />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Student details - Admin, Receptionist, and Teacher */}
      <Route 
        path={RoutesConstants.STUDENTS + '/:id'} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'receptionist', 'teacher']}>
            <StudentDetails />
          </RoleProtectedRoute>
        } 
      />
      
      {/* ========================================
          TEACHER MANAGEMENT (Admin only)
          ======================================== */}
      
      {/* Teacher list */}
      <Route 
        path={RoutesConstants.TEACHERS} 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <Teachers />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Create teacher */}
      <Route 
        path={RoutesConstants.TEACHERS_CREATE} 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <CreateTeacher />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Teacher actions/details */}
      <Route 
        path={RoutesConstants.TEACHERS + '/:id'} 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <TeacherActions />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Edit teacher */}
      <Route 
        path={RoutesConstants.TEACHERS_EDIT + '/:id'} 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <EditTeacher />
          </RoleProtectedRoute>
        } 
      />
      
      {/* ========================================
          CLASS MANAGEMENT
          ======================================== */}
      
      {/* Class list - Admin and Teacher */}
      <Route 
        path={RoutesConstants.CLASSES} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
            <Classes />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Create class - Admin only */}
      <Route 
        path={RoutesConstants.CLASSES_CREATE} 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <CreateClass />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Class details - Admin and Teacher */}
      <Route 
        path={RoutesConstants.CLASSES + '/:id'} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
            <ClassDetails />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Edit class - Admin only */}
      <Route 
        path={RoutesConstants.CLASSES_EDIT + '/:id'} 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <EditClass />
          </RoleProtectedRoute>
        } 
      />
      
      {/* ========================================
          CHECK-IN MANAGEMENT
          ======================================== */}
      
      {/* Check-in management - Admin, Teacher, and Receptionist */}
      <Route 
        path={RoutesConstants.CHECKIN} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher', 'receptionist']}>
            <Checkin />
          </RoleProtectedRoute>
        } 
      />
      
      {/* ========================================
          CONTENT MANAGEMENT
          ======================================== */}
      
      {/* Belt progression - Admin and Teacher */}
      <Route 
        path={RoutesConstants.BELT_PROGRESSION} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
            <BeltProgression />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Video content - Admin and Teacher */}
      <Route 
        path={RoutesConstants.VIDEO_CONTENT} 
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
            <VideoContent />
          </RoleProtectedRoute>
        } 
      />
      
      {/* ========================================
          FINANCIAL MANAGEMENT
          ======================================== */}
      
      {/* Financial management - Admin only */}
      <Route 
        path={RoutesConstants.FINANCIAL} 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <Financial />
          </RoleProtectedRoute>
        } 
      />
      
      {/* ========================================
          ADMIN REPORTS
          ======================================== */}
      
      {/* Reports - Admin only */}
      <Route 
        path={RoutesConstants.REPORTS} 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <Reports />
          </RoleProtectedRoute>
        } 
      />
      
      {/* ========================================
          CATCH ALL ROUTE
          ======================================== */}
      
      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to={RoutesConstants.DASHBOARD} replace />} />
    </Routes>
  );
};

export default AppRoutes; 