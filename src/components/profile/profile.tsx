"use client"
import { PencilSimpleLine } from "@phosphor-icons/react"
import { useState } from "react"

import { Avatar, Button, Dialog, Input } from ".."
import { UserProps } from "@/types/profile"
import EditProfile from "./edit-profile"

const Profile = (props: UserProps) => {
	const [openModal, setOpenModal] = useState(false)

	const displayName = props.firstName
		? `${props.firstName} ${props.lastName}`
		: props.email.split("@")[0]

	return (
		<>
			<Dialog isOpen={openModal} onDismiss={() => setOpenModal(false)} large>
				<div className="min-h-[50dvh] w-full md:w-3/4 bg-black-100">
					<EditProfile user={props} onDismiss={() => setOpenModal(false)} />
				</div>
			</Dialog>
			<div className="h-auto w-full rounded-lg border border-black-500 bg-black-700 p-10">
				<div className="flex w-full items-center justify-between lg:flex-row flex-col">
					<div className="flex items-center gap-5 md:flex-nowrap flex-wrap md:mb-auto mb-2">
						<div className="aspect-square w-[120px] rounded-full bg-alt-orange-100 lg:my-auto my-2">
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
					<Button type="button" width="w-[147px]" onClick={() => setOpenModal(true)}>
						<PencilSimpleLine size={20} /> Edit Profile
					</Button>
				</div>
				<hr className="my-6 w-full" />
				<div className="grid w-full lg:grid-cols-3 grid-cols-1 gap-5">
					<div className="w-full">
						<p className="font-bold">Person Information</p>
						<p className="text-sm text-white-300">
							Update your personal details here.
						</p>
					</div>
					<div className="lg:col-span-2 col-span-1 flex lg:w-2/3 w-full flex-col gap-5">
						<div className="grid w-full md:grid-cols-2 grid-cols-1 gap-5">
							<Input
								typed="text"
								defaultValue={props.firstName}
								label="First Name"
								disabled
							/>
							<Input
								typed="text"
								defaultValue={props.lastName}
								label="Last Name"
								disabled
							/>
						</div>
						<Input
							typed="email"
							defaultValue={props.email}
							label="Email Address"
							disabled
						/>
						<div className="hidden">
							<Input typed="text" label="Wallet Address" disabled />
							<Input typed="text" label="Nationality" disabled />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Profile
