"use client"
import { CaretDown } from "@phosphor-icons/react"
import React, { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { UserProps } from "@/types/profile"

interface Props {
	user: UserProps
}

const getChars = (value: string) =>
	value
		.split(" ")
		.map((char) => char.charAt(0))
		.join("")

const NavButton = (props: Props) => {
	const [openMenu, setOpenMenu] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	const displayName = props.user.firstName
		? `${props.user.firstName} ${props.user.lastName}`
		: props.user.email.split("@")[0]

	return (
		<Link className="flex items-center gap-2" href={"/dashboard/profile"}>
			<div className="mr-1 aspect-square w-8 rounded-full">
				{props.user.imageUrl ? (
					<div className="relative aspect-square w-full rounded-full">
						<Image
							src={props.user.imageUrl}
							alt={props.user.firstName}
							className="h-full w-full rounded-full object-contain"
						/>
					</div>
				) : (
					<div className="grid aspect-square w-10 place-items-center rounded-full bg-alt-orange-100">
						<p className="text-lg font-bold uppercase">{getChars(displayName)}</p>
					</div>
				)}
			</div>
			{/* // commented code below will be revisited in the future */}
			<button onClick={() => setOpenMenu(true)} className="flex items-center">
				<p className="font-satoshi text-sm font-bold">{displayName}</p>
				{/* <span>
					<CaretDown
						className={`ml-1 transition-all duration-100 ${
							openMenu ? "rotate-180" : ""
						}`}
					/>
				</span> */}
			</button>
			{openMenu && (
				<div
					ref={ref}
					className="absolute bottom-0 left-0 w-[200px] bg-black-700 p-2"></div>
			)}
		</Link>
	)
}

export default NavButton
