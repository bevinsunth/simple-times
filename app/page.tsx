import { redirect } from "next/navigation"

import { getLoggedInUser } from "@/lib/server/appwrite"

export default async function Home() {
    const user = await getLoggedInUser()
    if (!user) redirect("/login")
    else redirect("/sheet")
}