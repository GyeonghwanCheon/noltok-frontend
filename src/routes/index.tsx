import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import { Layout } from '@/components/Layout'
import { SignupForm } from '@/features/auth/components/SignupForm'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { MyInfo } from '@/features/user/components/MyInfo'
import { EditProfileForm } from '@/features/user/components/EditProfileForm'
import { ChangePasswordForm } from '@/features/user/components/ChangePasswordForm'
import { UserSearch } from '@/features/user/components/UserSearch'
import { DeleteAccount } from '@/features/user/components/DeleteAccount'
import { FriendList } from '@/features/friend/components/FriendList'
import { ReceivedFriendRequests } from '@/features/friend/components/ReceivedFriendRequests'
import { SentFriendRequests } from '@/features/friend/components/SentFriendRequests'
import { BlockedUsers } from '@/features/block/components/BlockedUsers'
import { ChatRoomList } from '@/features/chatroom/components/ChatRoomList'
import { CreateRoomForm } from '@/features/chatroom/components/CreateRoomForm'
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
          {
            path: '/me/edit',
            element: <EditProfileForm />,
          },
          {
            path: '/me/password',
            element: <ChangePasswordForm />,
          },
          {
            path: '/users/search',
            element: <UserSearch />,
          },
          {
            path: '/me/delete',
            element: <DeleteAccount />,
          },
          {
            path: '/friends',
            element: <FriendList />,
          },
          {
            path: '/friends/received',
            element: <ReceivedFriendRequests />,
          },
          {
            path: '/friends/sent',
            element: <SentFriendRequests />,
          },
          {
            path: '/blocks',
            element: <BlockedUsers />,
          },
          {
            path: '/rooms',
            element: <ChatRoomList />,
          },
          {
            path: '/rooms/new',
            element: <CreateRoomForm />,
          },
        ],
      },
    ],
  },
])
