"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { UserProvider, useUser } from "@/lib/context/user";

export default function Home() {
    const user = useUser();
    return (
        <div className="flex flex-col items-center justify-center min-h-20 py-2">
            <Card className="mx-auto max-w-sm flex-1">
                <CardHeader className="text-center">
                    <CardTitle>Simple times!!</CardTitle>
                    <CardDescription>You timsheets don't have to be complicated</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mt-4 text-center text-sm">
                        Ready to get started?{" "}
                        <Link href="/login" className="underline">
                            Login or register now
                        </Link>
                    </div>
                </CardContent>
            </Card>
            <UserProvider>
                {console.log(user)}
                {user &&
                    <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Welcome !</AlertTitle>
                        <AlertDescription>
                            You can add components and dependencies to your app using the cli.
                        </AlertDescription>
                    </Alert>
                }
            </UserProvider>
        </div>

    );
}
