import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import { Layout } from '@/components/Layout'
import { SignupForm } from '@/features/auth/components/SignupForm'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { MyInfo } from '@/features/user/components/MyInfo'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/signup',
        element: <SignupForm />,
      },
      {
        path: '/login',
        element: <LoginForm />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/me',
            element: <MyInfo />,
          },
        ],
      },
    ],
  },
])
