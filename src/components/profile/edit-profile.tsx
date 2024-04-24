"use client"
import { useState } from "react"

import { updateProfile } from "@/app/helpers/get-profile"
import { Button, Input, Spinner } from ".."
import { UserProps } from "@/types/profile"

interface Props {
	onDismiss: () => void
	user: UserProps
}

const EditProfile = (props: Props) => {
	const [loading, setLoading] = useState(false)
	const [fields, setFields] = useState({
		firstName: props.user.firstName,
		lastName: props.user.lastName,
		email: props.user.email,
		login: props.user.email,
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFields({ ...fields, [e.target.name]: e.target.value })

	const handleSubmit = async () => {
		try {
			setLoading(true)
			await updateProfile(fields)
			setLoading(false)
		} catch (error) {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="w-full">
			<p className="font-satoshi text-[28px] font-bold">Edit Profile</p>
			<div className="mt-9 flex w-full flex-col gap-6">
				<div className="grid w-full md:grid-cols-2 grid-cols-1 gap-6">
					<Input
						typed="text"
						name="firstName"
						onChange={handleChange}
						label="First Name"
						defaultValue={props.user.firstName}
					/>
					<Input
						typed="text"
						name="lastName"
						onChange={handleChange}
						label="Last Name"
						defaultValue={props.user.lastName}
					/>
				</div>
				<div className="grid w-full md:grid-cols-2 grid-cols-1 gap-6">
					<Input
						typed="text"
						name="email"
						onChange={handleChange}
						label="Email Address"
						defaultValue={props.user.email}
					/>
					{/* <Input
						typed="text"
						name="nationality"
						onChange={handleChange}
						label="Nationality"
					/> */}
				</div>
				{/* <Input
					typed="text"
					name="walletAddress"
					onChange={handleChange}
					label="Wallet Address"
				/> */}
			</div>
			<div className="mt-36 grid w-full grid-cols-2 gap-6">
				<Button type="button" onClick={props.onDismiss} width="w-full bg-black-600">
					Discard
				</Button>
				<Button type="submit" width="w-full">
					{loading ? <Spinner /> : "Save Changes"}
				</Button>
			</div>
		</form>
	)
}

export default EditProfile
