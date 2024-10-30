
import TimesheetTable from "@/app/components/timesheet-table";
import { getLoggedInUser } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";

const today = new Date()

export default async function Home() {

    const user = await getLoggedInUser()
    if (!user) redirect("/login");
    if (!user) redirect("/signup");

    redirect("/sheet");

    // return (
    //     < div className="flex flex-col items-center justify-center min-h-20 py-2" >
    //         <TimesheetTable weekStart={today} />
    //     </div>
    // );
}
