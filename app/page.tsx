import Image from "next/image";
import TimesheetTable from "@/components/wrapper/timesheet-table";

export default function Home() {
  return (
<div>
  <div className="bg-primary flex justify-center">
    <h1 className="text-4xl text-white">Welcome to Simple Sheet. Your weekly timesheet!</h1>
    <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
  </div>
  <div className="bg-inherit flex justify-center">
    <TimesheetTable/>
  </div>
</div>
  );
}
