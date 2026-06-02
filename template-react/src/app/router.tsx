import { createBrowserRouter } from 'react-router'
import RootLayout from './layouts/root'
import HomePage from '@/features/home/pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [{ index: true, element: <HomePage /> }],
  },
])
