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
            className="flex flex-col absolute top-[45%] left-[50%] -translate-x-[50%] -translate-y-[45%]"
        >
            <div
                className={`bg-none ${
                    error ? "bg-red-100" : ""
                } rounded-lg px-5 py-4 mb-5 flex items-center justify-center text-[14px] text-red-700 font-semibold opacity-[0.8]`}
            >
                {error ? <p>{error}</p> : null}
            </div>

            <div className="bg-slate-100 w-[300px] h-fit rounded-xl pt-3 pb-8">
                <h2 className="text-[20px] font-semibold text-black text-center pt-3">
                    Sign in
                </h2>
                <div className="flex flex-col px-5 py-2">
                    <label
                        htmlFor="email"
                        className="text-[14px] font-semibold text-black mb-1"
                    >
                        Email/Username
                    </label>
                    <input
                        className="border border-gray-300 rounded-lg px-3 py-2 text-[14px] text-black"
                        type="email"
                        name="email"
                        required
                        placeholder="theo@stealth.money"
                    />
                </div>
                <div className="flex flex-col px-5 py-2">
                    <label
                        htmlFor="password"
                        className="text-[14px] font-semibold text-black mb-1"
                    >
                        Password
                    </label>
                    <input
                        className="border border-gray-300 rounded-lg px-3 py-2 text-[14px] text-black"
                        required
                        name="password"
                        type="password"
                        placeholder="Password"
                    />
                </div>

                <div className="flex flex-col px-5 py-2">
                    <button
                        disabled={loading}
                        className="bg-black disabled:cursor-not-allowed disabled:bg-slate-500 text-white rounded-lg px-3 py-2 text-[16px] font-semibold"
                    >
                        Login
                    </button>
                </div>
                <div className="flex flex-col items-center px-5 py-2">
                    <p className="text-[15px] text-black">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="text-blue-500 font-semibold"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </form>
    )
}
