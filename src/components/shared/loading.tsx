import { UpdateIcon } from "@radix-ui/react-icons"

interface LoadingProps {
	height?: number | string
	border?: boolean
	bgClassName?: string
	text?: string
}

export default function Loading({
	height = 400,
	border = false,
	bgClassName = "bg-[#0E0E0E]",
	text = "Loading data…",
}: LoadingProps) {
	const heightStyle =
		typeof height === "number" ? { height: `${height}px` } : undefined

	const heightClass = typeof height === "string" ? height : ""

	return (
		<div
			style={heightStyle}
			className={[
				"bg-black/60 inset-0 flex w-full items-center justify-center backdrop-blur-sm",
				heightClass,
				bgClassName,
				border ? "border border-[#2A2A2A]" : "",
			].join(" ")}>
			<div className="flex flex-col items-center gap-3">
				<UpdateIcon className="h-6 w-6 animate-spin text-[#F7931A]" />
				<p className="text-sm text-[#D4D4D4]">{text}</p>
			</div>
		</div>
	)
}
