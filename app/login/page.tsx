'use client'

import { UserProvider } from '@/lib/context/user'
import LoginForm from './components/loginform'

export default function LoginPage() {
  return (
    <UserProvider>
      <LoginForm />
    </UserProvider>
  )
}
