# User Management System for Boumia Admin Dashboard

This document describes the user management system implementation for the Boumia Admin Dashboard using the Boumia API.

## Features

### Authentication
- **Login System**: Secure authentication using JWT tokens
- **Token Management**: Automatic token validation and refresh
- **Logout**: Secure logout with token cleanup
- **Protected Routes**: Route protection based on authentication status

### User Management (Admin Only)
- **View All Users**: Display all users in a responsive table
- **Create Users**: Add new users with full details
- **Edit Users**: Modify existing user information
- **Delete Users**: Remove users from the system
- **Enable/Disable Users**: Toggle user account status
- **Search Users**: Real-time search functionality
- **Access Level Management**: Different access levels (0-10)

## API Integration

### Base Configuration
- **Base URL**: `http://localhost:8080`
- **Authentication**: JWT Bearer tokens
- **HTTP Client**: Axios with interceptors

### Key Endpoints Used
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user
- `POST /api/auth/validate` - Validate JWT token
- `GET /api/users` - Get all users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (Admin only)
- `PUT /api/users/{id}/enable` - Enable user (Admin only)
- `PUT /api/users/{id}/disable` - Disable user (Admin only)

## Access Levels

| Level | Description |
|-------|-------------|
| 0 | Regular User |
| 1-5 | Elevated User |
| 6-9 | Manager |
| 10 | Admin |

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`
- **Access Level**: 10
- **Email**: `admin@boumia.com`

## File Structure

```
src/
├── services/
│   └── api.ts                 # API service with axios configuration
├── types/
│   └── user.ts               # TypeScript interfaces for user data
├── context/
│   └── AuthContext.tsx       # Authentication context provider
├── components/
│   ├── ProtectedRoute.tsx    # Route protection component
│   └── header/
│       └── UserDropdown.tsx  # User dropdown with logout
├── pages/
│   ├── UserManagement.tsx    # Main user management page
│   └── AuthPages/
│       └── SignIn.tsx        # Login page
└── layout/
    └── AppSidebar.tsx        # Sidebar with navigation
```

## Usage

### 1. Starting the Application

```bash
npm install
npm run dev
```

### 2. Accessing User Management

1. Navigate to `http://localhost:5173/auth/signin`
2. Login with admin credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click on "User Management" in the sidebar
4. You'll have access to all user management features

### 3. User Management Features

#### Viewing Users
- All users are displayed in a responsive table
- Users are shown with their avatar, name, email, access level, and status
- Real-time search functionality filters users by name, username, or email

#### Creating Users
1. Click "Add New User" button
2. Fill in the required fields:
   - First Name
   - Last Name
   - Username
   - Email
   - Password
   - Access Level
   - Enabled Status
3. Click "Create User"

#### Editing Users
1. Click the edit icon (eye icon) next to any user
2. Modify the desired fields
3. Click "Update User"

#### Managing User Status
- Click the enable/disable icon to toggle user status
- Active users show green badge, inactive users show red badge

#### Deleting Users
1. Click the delete icon (trash icon) next to any user
2. Confirm the deletion in the popup dialog

## Security Features

### Authentication
- JWT tokens are automatically included in all API requests
- Tokens are validated on app startup
- Automatic logout on token expiration
- Secure token storage in localStorage

### Authorization
- Route protection based on authentication status
- Access level restrictions for admin-only features
- User management requires admin access (level 10)

### Error Handling
- Comprehensive error handling for API calls
- User-friendly error messages
- Automatic retry mechanisms for failed requests

## API Error Handling

The system handles various API errors:

- **401 Unauthorized**: Automatic logout and redirect to login
- **403 Forbidden**: Access denied message
- **404 Not Found**: Resource not found message
- **400 Bad Request**: Validation error display
- **500 Server Error**: Generic error message

## Customization

### Adding New User Fields
1. Update the `User` interface in `src/types/user.ts`
2. Modify the API service in `src/services/api.ts`
3. Update the UserManagement component forms

### Changing Access Levels
1. Modify the `ACCESS_LEVEL_LABELS` constant in `src/types/user.ts`
2. Update the `ACCESS_LEVELS` constants as needed

### Styling
- The system uses Tailwind CSS for styling
- All components follow the existing design system
- Dark mode support is included

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure the Boumia API is running on `http://localhost:8080`
   - Check network connectivity
   - Verify CORS settings on the API

2. **Authentication Issues**
   - Clear browser localStorage
   - Check if JWT token is valid
   - Verify admin credentials

3. **User Management Not Accessible**
   - Ensure you're logged in as an admin user (access level 10)
   - Check browser console for errors
   - Verify route protection is working

### Development

For development and testing:

1. **API Testing**: Use the provided curl commands in the API documentation
2. **Token Testing**: Use browser dev tools to inspect localStorage
3. **Error Testing**: Modify API responses to test error handling

## Dependencies

- **axios**: HTTP client for API requests
- **react-router**: Client-side routing
- **react**: UI framework
- **tailwindcss**: Styling framework

## Contributing

When adding new features:

1. Follow the existing TypeScript patterns
2. Use the established API service structure
3. Implement proper error handling
4. Add appropriate access level checks
5. Update this documentation 