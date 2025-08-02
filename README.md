# Boumia Admin Dashboard - User Management System

A comprehensive React.js admin dashboard with integrated user management functionality, built with TypeScript, Tailwind CSS, and Axios for API integration.

## 🚀 Features

### Authentication & Security
- **JWT-based Authentication**: Secure login with token management
- **Protected Routes**: Admin-only access to user management
- **Automatic Token Validation**: Seamless session management
- **Role-based Access Control**: Admin (Level 10) and Cashier (Level 0) roles

### User Management
- **Create Users**: Add new users with role assignment
- **View All Users**: Complete user listing with search functionality
- **Edit Users**: Update user information and roles
- **Delete Users**: Remove users with confirmation
- **Enable/Disable Users**: Toggle user status
- **Search Users**: Find users by name, username, or email
- **Real-time Updates**: Automatic refresh after operations

### UI/UX Features
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Complete dark theme implementation
- **Modern UI**: Clean, professional interface
- **Loading States**: Smooth user experience
- **Error Handling**: Comprehensive error messages
- **Form Validation**: Client-side validation with helpful feedback

## 🔧 Access Levels

| Level | Role | Description |
|-------|------|-------------|
| 0 | Cashier | Basic user access |
| 10 | Admin | Full administrative access |

## 🛠️ Technology Stack

- **Frontend**: React.js 18+ with TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: React Context API
- **Routing**: React Router v6
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/
│   ├── Admin/
│   │   └── Users.tsx              # Main user management component
│   ├── tables/
│   │   └── UsersTables.tsx        # User table component
│   ├── common/                    # Shared components
│   ├── ui/                        # UI components
│   └── header/                    # Header components
├── context/
│   └── AuthContext.tsx            # Authentication context
├── services/
│   └── api.ts                     # API service layer
├── types/
│   └── user.ts                    # TypeScript interfaces
├── pages/
│   └── AuthPages/
│       └── SignIn.tsx             # Login page
└── layout/
    └── AppSidebar.tsx             # Navigation sidebar
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Boumia API server running on `http://localhost:8080`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd free-react-tailwind-admin-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open `http://localhost:5173` in your browser
   - Login with default admin credentials:
     - **Username**: `admin`
     - **Password**: `admin123`

## 🔌 API Integration

The application integrates with the Boumia API with the following endpoints:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/validate` - Validate JWT token

### User Management Endpoints
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `GET /api/users/search` - Search users
- `PUT /api/users/{id}/enable` - Enable user
- `PUT /api/users/{id}/disable` - Disable user

## 🔐 Security Features

- **JWT Token Management**: Automatic token handling and refresh
- **Route Protection**: Admin-only access to sensitive areas
- **Input Validation**: Client and server-side validation
- **Error Handling**: Secure error messages without data leakage
- **CSRF Protection**: Built-in protection against CSRF attacks

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Component styles in individual files
- Dark mode preferences

### API Configuration
Update the API base URL in `src/services/api.ts`:
```typescript
const api = axios.create({
  baseURL: 'http://localhost:8080', // Change this to your API URL
  // ...
});
```

### Access Levels
Modify access levels in `src/types/user.ts`:
```typescript
export const ACCESS_LEVELS = {
  CASHIER: 0,
  ADMIN: 10,
} as const;
```

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Ensure the Boumia API server is running on port 8080
   - Check network connectivity
   - Verify API endpoints are accessible

2. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token format
   - Verify API authentication endpoints

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript compilation errors
   - Verify Node.js version compatibility

### Development Tips

- Use browser developer tools to inspect network requests
- Check the console for error messages
- Verify API responses match expected formats
- Test with different user roles and permissions

## 📝 Usage Guide

### For Administrators

1. **Login** with admin credentials
2. **Navigate** to "Users" in the sidebar
3. **Create Users**:
   - Click "Add User" button
   - Fill in required information
   - Select appropriate access level
   - Save the user

4. **Manage Users**:
   - Search for specific users
   - Edit user information
   - Enable/disable users
   - Delete users when necessary

### For Cashiers

1. **Login** with cashier credentials
2. **Access** basic dashboard features
3. **Note**: User management features are restricted to admin users only

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review API documentation
- Contact the development team

---

**Built with ❤️ for Boumia Admin Dashboard**
