"use client"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import Link from "next/link"
import { useRecaptcha } from "@/shared/recaptcha"

import { Button, Dialog, Input, Spinner } from "@/components"
import { PASSWORD_REGEX, EMAIL_REGEX } from "@/config/constants"

const Page = () => {
	const isDev = process.env.NODE_ENV === "development"
	const [formFields, setFormFields] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirm_password: "",
	})
	const [data, setData] = useState({ message: "", success: false })
	const [error, setError] = useState<Error | null>(null)
	const [captchaError, setCaptchaError] = useState<string | null>(null)

	const passwordWarning =
		formFields.password !== "" && !PASSWORD_REGEX.test(formFields.password)

	const passwordsMatch =
		formFields.password !== "" &&
		formFields.confirm_password !== "" &&
		formFields.password === formFields.confirm_password

	const { isPending, mutateAsync } = useMutation({
		mutationFn: (payload: {
			firstName: string
			lastName: string
			email: string
			password: string
			action: string | null
			token: string | null
		}) =>
			fetch("/api/register", {
				method: "POST",
				body: JSON.stringify({
					firstName: payload.firstName,
					lastName: payload.lastName,
					email: payload.email,
					password: payload.password,
					recaptchaAction: payload.action,
					recaptchaToken: payload.token,
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
		onError: () => {
			setError(new Error("Something went wrong. Please try again."))
		},
	})

	const { getToken } = useRecaptcha()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFormFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))

	const formAction = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const trimmedFirstName = formFields.firstName.trim()
		const trimmedLastName = formFields.lastName.trim()
		const trimmedmail = formFields.email.trim()

		if (!trimmedmail || trimmedmail === "") {
			alert("Enter a valid email address!")
			return
		} else if (!EMAIL_REGEX.test(trimmedmail)) {
			alert("Email given is not a valid mail format")
			return
		}

		setCaptchaError(null)
		const isValid = PASSWORD_REGEX.test(formFields.password)
		if (!isValid) {
			alert("Password is not strong enough!")
			return
		}
		if (!passwordsMatch) {
			alert("Passwords do not match!")
			return
		}

		let action = "verify_registration"
		let recaptchaToken = null
		if (!isDev) {
			try {
				recaptchaToken = await getToken(action)
			} catch (err) {
				console.error("reCAPTCHA error:", err)
				setCaptchaError("reCAPTCHA failed. Please refresh and try again.")
				return
			}
		}

		if (!recaptchaToken && !isDev) {
			setCaptchaError("Unable to verify you. Please refresh and try again.")
			return
		}

		mutateAsync({
			firstName: trimmedFirstName,
			lastName: trimmedLastName,
			email: trimmedmail,
			password: formFields.password,
			action: isDev ? null : action,
			token: recaptchaToken,
		})
	}

	const isFormInvalid =
		!formFields.email ||
		formFields.email === "" ||
		!EMAIL_REGEX.test(formFields.email) ||
		!PASSWORD_REGEX.test(formFields.password) ||
		!passwordsMatch

	return (
		<>
			<Dialog
				isOpen={!!error && !error.message.includes("reCAPTCHA")}
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
						setFormFields({
							firstName: "",
							lastName: "",
							email: "",
							password: "",
							confirm_password: "",
						})
					}
				}}
				title="Account Created Successfully!"
				type="success"
				large
				description={
					"Please check your mail inbox or spam folder to activate your account"
				}>
				<div></div>
			</Dialog>
			<div className="relative h-full w-full overflow-auto">
				<p className="font-satoshi text-[28px] font-bold">Come On Board</p>
				<p className="text-lg">
					It&apos;s not your Bitcoin until you self-custody it. Start your journey to
					becoming a Bitcoin owner today.
				</p>
				<form
					onSubmit={(e) => formAction(e)}
					className="mt-10 flex h-full w-full flex-col">
					<div className="flex w-full flex-col gap-6">
						<div className="flex w-full flex-col md:flex-row">
							<div className="md:2/4 mr-2 w-full md:w-2/4">
								<Input
									typed="text"
									name="firstName"
									onChange={handleChange}
									label="First Name"
								/>
							</div>

							<div className="my-5 w-full md:mx-2 md:my-auto md:w-2/4">
								<Input
									typed="text"
									name="lastName"
									onChange={handleChange}
									label="Last Name"
								/>
							</div>
						</div>

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
							error={
								passwordWarning && formFields.password !== ""
									? "Include at least one uppercase letter, one number and one symbol."
									: ""
							}
						/>
						<Input
							typed="password"
							name="confirm_password"
							onChange={handleChange}
							label="Confirm Password"
							error={passwordsMatch ? "" : "Passwords do not match"}
						/>
						{(captchaError || error?.message?.includes("reCAPTCHA")) && (
							<p className="mb-3 text-center text-sm text-[#B31919]">
								{captchaError || error?.message}
							</p>
						)}
					</div>
					<div className="mt-20 flex w-full flex-col">
						<Button
							isDisabled={isPending || isFormInvalid}
							type="submit"
							width="w-full"
							disabled={isPending || isFormInvalid}>
							{isPending ? <Spinner /> : "Create Account"}
						</Button>
						<p className="mt-4 flex items-center justify-center text-center">
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
