"use client"
import { CheckCircle, Copy } from "@phosphor-icons/react"
import React, { useRef } from "react"
import { Button } from ".."

interface Props {
	generatedLink: string
}

const Success = (props: Props) => {
	const handleClick = () => {
		if (props.generatedLink) {
			navigator.clipboard
				.writeText(props.generatedLink)
				.then()
				.catch(() => window.alert("Failed to copy link"))
		} else {
			window.alert("No Link generated")
		}
	}

	return (
		<div className="flex h-full w-full flex-col items-center justify-center text-white-100">
			<div className="my-8">
				<CheckCircle weight="fill" className="text-9xl text-green-100" />
			</div>
			<p className="font-satoshi text-4xl font-bold">Successful</p>
			<p className="my-4 text-center text-xl text-black-300">
				Your payment link as been generated successful. Copy and send to third party
				to purchase Bitcoin into your wallet.
			</p>

			<div className="mt-20 w-full">
				<Button
					type="button"
					onClick={handleClick}
					width={`mx-auto w-full bg-alt-orange-100}`}
					textSize="text-base">
					<Copy size={14} /> Copy Generated Link
				</Button>
			</div>
		</div>
	)
}

export default Success
