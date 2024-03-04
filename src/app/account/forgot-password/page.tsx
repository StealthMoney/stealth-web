"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

import { Button, Dialog, Input, Spinner } from "@/components"

const Page = () => {
	const router = useRouter()

	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [email, setEmail] = useState("")
	const [error, setError] = useState("")

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			setLoading(true)
			const res = await fetch("/api/reset-init", {
				method: "POST",
				body: JSON.stringify({ email }),
				headers: {
					"Content-Type": "application/json",
				},
			})
			if (res && !res.ok) {
				setError(await res.text())
			}
			setEmail("")
			setLoading(false)
			setSuccess(true)
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message)
			}
			setLoading(false)
		}
	}

	return (
		<>
			{error && (
				<Dialog
					isOpen={error !== ""}
					onDismiss={() => setError("")}
					title="Reset Error!"
					type="error"
					large
					description="An error occurred. Please try again."></Dialog>
			)}
			{success && (
				<Dialog
					isOpen={success}
					onDismiss={() => setSuccess(false)}
					title="Success!"
					type="success"
					large
					description="Instructions to reset your password has been sent to your mail."></Dialog>
			)}
			<div className="h-full w-full relative">
				<p className="font-satoshi text-[28px] font-bold">Forgot your Password?</p>
				<p className="font-satoshi text-lg">
					If you forgot your password, please enter the email address associated with
					your account to reset your password.
				</p>
				<form onSubmit={handleSubmit} className="mt-10 flex w-full flex-col">
					<div className="flex w-full flex-col gap-6">
						<Input
							typed="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							label="Email Address"
						/>
					</div>
					<div className="mt-[450px] flex w-full flex-col gap-5 absolute lg:bottom-0 bottom-0">
						<div className="grid w-full grid-cols-2 gap-6">
							<Button
								type="button"
								onClick={() => router.back()}
								width="w-full bg-black-600">
								Back to Log In
							</Button>
							<Button type="submit" width="w-full" disabled={loading}>
								{loading ? <Spinner /> : "Send Reset Email"}
							</Button>
						</div>
						<p className="flex items-center justify-center text-center">
							Don&apos;t have an account yet?
							<Link href="/account/register" className="link ml-1 text-alt-orange-100">
								Create account
							</Link>
						</p>
					</div>
				</form>
			</div>
		</>
	)
}

export default Page
