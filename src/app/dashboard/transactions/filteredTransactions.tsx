"use client"
import { useState, useMemo } from "react"
import TransactionsTable from "@/components/transactions-table"
import Form from "./form"
import { PaymentDetail } from "@/types/price"
import { CurrencyToggle } from "@/components/shared/CurrencyBuyTabOption"
import {
	handleCurrencyChange,
	getPaginationRange,
	handlePageChange,
} from "@/shared/functions"
import { useSearchParams, useRouter } from "next/navigation"

export default function FilteredTransactions({
	initialTransactions,
	totalPages,
	currentPage,
}: {
	initialTransactions: PaymentDetail[]
	totalPages: number
	currentPage: number
}) {
	const [query, setQuery] = useState("")

	const router = useRouter()
	const searchParams = useSearchParams()

	const assetParam = searchParams.get("assetCurrency")
	const selectedCurrency: "BTC" | "USDT" = assetParam === "USDT" ? "USDT" : "BTC"

	console.log(selectedCurrency, "tat")

	const filteredTransactions = useMemo(() => {
		if (!query) return initialTransactions

		const lower = query.toLowerCase().trim()
		const cleanQuery = lower.replace(/,/g, "") // remove commas from query

		return initialTransactions.filter((tx) => {
			const createdDate = new Date(tx.createdDate)

			// Date parts
			const day = String(createdDate.getDate())
			const monthName = createdDate
				.toLocaleString("default", { month: "long" })
				.toLowerCase()
			const shortMonth = createdDate
				.toLocaleString("default", { month: "short" })
				.toLowerCase()
			const dateStr = createdDate.toISOString().split("T")[0]

			// Amounts
			const rawAmount = String(tx.amount)
			const formattedAmount = (+tx.amount).toLocaleString()
			const formattedAmountNoComma = formattedAmount.replace(/,/g, "")

			// Possible date patterns
			const datePatterns = [
				`${day} ${monthName}`,
				`${monthName} ${day}`,
				`${day} ${shortMonth}`,
				`${shortMonth} ${day}`,
			]

			return (
				monthName.includes(lower) ||
				shortMonth.includes(lower) ||
				dateStr.includes(lower) ||
				datePatterns.some((pattern) => pattern.includes(lower)) ||
				rawAmount.includes(cleanQuery) ||
				formattedAmountNoComma.includes(cleanQuery)
			)
		})
	}, [query, initialTransactions])

	return (
		<div className="h-4/5 w-full">
			<div className="mb-6 flex w-full flex-col items-center justify-between lg:flex-row">
				<p className="font-satoshi text-2xl font-bold capitalize">Transactions</p>
				<Form query={query} setQuery={setQuery} />
			</div>

			<CurrencyToggle
				selectedCurrency={selectedCurrency}
				onChange={(value) => handleCurrencyChange(value, router, searchParams)}
			/>
			<TransactionsTable
				chosenCurrency={selectedCurrency}
				transactions={filteredTransactions}
			/>
			<div className="mt-4 flex items-center justify-center gap-2 pb-4">
				{getPaginationRange(currentPage, totalPages).map((page, i) =>
					page === "..." ? (
						<span key={`ellipsis-${i}`} className="px-2 text-[#494949]">
							...
						</span>
					) : (
						<button
							key={page}
							onClick={() => handlePageChange(page as number, searchParams, router)}
							className={`rounded border px-3 py-1 text-sm ${
								currentPage === page
									? "text-black border-[#F7931A] bg-[#F7931A]"
									: "text-white border-[#494949] bg-transparent hover:border-[#F7931A]"
							}`}>
							{(page as number) + 1}
						</button>
					)
				)}
			</div>
		</div>
	)
}
