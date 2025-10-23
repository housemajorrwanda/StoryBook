# 🔐 Authentication System Documentation

## Overview

This HouseMajor project implements a comprehensive authentication system similar to the car tracker project, featuring sign in, sign up, and secure token management.

## 🚀 Features

### ✅ Implemented Features
- **User Registration** - Complete signup flow with validation
- **User Login** - Secure authentication with JWT tokens
- **Token Management** - Dual storage (localStorage + cookies)
- **Protected Routes** - Dashboard with authentication guards
- **Logout Functionality** - Secure session termination
- **Form Validation** - Client-side validation with Yup
- **Error Handling** - Comprehensive error management
- **Responsive UI** - Modern, mobile-friendly design
- **Toast Notifications** - User feedback for all actions

## 📁 File Structure

```
src/
├── types/
│   └── auth.d.ts                 # TypeScript interfaces
├── lib/
│   ├── cookies.ts                # Token storage utilities
│   ├── decodeToken.ts            # JWT decoding functions
│   └── validation/
│       └── auth.validation.ts    # Form validation schemas
├── hooks/
│   └── auth/
│       └── use-auth-queries.ts   # React Query hooks
├── services/
│   └── auth.service.ts           # API service functions
└── config/
    └── axiosInstance.ts          # HTTP client configuration

app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx              # Login page
│   └── signup/
│       └── page.tsx              # Signup page
├── dashboard/
│   ├── page.tsx                  # Dashboard page
│   └── layout.tsx                # Dashboard layout with sidebar
├── providers.tsx                 # React Query & Toast providers
└── layout.tsx                    # Root layout
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development
```

### Dependencies
The following packages are required:

```json
{
  "@tanstack/react-query": "^5.90.5",
  "formik": "^2.4.5",
  "yup": "^1.4.0",
  "axios": "^1.6.0",
  "react-hot-toast": "^2.4.1",
  "@types/yup": "^1.9.0"
}
```

## 🛠️ API Endpoints

The authentication system expects the following backend endpoints:

### POST `/auth/login`
```typescript
// Request
{
  email: string;
  password: string;
}

// Response
{
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: JWTPayload;
  };
}
```

### POST `/auth/signup`
```typescript
// Request
{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Response
{
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: JWTPayload;
  };
}
```

### POST `/auth/logout`
```typescript
// Response
{
  success: boolean;
  message: string;
}
```

## 🔐 Security Features

### Token Management
- **Dual Storage**: Tokens stored in both localStorage and secure cookies
- **Automatic Expiration**: 24-hour token expiration with validation
- **Secure Cookies**: Production-ready cookie settings (secure, sameSite)
- **Token Validation**: Server-side JWT validation

### Authentication Flow
1. **Login**: User enters credentials → API call → Token storage → Dashboard redirect
2. **Signup**: User creates account → API call → Token storage → Dashboard redirect
3. **Logout**: User clicks logout → Token cleanup → Home redirect
4. **Auto-logout**: Token expiration → Automatic redirect to login

### Route Protection
- **Dashboard Guard**: Automatic redirect to login if not authenticated
- **Auth Pages**: Redirect to dashboard if already logged in
- **Token Interceptor**: Automatic Bearer token attachment to API requests

## 🎨 User Interface

### Design Features
- **Modern UI**: Glassmorphism design with backdrop blur effects
- **Responsive**: Mobile-first design with Tailwind CSS
- **Animations**: Smooth transitions and loading states
- **Accessibility**: Proper form labels and keyboard navigation
- **Toast Notifications**: Real-time feedback for all actions

### Pages
1. **Home Page** (`/`) - Landing page with feature overview
2. **Login Page** (`/login`) - User authentication
3. **Signup Page** (`/signup`) - User registration
4. **Dashboard** (`/dashboard`) - Protected user area

## 🚀 Usage

### Starting the Application
```bash
npm run dev
```

### Testing Authentication
1. Navigate to `http://localhost:3000`
2. Click "Get Started" to create an account
3. Fill out the signup form
4. You'll be redirected to the dashboard
5. Use the logout button in the sidebar to sign out

### Development Notes
- The system is configured for development with `localhost:3001` as the API URL
- Update `NEXT_PUBLIC_API_URL` in `.env.local` for production
- All authentication state is managed client-side with React Query
- Form validation happens both client-side (Yup) and server-side

## 🔄 State Management

### React Query Integration
- **Mutations**: Login, signup, and logout operations
- **Cache Management**: Automatic cache invalidation on logout
- **Error Handling**: Centralized error management with toast notifications
- **Loading States**: Built-in loading indicators for all operations

### Authentication State
- **Token Storage**: Automatic token management with expiration checking
- **User Data**: Current user information stored in React Query cache
- **Route Guards**: Automatic authentication checking on protected routes

## 🛡️ Security Best Practices

1. **Token Security**: Tokens stored securely with automatic expiration
2. **HTTPS**: Production-ready secure cookie settings
3. **Input Validation**: Both client and server-side validation
4. **Error Handling**: Secure error messages without sensitive data exposure
5. **Route Protection**: Automatic authentication guards on protected routes

## 📱 Mobile Support

The authentication system is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔧 Customization

### Styling
- Modify Tailwind classes in component files
- Update color schemes in the gradient backgrounds
- Customize toast notification styles in `providers.tsx`

### Validation
- Update validation schemas in `src/lib/validation/auth.validation.ts`
- Add custom validation rules using Yup
- Modify error messages for different languages

### API Integration
- Update API endpoints in `src/services/auth.service.ts`
- Modify request/response types in `src/types/auth.d.ts`
- Adjust token handling in `src/lib/cookies.ts`

This authentication system provides a solid foundation for your HouseMajor application with modern security practices and excellent user experience.
