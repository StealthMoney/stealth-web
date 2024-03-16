"use client"
import { CheckCircle, Copy } from "@phosphor-icons/react"
import React, { useRef } from "react"
import { Button } from ".."

interface Props {
	generatedLink: string
}

const Success = (props: Props) => {
	const generatedLinkRef = useRef<HTMLParagraphElement | null>(null)

	const handleClick = () => {
		const paragraphText = generatedLinkRef.current?.textContent
		if (paragraphText) {
			navigator.clipboard
				.writeText(paragraphText)
				.then(() => window.alert("Text copied to clipboard"))
				.catch(() => window.alert("Could not copy text: "))
		}else{
			window.alert("No Link generated")
		}
	}

	return (
		<div className="flex h-full w-full flex-col justify-center items-center text-white-100">
			<div className="my-8">
				<CheckCircle weight="fill" className="text-9xl text-green-100" />
			</div>
			<p className="font-satoshi text-4xl font-bold">Successful</p>
			<p className="my-4 text-center text-xl text-black-300">
				Your payment link as been generated successful. Copy and send to third party
				to purchase Bitcoin into your wallet.
			</p>

			<p ref={generatedLinkRef}>{props.generatedLink}</p>

			<div className="w-full mt-20">
				<Button
					type="button"
					onClick={handleClick}
					width={`mx-auto w-full bg-alt-orange-100
				}`}>
					<Copy size={14} /> Copy Generated Link
				</Button>
			</div>
		</div>
	)
}

export default Success
