"use client"

import { CheckCircle, WarningCircle, XCircle } from "@phosphor-icons/react"
import { Cross2Icon } from "@radix-ui/react-icons"
import * as Dialog from "@radix-ui/react-dialog"
import React from "react"

interface CustomDialogProps {
	children?: React.ReactNode
	isOpen: boolean
	onDismiss: () => void
	title?: string
	titleClassName?: string
	description?: string
	descriptionClassName?: string
	overlayStyle?: string
	large?: boolean
	type?: "error" | "success" | "warning" | "info"
}

const DialogIcon = {
	error: <XCircle weight="fill" className="my-8 text-9xl text-red-100" />,
	success: (
		<CheckCircle weight="fill" className="my-8 text-9xl text-green-100" />
	),
	warning: (
		<WarningCircle weight="fill" className="my-8 text-9xl text-orange-100" />
	),
	info: <WarningCircle weight="fill" className="my-8 text-9xl text-blue-500" />,
}

const CustomDialog = ({
	children,
	isOpen,
	onDismiss,
	title,
	titleClassName,
	description,
	descriptionClassName,
	type,
	large,
	overlayStyle = "data-[state=open]:animate-overlayShow",
}: CustomDialogProps) => {
	return (
		<Dialog.Root open={isOpen} onOpenChange={onDismiss}>
			<Dialog.Trigger asChild />
			<Dialog.Portal>
				<Dialog.Overlay
					className={`${overlayStyle} data-[state=open]:animate-overlayShow fixed inset-0 bg-white-100/40`}
				/>
				<Dialog.Content
					className={`data-[state=open]:animate-contentShow fixed left-[50%] top-[55%] flex max-h-[90%] w-[90vw] translate-x-[-50%] translate-y-[-50%] flex-col items-center overflow-y-auto rounded-[6px] bg-black-100 p-[30px] text-white-100 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none md:left-[60%] lg:left-[50%] lg:top-[50%] ${
						large ? "max-w-[750px]" : "max-w-[528px]"
					}`}>
					{type && DialogIcon[type]}
					<Dialog.Title
						className={`m-0 font-satoshi text-4xl font-bold ${titleClassName || ""}`}>
						{title}
					</Dialog.Title>
					<Dialog.Description
						className={`mb-5 mt-[10px] text-center text-lg leading-normal ${
							descriptionClassName || ""
						}`}>
						{description}
					</Dialog.Description>
					{children}
					<Dialog.Close asChild>
						<button
							className="text-white absolute -right-7 -top-10 inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full bg-black-100 hover:bg-slate-800 focus:shadow-[0_0_0_2px] focus:shadow-black-500 focus:outline-none"
							aria-label="Close">
							<Cross2Icon />
						</button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

export default CustomDialog
