"use client"

import {
	CheckCircle,
	WarningCircle,
	WarningOctagon,
} from "@phosphor-icons/react"

import { formatCurrency } from "@/app/helpers/amount"
import { userTimezoneDate } from "@/app/helpers/time"
import { PaymentDetail } from "@/types/price"
import { SATS_PER_BTC } from "@/config/constants"
import { Cross1Icon } from "@radix-ui/react-icons"

interface Props {
	chosenCurrency: "BTC" | "USDT"
	transaction: PaymentDetail
	close: () => void
}

const StatusColor = {
	INITIATED: "text-white-300",
	SUCCESSFUL: "text-green-100",
	PROCESSING: "text-orange-100",
	FAILED: "text-red-100",
}

const StatusIcon = {
	SUCCESSFUL: <CheckCircle className="text-9xl text-green-100" weight="fill" />,
	INITIATED: (
		<WarningOctagon className="text-9xl text-orange-100" weight="fill" />
	),
	PROCESSING: (
		<WarningOctagon className="text-9xl text-orange-100" weight="fill" />
	),
	FAILED: <WarningCircle className="text-9xl text-red-100" weight="fill" />,
}

const TransactionItem = ({ transaction, close, chosenCurrency }: Props) => {
	const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

	return (
		<div className="flex w-full flex-col items-center gap-5">
			<button
				type="button"
				onClick={close}
				className="hover:text-white absolute right-4 top-4 text-red-100"
				aria-label="Close">
				<Cross1Icon fontSize={32} />
			</button>
			{StatusIcon[transaction.paymentState]}
			<p className="text-xl text-white-300">You purchased</p>
			<p className="text-[28px] text-white-100">
				{chosenCurrency === "BTC"
					? Number(transaction.assetAmount) / SATS_PER_BTC
					: Number(transaction.assetAmount)}{" "}
				{chosenCurrency}
			</p>
			{transaction.paymentState === "PROCESSING" && (
				<p className="text-center text-xl text-white-100">
					Payment received! You will receive your Bitcoin shortly.
				</p>
			)}
			<div className="flex w-full items-center justify-between">
				<div className="flex flex-col">
					<p className="text-sm text-white-300">Transaction ID</p>
					<p className="text-xl font-medium text-white-100">
						{transaction.paymentReference}
					</p>
				</div>
				<p
					className={`text-xl capitalize ${StatusColor[transaction.paymentState]}`}>
					{transaction.paymentState.toLowerCase().split("_").join(" ")}
				</p>
			</div>
			<div className="flex w-full flex-col justify-start">
				<p className="text-sm text-white-300">Date</p>
				<p className="text-xl font-medium text-white-100">
					{userTimezoneDate(transaction.createdDate, userTimeZone)}
				</p>
			</div>
			<div className="w-full">
				<div className="flex w-full items-center justify-between text-sm text-white-300">
					<p>Amount</p>
					<p>Value</p>
				</div>
				<div className="flex w-full items-center justify-between text-xl font-medium">
					<p>{formatCurrency(+transaction.amountDue || 0)}</p>
					<p>
						{chosenCurrency === "BTC"
							? Number(transaction.assetAmount) / SATS_PER_BTC
							: Number(transaction.assetAmount)}{" "}
						{chosenCurrency}
					</p>
				</div>
			</div>
			{/* <div className="flex w-full flex-col justify-start">
				<p className="text-sm text-white-300">Network Fee</p>
				<p className="text-xl font-medium text-white-100">{formatCurrency(0)}</p>
			</div> */}
			<hr className="my-4 w-full" />
			<div className="flex w-full flex-col justify-start">
				<p className="text-sm text-white-300">Wallet Address</p>
				<p className="break-words text-xl font-medium text-white-100">
					{transaction.walletAddress}
				</p>
			</div>
			{/* <div className="flex w-full flex-col justify-start">
				<p className="text-sm text-white-300">Transaction Hash</p>
				<p className="text-xl font-medium text-white-100">{}</p>
			</div> */}
		</div>
	)
}

export default TransactionItem
