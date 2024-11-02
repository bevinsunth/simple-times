"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { OAuthProvider } from "node-appwrite"

import { createAdminClient } from "@/lib/server/appwrite"

export async function signUpWithGithub() {
  const { account } = await createAdminClient()

  const origin = headers().get("origin") ?? "http://default-origin.com"

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Github,
    `${origin}/oauth`,
    `${origin}/signup`
  )

  return redirect(redirectUrl)
}
