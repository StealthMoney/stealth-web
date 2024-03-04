"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"

import { Button, Dialog, Input, Spinner } from "@/components"

const Page = () => {
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"
	const router = useRouter()

	const [formFields, setFormFields] = useState({ email: "", password: "" })
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFormFields({ ...formFields, [e.target.name]: e.target.value })

	const formAction = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!formFields.email || !formFields.password) {
			return setError("Incomplete fields!")
		}
		setLoading(true)
		try {
			const res = await signIn("credentials", {
				username: formFields.email,
				password: formFields.password,
				redirect: false,
				callbackUrl,
			})
			if (res && !res.ok) {
				setError(String(res.error))
				setLoading(false)
				return
			}
			setLoading(false)
			router.push(callbackUrl)
		} catch (error) {
			if (error instanceof Error) {
				setError(String(error.message))
				setLoading(false)
			}
		}
	}

	return (
		<>
			{error && (
				<Dialog
					isOpen={error !== ""}
					onDismiss={() => setError("")}
					title="Login Error!"
					type="error"
					large
					description="Invalid credentials. Please check and retry.">
					<div></div>
				</Dialog>
			)}
			<div className="relative w-full">
				<p className="font-satoshi text-[28px] font-bold">Welcome Back!</p>
				<p className="text-lg">
					Please enter your login credentials to access your account
				</p>
				<form
					onSubmit={formAction}
					className="mt-10 flex h-screen w-full flex-col gap-28">
					<div className="flex w-full flex-col gap-6">
						<Input
							typed="email"
							name="email"
							onChange={handleChange}
							label="Email Address"
							required
						/>
						<Input
							typed="password"
							name="password"
							onChange={handleChange}
							label="Password"
							required
						/>
						<div className="flex w-full justify-end">
							<Link
								href="/account/forgot-password"
								className="link text-alt-orange-100">
								Forgot Password
							</Link>
						</div>
					</div>
					<div className="absolute bottom-80 flex w-full flex-col gap-5 lg:bottom-56">
						<Button type="submit" width="w-full" disabled={loading}>
							{loading ? <Spinner /> : "Log In"}
						</Button>
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
