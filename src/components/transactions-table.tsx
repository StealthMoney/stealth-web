"use client"

import { useState } from "react"
import * as Select from "@radix-ui/react-select"
import { ChevronDownIcon } from "@radix-ui/react-icons"

import { formatBtcAddress } from "@/app/helpers/string"
import { formatCurrency } from "@/app/helpers/amount"
import TransactionItem from "./transaction-item"
import { formatDate } from "@/app/helpers/time"
import { Dialog } from "."
import { PaymentDetail, PaymentStatusProps, fetchMeta } from "@/types/price"
import { SATS_PER_BTC } from "@/config/constants"

interface Props {
	transactions: PaymentDetail[]
	pricePerUsd?: number
	chosenCurrency: "USDT" | "BTC"
}

const StatusColor = {
	SUCCESSFUL: "text-[#199B2E]",
	PROCESSING: "text-[#F7931A]",
	INITIATED: "text-[#F7931A]",
	FAILED: "text-[#B31919]",
}

const TransactionsTable = ({
	transactions,
	pricePerUsd = 1,
	chosenCurrency,
}: Props) => {
	const [currency, setCurrency] = useState("NGN")
	const [showAll, setShowAll] = useState(false)

	const displayedTransactions = showAll ? transactions : transactions.slice(0, 4)

	return (
		<>
			<div className="w-full rounded-lg border border-[#494949] bg-[#0E0E0E] p-6 text-white-300">
				<div className="flex items-center gap-x-4">
					<div className="flex items-center gap-x-4">
						<span className="text-white font-satoshi font-bold">
							Recent Transactions
						</span>

						<span className="h-5 w-px bg-[#494949]" />

						<button
							onClick={() => setShowAll(!showAll)}
							className="text-sm font-medium text-[#F7931A] transition-colors hover:text-[#F7931A]/20">
							{!showAll ? "See All" : "Show Recent"}
						</button>
					</div>
				</div>

				<div className="overflow-auto">
					<div className="hidden w-full lg:flex lg:flex-col">
						<TableHead currency={currency} setCurrency={setCurrency} />
						<TableBody
							transactions={displayedTransactions}
							currency={currency}
							pricePerUsd={pricePerUsd}
							chosenCurrency={chosenCurrency}
						/>
					</div>

					{/* Mobile View */}
					<div className="flex lg:hidden">
						<MobileTableBody
							transactions={displayedTransactions}
							currency={currency}
							pricePerUsd={pricePerUsd}
							chosenCurrency={chosenCurrency}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default TransactionsTable

export const TableHead = ({
	currency,
	setCurrency,
}: {
	currency: string
	setCurrency: (value: string) => void
}) => (
	<div className="mb-4 w-full">
		<div className="flex items-center gap-2 border-b border-gray-700 px-4 py-5">
			<div className="w-[10%] text-sm font-medium text-[#AAAAAA]">No.</div>
			<div className="w-[15%] text-sm font-medium text-[#AAAAAA]">Date</div>
			<div className="flex w-[15%] items-center gap-2">
				<span className="text-sm font-medium text-[#AAAAAA]">Amount</span>
				<Select.Root value={currency} onValueChange={setCurrency} disabled>
					<Select.Trigger className="text-white flex items-center gap-1 rounded border border-gray-600 bg-[#010101] px-2 py-1 text-sm font-medium hover:border-gray-500">
						<Select.Value />
					</Select.Trigger>
					<Select.Portal>
						<Select.Content className="z-50 rounded-md border border-[#2B2B2B] bg-[#494949] shadow-lg">
							<Select.Viewport className="p-1">
								<Select.Item
									value="NGN"
									className="flex cursor-pointer items-center rounded px-3 py-2 hover:bg-[#010101]/20 data-[state=checked]:bg-[#010101] data-[state=checked]:text-[#ffffff]">
									<Select.ItemText className="text-white">NGN</Select.ItemText>
								</Select.Item>
								<Select.Item
									value="USD"
									className="flex cursor-pointer items-center rounded px-3 py-2 hover:bg-[#010101]/20 data-[state=checked]:bg-[#010101] data-[state=checked]:text-[#ffffff]">
									<Select.ItemText className="text-white">USD</Select.ItemText>
								</Select.Item>
							</Select.Viewport>
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			</div>
			<div className="w-[20%] text-sm font-medium text-gray-400">Value</div>
			<div className="w-[25%] text-sm font-medium text-gray-400">
				Wallet Address
			</div>
			<div className="w-[15%] text-right text-sm font-medium text-gray-400">
				Status
			</div>
		</div>
	</div>
)

export const TableBody = ({
	transactions,
	currency,
	pricePerUsd,
	chosenCurrency,
}: {
	transactions: PaymentDetail[]
	currency: string
	pricePerUsd: number
	chosenCurrency: "USDT" | "BTC"
}) => {
	const [selected, setSelected] = useState<PaymentDetail | null>(null)

	const formatAmount = (amount: number, curr: string) => {
		if (curr === "USD") {
			const usdAmount = amount / pricePerUsd
			return `$${usdAmount.toLocaleString("en-US", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})}`
		}
		return `₦${amount.toLocaleString("en-NG", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})}`
	}

	return (
		<>
			<Dialog isOpen={!!selected} onDismiss={() => setSelected(null)}>
				{selected && (
					<TransactionItem
						chosenCurrency={chosenCurrency}
						transaction={selected}
						close={() => setSelected(null)}
					/>
				)}
			</Dialog>
			<div className="w-full">
				{!transactions.length ? (
					<div className="grid w-full place-items-center py-20">
						<p className="font-satoshi text-xl font-medium">No transactions yet.</p>
					</div>
				) : (
					<div className="space-y-4">
						{transactions
							.sort(
								(a, b) =>
									Number(new Date(b?.createdDate)) - Number(new Date(a?.createdDate))
							)
							.map((transaction, index) => (
								<div
									key={transaction?.id}
									onClick={() => setSelected(transaction)}
									className="flex w-full cursor-pointer items-center gap-2 rounded-none px-4 py-4 transition-colors hover:bg-gray-900">
									<div className="w-[10%] text-sm text-gray-300">{index + 1}</div>
									<div className="w-[15%] text-sm text-gray-300">
										{formatDate(new Date(transaction?.createdDate))}
									</div>
									<div className="w-[15%] text-sm text-gray-300">
										{formatAmount(+transaction?.amountDue || 0, currency)}
									</div>
									<div className="w-[20%] text-sm text-gray-300">
										{chosenCurrency === "BTC"
											? (Number(transaction?.assetAmount) / SATS_PER_BTC || 0).toFixed(8)
											: Number(transaction.assetAmount).toFixed(8)}{" "}
									</div>
									<div className="w-[25%] text-sm text-gray-300">
										{formatBtcAddress(transaction.walletAddress ?? "")}
									</div>
									<div className="flex w-[15%] justify-end">
										<p
											className={`w-fit rounded border bg-[#010101] px-2 py-1 text-[10px] font-medium capitalize ${
												StatusColor[transaction?.paymentState]
											}`}>
											{transaction?.paymentState?.split("_").join(" ")}
										</p>
									</div>
								</div>
							))}
					</div>
				)}
			</div>
		</>
	)
}

export const MobileTableBody = ({
	transactions,
	currency,
	pricePerUsd,
	chosenCurrency,
}: {
	transactions: PaymentDetail[]
	currency: string
	pricePerUsd: number
	chosenCurrency: "USDT" | "BTC"
}) => {
	const [selected, setSelected] = useState<PaymentDetail | null>(null)

	const formatAmount = (amount: number, curr: string) => {
		if (curr === "USD") {
			const usdAmount = amount / pricePerUsd
			return `$${usdAmount.toLocaleString("en-US", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})}`
		}
		return `₦${amount.toLocaleString("en-NG", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})}`
	}

	return (
		<>
			<Dialog isOpen={!!selected} onDismiss={() => setSelected(null)}>
				{selected && (
					<TransactionItem
						chosenCurrency={chosenCurrency}
						transaction={selected}
						close={() => setSelected(null)}
					/>
				)}
			</Dialog>
			<div className="w-full space-y-4">
				{!transactions.length ? (
					<div className="grid w-full place-items-center py-20">
						<p className="font-satoshi text-xl font-medium">No transactions yet.</p>
					</div>
				) : (
					transactions
						.sort(
							(a, b) =>
								Number(new Date(b?.createdDate)) - Number(new Date(a?.createdDate))
						)
						.map((transaction, index) => (
							<div
								key={transaction?.id}
								onClick={() => setSelected(transaction)}
								className="my-5 cursor-pointer rounded-md border border-[#494949] bg-[#0E0E0E] p-4 font-nunito transition-colors">
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-[#AAAAAA]">Date</span>
										<span className="text-white">
											{formatDate(new Date(transaction?.createdDate))}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-[#AAAAAA]">Amount</span>
										<span className="text-white">
											{formatAmount(+transaction?.amountDue || 0, currency)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-[#AAAAAA]">Value</span>
										<span className="text-white">
											{chosenCurrency === "BTC"
												? (Number(transaction?.assetAmount) / SATS_PER_BTC || 0).toFixed(8)
												: Number(transaction.assetAmount).toFixed(8)}{" "}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-[#AAAAAA]">Address</span>
										<span className="text-white">
											{formatBtcAddress(transaction.walletAddress ?? "")}
										</span>
									</div>
									<div className="flex justify-between border-t border-gray-700 pt-2">
										<span className="text-[#AAAAAA]">Status</span>
										<p
											className={`w-fit rounded bg-[#010101] px-2 py-1 text-[10px] font-medium capitalize ${
												StatusColor[transaction?.paymentState]
											}`}>
											{transaction?.paymentState?.split("_").join(" ")}
										</p>
									</div>
								</div>
							</div>
						))
				)}
			</div>
		</>
	)
}
