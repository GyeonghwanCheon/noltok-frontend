import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import { SignupForm } from '@/features/auth/components/SignupForm'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/signup',
    element: <SignupForm />,
  },
])
