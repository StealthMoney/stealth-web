"use client"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import Link from "next/link"

import { Button, Dialog, Input, Spinner } from "@/components"
import { PASSWORD_REGEX } from "@/config/constants"
const Page = () => {
	const [formFields, setFormFields] = useState({
		email: "",
		password: "",
		confirm_password: "",
	})
	const [data, setData] = useState({ message: "", success: false })
	const [passwordsMatch, setPasswordsMatch] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const { isPending, mutateAsync } = useMutation({
		mutationFn: (payload: { email: string; password: string }) =>
			fetch("/api/register", {
				method: "POST",
				body: JSON.stringify({
					email: payload.email,
					password: payload.password,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			}),
		mutationKey: ["register"],
		onSuccess: (res) => {
			res
				.json()
				.then((data: { success: boolean; message: string }) => {
					if (!data.success) {
						setError(new Error(data.message))
					} else {
						setData(data)
					}
				})
				.catch((err) => {
					console.log({ err })
					setError(new Error("Failed to parse response"))
				})
		},
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFormFields({ ...formFields, [e.target.name]: e.target.value })

	const formAction = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const isValid = PASSWORD_REGEX.test(formFields.password)
		if (!isValid) {
			alert("Password is not strong enough!")
			return
		}
		if (!passwordsMatch) {
			alert("Passwords do not match!")
			return
		}
		mutateAsync({ email: formFields.email, password: formFields.password })
	}

	useEffect(() => {
		setPasswordsMatch(formFields.password === formFields.confirm_password)
	}, [formFields.confirm_password, formFields.password])

	return (
		<>
			<Dialog
				isOpen={!!error}
				onDismiss={() => setError(null)}
				title="Registration Error"
				type="error"
				large
				description={error?.message}>
				<div></div>
			</Dialog>
			<Dialog
				isOpen={data.success}
				onDismiss={() => {
					setData({ message: "", success: false })
					if (data.success) {
						setFormFields({ email: "", password: "", confirm_password: "" })
					}
				}}
				title="Account Created Successfully!"
				type="success"
				large
				description={"Please check your e-mail to activate your account"}>
				<div></div>
			</Dialog>
			<div className="h-full w-full">
				<p className="font-satoshi text-[28px] font-bold">Come On Board</p>
				<p className="text-lg">
					It&apos;s not your Bitcoin until you self-custody it. Start your journey to
					becoming a Bitcoin owner today.
				</p>
				<form
					onSubmit={(e) => formAction(e)}
					className="mt-10 flex h-full w-full flex-col gap-2">
					<div className="flex w-full flex-col gap-6">
						<Input
							typed="email"
							name="email"
							onChange={handleChange}
							label="Email Address"
						/>
						<Input
							typed="password"
							name="password"
							onChange={handleChange}
							label="Password"
						/>
						<Input
							typed="password"
							name="confirm_password"
							onChange={handleChange}
							label="Confirm Password"
							error={passwordsMatch ? "" : "Passwords do not match"}
						/>
					</div>
					<div className="mt-[270px] flex w-full flex-col gap-5">
						<Button type="submit" width="w-full" disabled={isPending}>
							{isPending ? <Spinner /> : "Create Account"}
						</Button>
						<p className="flex items-center justify-center text-center">
							Already have an account?
							<Link href="/account/login" className="link ml-1 text-alt-orange-100">
								Log In
							</Link>
						</p>
					</div>
				</form>
			</div>
		</>
	)
}

export default Page
