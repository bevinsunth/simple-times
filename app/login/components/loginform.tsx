"use client"

import Link from "next/link"
import { useUser } from '@/lib/context/user'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { register } from "module"

export const description =
    "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account"

export const iframeHeight = "600px"

export const containerClassName =
    "w-full h-screen flex items-center justify-center px-4"

export default function LoginForm() {


    const user = useUser();

    const formSchema = z.object({
        email: z.string().email({
            message: "Uh oh! This email address is invalid.",
        }),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        },).regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter.",
        }).regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter.",
        }).regex(/[0-9]/, {
            message: "Password must contain at least one number.",
        }),
    })


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })


    function onCreateAccountSubmit(values: z.infer<typeof formSchema>) {
        user.register(values.email, values.password)
    }

    async function onClickGitHubLogin() {
        console.log("clicked")
        console.log(user)
        await user.gitHublogin()
    }


    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-xl">Sign Up</CardTitle>
                <CardDescription>
                    Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>


                <Form {...form}>
                    <form>
                        <FormField
                            control={form.control}
                            name="email"
                            key="email"
                            render={({ field }) => (
                                <FormItem>


                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <FormLabel htmlFor="email">Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="mary@jane.com"  {...field} required />
                                            </FormControl>
                                        </div>
                                        <div className="grid gap-2">
                                            <FormLabel htmlFor="password">Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Your strong password."  {...field} required />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <Button type="submit" onSubmit={form.handleSubmit(onCreateAccountSubmit)} className="w-full">
                                        Create an account
                                    </Button>
                                    <Button type="button" variant="outline" onClick={async () => { await onClickGitHubLogin() }} className="w-full">
                                        Sign up with GitHub
                                    </Button>
                                    <div className="mt-4 text-center text-sm">
                                        Already have an account?{" "}
                                        <Link href="#" className="underline">
                                            Sign in
                                        </Link>
                                    </div>
                                </FormItem>
                            )}
                        >
                        </FormField>
                    </form>
                </Form>

                {/* <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="#" className="underline">
                            Sign in
                        </Link>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" />
                    </div>
                    <Button type="submit" className="w-full">
                        Create an account
                    </Button>
                    <Button variant="outline" className="w-full">
                        Sign up with GitHub
                    </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="#" className="underline">
                        Sign in
                    </Link> */}

            </CardContent >
        </Card >
    )
}
