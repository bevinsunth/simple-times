import { redirect } from "next/navigation"

import { getLoggedInUser } from "@/lib/server/appwrite"

export default async function Home() {
    const user = await getLoggedInUser()
    if (!user) redirect("/login")
    else redirect("/sheet")

    // return (
    //     < div className="flex flex-col items-center justify-center min-h-20 py-2" >
    //         <TimesheetTable weekStart={today} />
    //     </div>
    // );
}
