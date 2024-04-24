"use client"
import { useState } from "react"

import { Avatar, Button, Dialog, Input, Spinner } from ".."
import { changePassword } from "@/app/helpers/password"
import { UserProps } from "@/types/profile"

const Security = (props: UserProps) => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [data, setData] = useState("")
	const [fields, setFields] = useState({
		confirmNewPassword: "",
		currentPassword: "",
		newPassword: "",
	})

	const displayName = props.firstName
		? `${props.firstName} ${props.lastName}`
		: props.email.split("@")[0]

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFields({ ...fields, [e.target.name]: e.target.value })

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const { confirmNewPassword, currentPassword, newPassword } = fields
		if (newPassword !== confirmNewPassword)
			return setError("Passwords don't match!")
		try {
			setLoading(true)
			const res = await changePassword({ currentPassword, newPassword })
			if (!res.success && res.status !== 200) {
				setLoading(false)
				return setError(res.message)
			}
			setLoading(false)
			setData(res?.message)
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message)
				setLoading(false)
			}
		}
	}

	return (
		<>
			<Dialog
				isOpen={Boolean(error)}
				onDismiss={() => setError("")}
				title="Password Reset Failed"
				description={error}
				titleClassName={"text-red-500"}></Dialog>
			<Dialog
				isOpen={!!data}
				onDismiss={() => setData("")}
				title="Password Reset Success"
				description={data}
				titleClassName={"text-green-500"}></Dialog>
			<div className="h-auto w-full rounded-lg border border-black-500 bg-black-700 p-10">
				<div className="flex w-full items-center justify-between">
					<div className="flex flex-wrap items-center gap-5 md:flex-nowrap">
						<div className="aspect-square w-[120px] rounded-full bg-alt-orange-100">
							<Avatar
								imageUrl={props.imageUrl}
								name={displayName}
								email={props.email}
							/>
						</div>
						<div>
							<p className="font-satoshi text-2xl font-bold capitalize">
								{displayName}
							</p>
							<p className="text-white-300">{props.email}</p>
						</div>
					</div>
				</div>
				<hr className="my-6 w-full" />
				<div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
					<div className="w-full">
						<p className="font-bold">Password</p>
						<p className="text-sm text-white-300">Reset your password here</p>
					</div>
					<form
						onSubmit={handleSubmit}
						className="col-span-1 flex w-full flex-col gap-5 md:w-2/3 lg:col-span-2">
						<Input
							typed="password"
							name="currentPassword"
							onChange={handleChange}
							label="Enter Old Password"
							required
						/>
						<Input
							typed="password"
							name="newPassword"
							onChange={handleChange}
							label="Enter New Password"
							required
						/>
						<Input
							typed="password"
							name="confirmNewPassword"
							onChange={handleChange}
							label="Confirm New Password"
							required
							error={error}
						/>
						<Button type="submit" width="w-full" disabled={loading}>
							{loading ? <Spinner /> : "Save Password"}
						</Button>
					</form>
				</div>
			</div>
		</>
	)
}

export default Security
