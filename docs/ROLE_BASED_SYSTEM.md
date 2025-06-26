# Role-Based System Documentation

## Overview

The Okami Web application now supports role-based access control with three distinct user profiles:
- **Admin**: Full system access
- **Teacher**: Limited access focused on teaching activities
- **Student**: Restricted access to personal information and activities

## User Roles

### Admin
- **Full Access**: Complete system administration
- **Permissions**: 
  - Manage students, teachers, classes
  - Access financial reports and data
  - View all system reports and analytics
  - Manage system settings

### Teacher
- **Teaching Focus**: Access to teaching-related features
- **Permissions**:
  - View and manage their assigned classes
  - Access student information for their classes
  - Perform check-ins for their students
  - View their teaching dashboard

### Student
- **Personal Access**: Limited to personal information and activities
- **Permissions**:
  - View personal dashboard
  - Check personal class schedule
  - View attendance history
  - Manage payment information
  - Update personal profile

### Receptionist
- **Administrative Support**: Limited administrative access
- **Permissions**:
  - Manage student check-ins
  - View student information
  - Basic administrative tasks

## Directory Structure

```
src/pages/
├── admin/           # Admin-only pages
│   ├── Teachers.tsx
│   ├── CreateTeacher.tsx
│   ├── CreateStudent.tsx
│   ├── Financial.tsx
│   └── Reports.tsx
├── shared/          # Pages shared between roles
│   ├── Students.tsx
│   ├── Classes.tsx
│   └── Checkin.tsx
├── common/          # Pages accessible to all authenticated users
│   └── Profile.tsx
├── teacher/         # Teacher-specific pages
│   └── TeacherDashboard.tsx
├── student/         # Student-specific pages
│   └── StudentDashboard.tsx
├── Dashboard.tsx    # Role-aware dashboard router
└── Login.tsx        # Authentication page
```

## Key Components

### RoleProtectedRoute
Located: `src/components/common/RoleProtectedRoute.tsx`

A wrapper component that protects routes based on user roles:
```tsx
<RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
  <SomeComponent />
</RoleProtectedRoute>
```

### Role-Based Sidebar
The sidebar dynamically renders navigation items based on the user's role, showing only accessible routes.

### Dashboard Router
The main Dashboard component automatically renders different dashboards based on user role:
- Admin/Receptionist → AdminDashboard (full system overview)
- Teacher → TeacherDashboard (teaching-focused)
- Student → StudentDashboard (personal overview)

## Route Configuration

Routes are organized by role in `src/routes/routes.config.ts`:

### Admin Routes
- Dashboard, Students, Teachers, Classes, Check-in, Financial, Reports

### Teacher Routes  
- Dashboard, My Classes, Check-in, Students (limited), Profile

### Student Routes
- Dashboard, My Classes, My Check-ins, My Payments, Profile

## Implementation Details

### Authentication Store
Updated to include:
- `isStudent` selector
- Support for `student` role
- Student-specific user properties

### Type System
Extended User interface to support:
- `student` role
- `studentId` and `student` properties for student users

### Route Protection
All routes are protected with role-based access control:
- Unauthorized users are redirected to appropriate fallback pages
- Role validation happens at the route level

## Usage Examples

### Protecting a Route
```tsx
<Route 
  path="/admin-only" 
  element={
    <RoleProtectedRoute allowedRoles={['admin']}>
      <AdminOnlyComponent />
    </RoleProtectedRoute>
  } 
/>
```

### Checking User Role in Components
```tsx
const { user } = useAuthStore();
const { isAdmin, isTeacher, isStudent } = useAuthSelectors();

if (isAdmin) {
  // Admin-specific logic
} else if (isTeacher) {
  // Teacher-specific logic
} else if (isStudent) {
  // Student-specific logic
}
```

### Dynamic Navigation
```tsx
const sidebarRoutes = getSidebarRoutes(user.role);
const accessibleRoutes = sidebarRoutes.filter(route => 
  canAccessRoute(route, user.role)
);
```

## Security Considerations

1. **Client-Side Protection**: Route protection is implemented on the client-side
2. **Server Validation**: API endpoints should also validate user roles
3. **Token Management**: User role is stored in the authentication token
4. **Fallback Routes**: Unauthorized access redirects to appropriate pages

## Future Enhancements

1. **Permission System**: More granular permissions within roles
2. **Multi-Role Users**: Support for users with multiple roles
3. **Dynamic Role Assignment**: Admin interface for role management
4. **Audit Logging**: Track role-based access attempts

## Testing

When testing role-based features:
1. Test each role's access to protected routes
2. Verify sidebar navigation shows correct items
3. Confirm dashboard renders appropriate content
4. Test role switching and permission updates 