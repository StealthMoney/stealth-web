"use client"
import { UpdateIcon } from "@radix-ui/react-icons"
import { usePathname } from "next/navigation"
import { useRefresh } from "@/app/context/refreshProvider"

interface CurrencyToggleProps {
	selectedCurrency: "BTC" | "USDT"
	onChange: (currency: "BTC" | "USDT") => void
	showRefresh?: boolean
	onRefresh?: () => void
}

export const CurrencyToggle = ({
	selectedCurrency,
	onChange,
	showRefresh = true,
	onRefresh,
}: CurrencyToggleProps) => {
	const pathname = usePathname()
	const { isRefreshing } = useRefresh()

	return (
		<div className="mb-6 flex justify-between gap-4">
			{/* Toggle */}
			<div className="flex gap-x-2 rounded-md bg-[#0E0E0E] px-5 py-2">
				<button
					onClick={() => onChange("BTC")}
					className={`!rounded-md px-4 py-2 text-sm font-medium outline-none transition-colors ${
						selectedCurrency === "BTC"
							? "border border-[#494949] bg-[#010101] text-[#F7931A] shadow-sm shadow-[#4949490D]"
							: ""
					}`}>
					{pathname.includes("transactions") ? "BTC Transactions" : "Buy BTC"}
				</button>

				<button
					onClick={() => onChange("USDT")}
					className={`!rounded-md px-4 py-2 font-satoshi text-[16px] outline-none transition-colors ${
						selectedCurrency === "USDT"
							? "border border-[#494949] bg-[#010101] text-[#F7931A] shadow-sm shadow-[#4949490D]"
							: ""
					}`}>
					{pathname.includes("transactions") ? "USDT Transactions" : "Buy USDT"}
				</button>
			</div>

			{/* Refresh */}
			{!pathname.includes("transactions") && (
				<button
					onClick={onRefresh ?? (() => window.location.reload())}
					className="hidden items-center justify-center gap-x-4 rounded-md border border-[#494949] px-4 py-2 text-sm font-medium shadow-sm shadow-[#494949] outline-none transition-colors md:flex">
					Refresh{" "}
					<UpdateIcon
						color="#D4D4D4"
						className={isRefreshing ? "animate-spin" : ""}
					/>
				</button>
			)}
		</div>
	)
}
