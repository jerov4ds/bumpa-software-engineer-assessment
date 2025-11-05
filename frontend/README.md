# Loyalty Program Frontend

A modern, responsive React application for the loyalty program with customer dashboard and admin panel.

## 🏗️ Architecture Overview

### Technology Stack
- **Framework**: React 18.2
- **Build Tool**: Vite 5
- **Routing**: React Router 6.20
- **State Management**: Zustand 4.4.1
- **HTTP Client**: Axios 1.6.2
- **Styling**: CSS Modules
- **Testing**: Vitest 1.0.4, React Testing Library 14.1.2

### Design Patterns
- **Component-Based Architecture**: Reusable UI components
- **State Management**: Zustand for global state
- **Service Layer**: Centralized API communication
- **Custom Hooks**: Reusable logic
- **Error Boundaries**: Graceful error handling

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Navigation.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorBoundary.jsx
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── CustomerDashboard.jsx
│   │   └── AdminPanel.jsx
│   ├── services/            # API integration
│   │   └── api.js
│   ├── store/               # State management
│   │   ├── authStore.js
│   │   └── loyaltyStore.js
│   ├── styles/              # Global styles
│   │   └── App.css
│   ├── App.jsx              # Main component
│   └── main.jsx             # Entry point
├── tests/                   # Test suite
│   ├── components/
│   ├── pages/
│   └── services/
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Environment Setup

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Loyalty Program
VITE_APP_ENV=development
```

### Development Server

```bash
npm run dev
```

Access at: http://localhost:5173

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
```

### Run Specific Test File

```bash
npm test -- CustomerDashboard.test.jsx
```

## 📄 Pages

### 1. Login Page
- Email and password authentication
- Role-based access (admin/customer)
- Error handling and validation
- Redirect to dashboard on success

### 2. Customer Dashboard
- Loyalty summary display
- Achievement showcase
- Badge collection
- Purchase recording form
- Real-time updates

### 3. Admin Panel
- User management
- Achievement management
- Badge management
- Data visualization
- Admin-only access

## 🔧 Key Components

### Header Component
- Navigation menu
- User profile display
- Logout functionality

### Navigation Component
- Route-based navigation
- Active link highlighting
- Role-based menu items

### LoadingSpinner Component
- Loading state indicator
- Reusable across pages

### ErrorBoundary Component
- Error handling
- Graceful error display
- Error recovery

## 🌐 API Integration

### API Service (`services/api.js`)

```javascript
// Initialize API client
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### API Endpoints Used

**User Endpoints**
- `GET /users/{user}/achievements` - Get user achievements
- `GET /users/{user}/summary` - Get loyalty summary
- `POST /purchases` - Record purchase

**Admin Endpoints**
- `GET /admin/users/achievements` - List all users' achievements
- `GET /admin/achievements` - List achievements
- `POST /admin/achievements` - Create achievement
- `GET /admin/badges` - List badges
- `POST /admin/badges` - Create badge

## 💾 State Management

### Auth Store (`store/authStore.js`)
- User authentication state
- Login/logout functionality
- Token management
- Role-based access

### Loyalty Store (`store/loyaltyStore.js`)
- User achievements
- User badges
- Loyalty summary
- Purchase history

## 🎨 Styling

### CSS Modules
- Component-scoped styles
- Prevents style conflicts
- Easy maintenance

### Global Styles
- Base styles in `App.css`
- CSS variables for theming
- Responsive design

### Responsive Design
- Mobile-first approach
- Breakpoints for tablets and desktops
- Flexible layouts

## 🔐 Authentication

### Login Flow
1. User enters credentials
2. API validates credentials
3. Token returned on success
4. Token stored in localStorage
5. User redirected to dashboard

### Protected Routes
- Routes require authentication
- Role-based access control
- Redirect to login if unauthorized

## 📱 Features

### Customer Dashboard
- View loyalty summary
- View achievements
- View badges
- Record purchases
- Real-time updates

### Admin Panel
- View all users
- View user achievements
- Create achievements
- Create badges
- Manage loyalty program

## 🧩 Component Hierarchy

```
App
├── Router
│   ├── Login
│   ├── CustomerDashboard
│   │   ├── Header
│   │   ├── Navigation
│   │   ├── LoyaltySummary
│   │   ├── AchievementList
│   │   ├── BadgeCollection
│   │   └── PurchaseForm
│   └── AdminPanel
│       ├── Header
│       ├── Navigation
│       ├── UserManagement
│       ├── AchievementManagement
│       └── BadgeManagement
└── ErrorBoundary
```

## 🔄 Data Flow

```
User Action
    ↓
Component Handler
    ↓
API Service Call
    ↓
Backend Processing
    ↓
Response Received
    ↓
State Update (Zustand)
    ↓
Component Re-render
    ↓
UI Update
```

## 🐛 Debugging

### Browser DevTools
- React DevTools extension
- Network tab for API calls
- Console for errors

### Logging
- Console logs for debugging
- Error logging in services
- State logging in stores

## 📚 Best Practices

1. **Component Composition**: Break UI into small, reusable components
2. **State Management**: Use Zustand for global state
3. **Error Handling**: Graceful error handling and user feedback
4. **Performance**: Lazy loading and code splitting
5. **Testing**: Unit and integration tests
6. **Documentation**: Clear comments and documentation
7. **Accessibility**: ARIA labels and semantic HTML
8. **Security**: Input validation and XSS prevention

## 🚀 Deployment

### Docker Build
```bash
docker build -t loyalty-frontend:dev .
```

### Docker Run
```bash
docker run -p 5173:5173 loyalty-frontend:dev
```

### Production Build
```bash
npm run build
# Output in dist/ directory
```

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Module Not Found
```bash
npm install
npm cache clean --force
```

### API Connection Issues
- Check backend is running
- Verify API URL in .env
- Check network tab in DevTools

### State Not Updating
- Check Zustand store
- Verify state actions
- Check component subscriptions

## 📖 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Axios Documentation](https://axios-http.com)

## 📝 Notes

- Frontend runs on port 5173 in development
- Backend API must be running for full functionality
- Authentication tokens stored in localStorage
- All API calls include auth token in headers

## 🎓 Learning Outcomes

This frontend demonstrates:
- React component development
- State management with Zustand
- API integration with Axios
- Responsive design
- Error handling
- Testing best practices
- Clean code principles

---

**Version**: 1.0.0
**Last Updated**: November 5, 2025
**Status**: ✅ Complete

