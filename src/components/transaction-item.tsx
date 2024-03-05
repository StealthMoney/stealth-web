"use client"

import {
	CheckCircle,
	WarningCircle,
	WarningOctagon,
} from "@phosphor-icons/react"
import React from "react"

import { formatCurrency } from "@/app/helpers/amount"
import { formatLongDate } from "@/app/helpers/time"
import { PaymentDetail } from "@/types/price"
import { SATS_PER_BTC } from "@/config/constants"

interface Props {
	transaction: PaymentDetail
}

const StatusColor = {
	INITIATED: "text-white-300",
	PAID: "text-green-100",
	ALREADY_PROCESSED: "text-green-100",
	PENDING: "text-orange-100",
	FAILED: "text-red-100",
}

const StatusIcon = {
	ALREADY_PROCESSED: (
		<CheckCircle className="text-9xl text-green-100" weight="fill" />
	),
	INITIATED: (
		<WarningOctagon className="text-9xl text-orange-100" weight="fill" />
	),
	PAID: <CheckCircle className="text-9xl text-green-100" weight="fill" />,
	PENDING: <WarningOctagon className="text-9xl text-orange-100" weight="fill" />,
	FAILED: <WarningCircle className="text-9xl text-red-100" weight="fill" />,
}

const TransactionItem = ({ transaction }: Props) => {
	return (
		<div className="flex w-full flex-col items-center gap-5">
			{StatusIcon[transaction.paymentState]}
			<p className="text-xl text-white-300">You purchased</p>
			<p className="text-[28px] text-white-100">
				{(Number(transaction.amountInSats) / SATS_PER_BTC).toString()} BTC
			</p>
			{transaction.paymentState === "PAID" && (
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
					{formatLongDate(new Date(transaction.createdDate))}
				</p>
			</div>
			<div className="w-full">
				<div className="flex w-full items-center justify-between text-sm text-white-300">
					<p>Amount</p>
					<p>Value</p>
				</div>
				<div className="flex w-full items-center justify-between text-xl font-medium">
					<p>{formatCurrency(+transaction.amountDue || 0)}</p>
					<p>{Number(transaction.amountInSats) / SATS_PER_BTC || 0} BTC</p>
				</div>
			</div>
			<div className="flex w-full flex-col justify-start">
				<p className="text-sm text-white-300">Network Fee</p>
				<p className="text-xl font-medium text-white-100">{formatCurrency(0)}</p>
			</div>
			<hr className="my-4 w-full" />
			<div className="flex w-full flex-col justify-start">
				<p className="text-sm text-white-300">Wallet Address</p>
				<p className="text-xl font-medium text-white-100">
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
