"use client"
import { Bell, SignOut } from "@phosphor-icons/react"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Button, Dialog, NavButton } from "@/components"
import { UserProps } from "@/types/profile"
import { logo } from "@/assets/images"
import { NavList } from "./nav-list"
import { TextAlignJustifyIcon, Cross1Icon } from "@radix-ui/react-icons"

const DashboardLayoutClient = ({
	children,
	user,
}: {
	children: React.ReactNode
	user: UserProps
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const pathname = usePathname()

	const signOutFn = async () => {
		await signOut({
			callbackUrl: "/account/login",
		})
	}

	const [mobileViewPort, setMobileViewPort] = useState(window.innerWidth)
	const [isMobileView, setIsMobileView] = useState(false)
	const [showMobileNav, setShowMobileNav] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			const newViewportWidth = window.innerWidth
			setMobileViewPort(newViewportWidth)

			if (newViewportWidth > 767) {
				setIsMobileView(false)
			} else {
				setIsMobileView(true)
			}
		}

		// Initial check
		handleResize()

		window.addEventListener("resize", handleResize)

		return () => window.removeEventListener("resize", handleResize)
	}, [])

	const toggleMobileNav = () => {
		setShowMobileNav(!showMobileNav)
	}

	return (
		<>
			<div
				className="fixed left-4 top-4 z-50 flex items-center justify-center md:hidden"
				onClick={toggleMobileNav}>
				{!showMobileNav ? (
					<TextAlignJustifyIcon width={40} height={40} color="white" />
				) : (
					<Cross1Icon width={40} height={40} color="white" />
				)}
			</div>
			<Dialog
				isOpen={isOpen}
				onDismiss={() => setIsOpen(false)}
				title="Log Out"
				description="Do you really want to sign out?"
				type="error"
				large>
				<div className="mt-10 flex w-3/5 items-center justify-between">
					<Button
						type="button"
						onClick={() => setIsOpen(false)}
						width="bg-black-600 w-[160px] mx-2">
						Cancel
					</Button>
					<Button type="button" onClick={signOutFn} width="w-[160px] mx-2">
						Log Out
					</Button>
				</div>
			</Dialog>
			<main className="flex h-screen w-screen items-start overflow-hidden bg-black-100 text-white-100">
				<div
					className={`fixed left-0 top-0 ${
						!showMobileNav ? "hidden" : "flex"
					} h-full w-full flex-col justify-between border-r border-black-500 bg-black-100 p-6 md:static md:flex md:w-1/5`}>
					<div className="flex w-full flex-col gap-12">
						<div className="flex w-full justify-end md:justify-start">
							<Image src={logo} alt="" className="w-[100px]" />
						</div>
						<div className="flex w-full flex-col gap-6">
							{NavList.map((item, index) => (
								<Link
									key={index}
									href={item.path}
									onClick={toggleMobileNav}
									className={`flex items-center gap-2 rounded-lg p-3 font-satoshi font-medium capitalize transition-all duration-300 hover:bg-black-800 ${
										pathname === item.path
											? "border border-black-500 bg-black-800 text-alt-orange-100"
											: ""
									}`}>
									{item.icon} {item.label}
								</Link>
							))}
						</div>
					</div>
					<button
						onClick={() => setIsOpen(true)}
						className="flex items-center gap-2 rounded-lg p-3 font-satoshi font-medium text-red-800 transition-all duration-300 hover:bg-red-800 hover:text-white-100">
						<SignOut size={24} /> Log Out
					</button>
				</div>
				<div className="flex h-full w-4/5 flex-1 flex-col">
					<div className="flex w-full items-center justify-end border-b border-black-500 p-6 md:justify-between">
						<p className="hidden font-satoshi text-xl font-bold md:flex">Dashboard</p>
						<div className="flex items-center gap-5">
							<button className="rounded-full border p-2">
								<Bell />
							</button>
							<NavButton user={user} />
						</div>
					</div>
					<div className="w-full overflow-y-auto p-6">{children}</div>
				</div>
			</main>
		</>
	)
}

export default DashboardLayoutClient
