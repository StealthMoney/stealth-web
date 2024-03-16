"use client"
import Link, { LinkProps } from "next/link"
import { ComponentProps } from "react"

type Props =
	| (ComponentProps<"button"> & {
			as?: "button"
			width?: string
			textSize?: string
	  })
	| (LinkProps & {
			as: "link"
			width?: string
			textSize?: string
			children: React.ReactNode
	  })
	| (ComponentProps<"a"> & {
			as: "a"
			width?: string
			textSize?: string
			children: React.ReactNode
	  })

const Button = (props: Props) => {
	if (props.as === "link") {
		return (
			<Link
				className={`text-white flex h-[60px] items-center justify-center gap-1 rounded bg-alt-orange-100 px-4 font-satoshi ${
					props.textSize ? props.textSize : "text-sm"
				} font-medium transition-all duration-200 active:scale-[0.98] ${
					props.width ? props.width : "w-fit"
				}`}
				{...props}>
				{props.children}
			</Link>
		)
	}

	if (props.as === "a") {
		return (
			<a
				className={`text-white flex h-[60px] items-center justify-center gap-1 rounded bg-alt-orange-100 px-4 font-satoshi ${
					props.textSize ? props.textSize : "text-sm"
				} font-medium transition-all duration-200 active:scale-[0.98] ${
					props.width ? props.width : "w-fit"
				}`}
				{...props}>
				{props.children}
			</a>
		)
	}

	return (
		<button
			className={`text-white flex h-[60px] items-center justify-center gap-1 rounded bg-alt-orange-100 px-4 font-satoshi ${
				props.textSize ? props.textSize : "text-sm"
			} font-medium transition-all duration-200 active:scale-[0.98] ${
				props.width ? props.width : "w-fit"
			}`}
			{...props}>
			{props.children}
		</button>
	)
}

export default Button
