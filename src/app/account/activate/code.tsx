"use client"

import React from "react"
import CustomDialog from "@/components/dialog"
import Spinner from "@/components/spinner"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import circle from "../../../assets/CheckCircle.png"
import xcircle from "../../../assets/XCircle.png"
import mail from "../../../assets/Mail.png"

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
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)

    const handleOpen = () => setIsDialogOpen(true)
    const handleClose = () => setIsDialogOpen(false)

    async function activateAccount() {
        // Open the popup
        handleOpen()

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
            <CustomDialog
                isOpen={isDialogOpen}
                onDismiss={handleClose}
                title="We sent you a mail"
            >
                <div className="grid">
                    <Image
                        src={mail}
                        alt="check your email"
                        className="place-self-center"
                    />
                    <p>
                        Activate your account by clicking the link we sent to
                        your email.
                    </p>
                </div>
            </CustomDialog>
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
            <CustomDialog
                isOpen={isDialogOpen}
                onDismiss={handleClose}
                title="Account Activation Error"
            >
                <div className="grid">
                    <Image
                        src={xcircle}
                        alt="failed"
                        className="place-self-center"
                    />
                    <p>
                        Sorry! We could not activate your account. Plese try
                        again later.
                    </p>
                </div>
            </CustomDialog>
        )
    }

    if (activated) {
        return (
            <CustomDialog
                isOpen={isDialogOpen}
                onDismiss={handleClose}
                title="Account Activated!"
            >
                <div className="grid">
                    <Image
                        src={circle}
                        alt="activated!!"
                        className="place-self-center"
                    />
                    <p className="text-center text-lg pt-3">
                        Your account has been activated.
                    </p>
                    <p className="text-center text-[14px] pt-3">
                        If you are not automatically redirected{" "}
                        <Link
                            href="/account/login"
                            className="text-stealth-orange border-b border-dotted border-stealth-orange"
                        >
                            click here
                        </Link>
                    </p>
                </div>
            </CustomDialog>
        )
    }

    return (
        <main className="grid place-content-center w-screen h-screen">
            <button
                onClick={activateAccount}
                className="bg-stealth-orange text-stealth-black text-xl font-semibold p-3"
            >
                Activate your account
            </button>
        </main>
    )
}
