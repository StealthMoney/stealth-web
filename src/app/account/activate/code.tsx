"use client"

import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

import Spinner from "@/components/spinner"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import React from "react"

export default function Activate({
    action
}: {
    action: (code: string) => Promise<{ error?: string; success?: boolean }>
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const code = searchParams.get("key")

    const [error, setError] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [activated, setActivated] = React.useState(false)

    async function activateAccount() {
        if (!code) {
            return
        }
        setActivated(false)
        setLoading(true)
        const res = await action(code)
        setLoading(false)
        if (res.error) {
            setError(res.error)
            return
        }
        setActivated(true)
        setError("")
        if (res.success || activated) {
            router.push("/account/login")
        }
    }

    if (!code) {
        return (
            <div className="flex flex-col items-center bg-slate-50 p-7 rounded-lg">
                <p className="text-center text-lg font-semibold pt-3">
                    We sent you a mail
                </p>
                <p className="text-center text-lg pt-3">
                    Activate your account by clicking the link sent to your
                    email.
                </p>
            </div>
        )
    }

    if (loading) {
        return (
            <div>
                <Spinner size="large" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center bg-red-50 p-7 rounded-lg">
                <h1 className="font-semibold text-xl text-red-500">
                    Account Activation Error!
                </h1>
                <p className="text-center text-lg pt-3">
                    Sorry we could not activate your account. Please try again
                    later
                </p>
            </div>
        )
    }

    if (activated) {
        return (
            <div className="flex flex-col items-center bg-green-50 p-7 rounded-lg">
                <h1 className="font-semibold text-xl text-green-500">
                    Account Activated!
                </h1>
                <p className="text-center text-lg pt-3">
                    Your account has been activated. You can now login
                </p>
                <p className="text-center text-lg pt-3">
                    Click this button to login if you are not automatically
                    redirected.
                </p>
                <button className="bg-green-500 text-white px-5 py-2 rounded-lg mt-5">
                    <Link href="/account/login">Login</Link>
                </button>
            </div>
        )
    }

    return (
            <Dialog.Root>
                <Dialog.Trigger asChild>
                    <button
                    onClick={activateAccount} 
                        className='bg-stealth-orange text-xl font-semibold p-3'
                    >
                        Activate your account
                    </button>
                </Dialog.Trigger>
            </Dialog.Root>
    )
}
