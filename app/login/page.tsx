'use client'

import { UserProvider } from '../context/user'
import LoginForm from './components/loginform'

export default function LoginPage() {
  return (
    <UserProvider>
      <LoginForm />
    </UserProvider>
  )
}
