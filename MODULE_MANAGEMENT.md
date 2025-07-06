# Module Management CRUD

This document describes the complete CRUD (Create, Read, Update, Delete) functionality for managing video content modules in the Okami Web application.

## Overview

The module management system allows administrators to organize video content into logical groups called modules. Each module has a name, description, color, and order for display purposes.

## API Endpoints

The following REST API endpoints are available for module management:

- `GET /api/modules` - Get all modules
- `POST /api/modules` - Create new module (Admin only)
- `GET /api/modules/:id` - Get module by ID
- `PUT /api/modules/:id` - Update module (Admin only)
- `DELETE /api/modules/:id` - Delete module (Admin only)

## Module Data Structure

```typescript
interface Module {
  id: string;
  name: string;
  description: string;
  color: string;
  order_index: number;
  created_at: string;
  updated_at: string;
  _count?: {
    videos: number;
  };
}
```

## Features

### 1. Module List View
- Displays all modules in a table format
- Shows module name, description, video count, order, and creation date
- Color-coded module indicators
- Action buttons for view, edit, and delete operations

### 2. Module Statistics
- Total number of modules
- Total number of videos across all modules
- Average videos per module

### 3. Create Module
- Modal form for creating new modules
- Form validation using Zod schema
- Color picker for module identification
- Order field for display sequence

### 4. Edit Module
- Pre-populated form with existing module data
- Same validation as create form
- Real-time updates

### 5. Delete Module
- Confirmation modal before deletion
- Warning about associated videos
- Cascading deletion of videos in the module

## File Structure

```
src/
├── pages/shared/ModuleManagement/
│   ├── ModuleManagement.tsx
│   ├── ModuleManagementScreen.tsx
│   ├── hooks/
│   │   └── useModuleManagement.ts
│   └── components/
│       ├── ModuleHeader.tsx
│       ├── ModuleTable.tsx
│       ├── ModuleStats.tsx
│       ├── CreateModuleModal.tsx
│       ├── EditModuleModal.tsx
│       ├── DeleteModuleModal.tsx
│       └── ErrorDisplay.tsx
├── stores/
│   └── moduleStore.ts
├── services/
│   └── moduleService.ts
└── types/
    └── index.ts (Module interface)
```

## Usage

### Accessing Module Management
1. Navigate to `/modules` in the application
2. Only administrators can access this feature
3. The route is protected by `RoleProtectedRoute`

### Creating a Module
1. Click the "Criar Módulo" button in the header
2. Fill in the required fields:
   - Name (required, max 50 characters)
   - Description (required, max 200 characters)
   - Color (required, hex format)
   - Order (required, positive integer)
3. Click "Criar Módulo" to save

### Editing a Module
1. Click the edit icon (pencil) in the module table
2. Modify the desired fields
3. Click "Salvar Alterações" to update

### Deleting a Module
1. Click the delete icon (trash) in the module table
2. Confirm the deletion in the modal
3. Note: This will also delete all videos in the module

## Integration with Video Content

Modules are used in the video content management system to organize videos. When creating or editing videos, users can assign them to specific modules.

## Security

- Only administrators can access module management
- All operations are protected by role-based access control
- Form validation prevents invalid data submission
- Confirmation required for destructive operations

## Error Handling

- Network errors are displayed with retry options
- Form validation errors are shown inline
- Toast notifications for success/error feedback
- Loading states for all async operations

## Future Enhancements

- Module reordering via drag and drop
- Bulk operations (create, edit, delete multiple modules)
- Module templates for quick creation
- Module analytics and usage statistics
- Integration with learning paths 