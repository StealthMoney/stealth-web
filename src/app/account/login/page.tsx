"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import React from "react"

export default function Page() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [error, setError] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    const formAction = async (formData: FormData) => {
        try {
            setError("")
            setLoading(true)
            const res = await signIn("credentials", {
                email: formData.get("email") as string,
                password: formData.get("password") as string,
                redirect: false,
                callbackUrl
            })
            setLoading(false)
            if (!res?.error) {
                router.push(callbackUrl)
            } else {
                setError("Invalid email/username or password")
            }
        } catch (error: any) {
            setLoading(false)
            setError(error.message)
        }
    }

    return (
        <form
            method="POST"
            action={formAction}
            className="col-span-3 p-11 justify-self-center"
        >
            <main className="max-w-[450px]">
                <div
                    className={`bg-none ${
                        error ? "bg-red-100" : ""
                    } rounded-lg px-5 py-4 mb-5 flex items-center justify-center text-[14px] text-red-700 font-semibold opacity-[0.8]`}
                >
                    {error ? <p>{error}</p> : null}
                </div>

                <section>
                    <h2 className="text-xl font-bold">Welcome Back!</h2>
                    <p className="text-gray-400 text-[14px]">
                        Please enter your login credentials to access your
                        account.
                    </p>
                </section>
                <div className="flex flex-col px-5 py-2">
                    <label htmlFor="email" className="text-[14px] mb-1">
                        Email Address
                    </label>
                    <input
                        className="border border-gray-800 bg-stealth-gray px-3 py-2 text-[14px]"
                        type="email"
                        name="email"
                        required
                        placeholder="theo@stealth.money"
                    />
                </div>
                <div className="flex flex-col px-5 py-2">
                    <label
                        htmlFor="password"
                        className="text-[14px] font-semibold mb-1"
                    >
                        Password
                    </label>
                    <input
                        className="border border-gray-800 bg-stealth-gray px-3 py-2 text-[14px]"
                        required
                        name="password"
                        type="password"
                        placeholder="Password"
                    />
                </div>

                <div className="flex flex-col px-5 py-2">
                    <button
                        disabled={loading}
                        className="bg-stealth-orange disabled:cursor-not-allowed disabled:bg-stealth-gray px-3 py-2 text-[16px] font-semibold"
                    >
                        Login
                    </button>
                </div>
                <div className="flex flex-col items-center px-5 py-2">
                    <p className="text-[15px]">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-stealth-orange">
                            Sign up
                        </Link>
                    </p>
                </div>
            </main>
        </form>
    )
}
