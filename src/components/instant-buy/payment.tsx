"use client"
import { Check, Copy } from "@phosphor-icons/react"
import { useEffect, useState } from "react"

import { formatCurrency } from "@/app/helpers/amount"
import { formatTime } from "@/app/helpers/time"
import { Button } from ".."
import { confirmPayment } from "@/app/helpers/get-price"
import { PaymentStatusProps } from "@/types/price"
import { Cross1Icon } from "@radix-ui/react-icons"

interface Props {
	chosenCurrency: "BTC" | "USDT"
	amount: string
	depositInfo: {
		accountNumber: string
		accountName: string
		bankName: string
		paymentReference: string
		feeAmount: string
		amountDue: string
		assetValue: string
		narration: string
	}
	paymentState: string
	setPaymentState: (state: string) => void
	next: () => void
	previous: () => void
	close: () => void
}

export const Payment = (props: Props) => {
	const [timer, setTimer] = useState(1800)
	const [copied, setCopied] = useState(false)
	const { amount, depositInfo } = props

	const copyPaymentDetails = () => {
		navigator.clipboard.writeText(`
		${depositInfo.bankName} \n
		${depositInfo.accountName} \n
		${depositInfo.accountNumber} \n
		${depositInfo.amountDue}
		`)
	}

	const copyAccountNumber = () => {
		if (!copied) {
			navigator.clipboard
				.writeText(depositInfo.accountNumber)
				.then(() => {
					setCopied(true)
				})
				.finally(() => {
					setTimeout(() => {
						setCopied(false)
					}, 1000)
				})
		}
	}

	const handleSubmit = async () => {
		await handleConfirmPayment()
		props.next()
	}

	const handleConfirmPayment = async () => {
		try {
			const res = await confirmPayment(depositInfo.paymentReference)
			if (res instanceof Error) {
				alert("An error occurred while confirming payment")
				return
			}
			const { data } = res as PaymentStatusProps
			console.log(data, "isss")

			if (
				data.paymentState === "PROCESSING" ||
				data.paymentState === "SUCCESSFUL"
			) {
				props.setPaymentState(data.paymentState)
				props.next()
			}
		} catch (error) {
			alert("An error occurred while confirming payment")
		}
	}

	useEffect(() => {
		const interval = setInterval(() => {
			setTimer((prev) => (prev > 0 ? prev - 1 : 0))
		}, 1000)
		return () => clearInterval(interval)
	})

	// poll for payment confirmation every 10 seconds
	useEffect(() => {
		if (!depositInfo.paymentReference) return
		const interval = setInterval(async () => {
			await handleConfirmPayment()
		}, 10000)
		return () => clearInterval(interval)
		// we only want to run this effect once when the component mounts
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="h-full w-full">
			<button
				type="button"
				onClick={props.close}
				className="hover:text-white absolute right-4 top-4 text-red-100"
				aria-label="Close">
				<Cross1Icon fontSize={32} />
			</button>
			<p className="font-satoshi text-[28px] font-medium">Make Payment</p>
			<p className="text-lg text-black-400">
				Make payment into the account details provided below.
			</p>

			<div className="mt-4 w-full">
				<p className="text-white-300">You are to pay</p>
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
					<p className="font-satoshi text-[28px] font-medium">
						{formatCurrency(Number(depositInfo.amountDue))}
					</p>
					<button
						onClick={copyPaymentDetails}
						className="flex items-center gap-1 self-start text-xl text-[#AAAAAA] sm:self-auto">
						Copy
					</button>
				</div>
			</div>

			<div className="w-full">
				<div className="flex flex-col gap-1 text-sm text-white-300 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
					<p>Bank Name</p>
					<p>Account Number</p>
				</div>
				<div className="flex flex-col gap-1 text-xl font-medium sm:flex-row sm:items-center sm:justify-between sm:gap-0">
					<p>{depositInfo.bankName}</p>
					<p className="flex items-center gap-x-2">
						{depositInfo.accountNumber}
						<span role="button" aria-label="copy text" onClick={copyAccountNumber}>
							{!copied ? (
								<Copy size={24} color="#F7931A" />
							) : (
								<Check size={24} color="#66bc74" />
							)}
						</span>
					</p>
				</div>
			</div>

			<div className="my-4 w-full">
				<div className="flex flex-col gap-1 text-sm text-white-300 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
					<p>
						Amount of {props.chosenCurrency === "BTC" ? "Bitcoin" : "USDT"} Purchase
					</p>
					<p>Fees</p>
				</div>
				<div className="flex flex-col gap-1 text-xl font-medium sm:flex-row sm:items-center sm:justify-between sm:gap-0">
					<p>{formatCurrency(Number(amount))}</p>
					<p>{formatCurrency(Number(depositInfo.feeAmount))}</p>
				</div>
			</div>

			<small
				className={`${
					props.chosenCurrency === "BTC" ? "text-alt-orange-100" : "text-green-500"
				}`}>
				{props.chosenCurrency === "BTC"
					? "The fees we charge are used to pay miners"
					: "The fees we charge are to settle our payment partners"}
			</small>

			<hr className="w-full" />

			<div className="mb-10 mt-8 w-full">
				<div className="flex w-full flex-col gap-y-2 rounded-md border border-[#2B2B2B] bg-[#161616] px-4 py-2 font-satoshi text-xl font-medium">
					<p className="text-[14px] text-[#AAAAAA]">
						When making your bank transfer, kindly use this as narration:
					</p>
					<p className="text-[16px] text-white-100">{depositInfo.narration}</p>
				</div>
			</div>

			<div className="mb-10 mt-8 w-full">
				<div className="flex flex-col gap-1 text-sm text-white-300 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
					<p>Total Amount To Be Paid</p>
					<p>Expires In</p>
				</div>
				<div className="flex flex-col gap-1 text-xl font-medium sm:flex-row sm:items-center sm:justify-between sm:gap-0">
					<p>{formatCurrency(Number(depositInfo.amountDue))}</p>
					<p className={`${timer > 0 ? "text-green-500" : "text-red-500"}`}>
						{formatTime(timer)}
					</p>
				</div>
			</div>

			<div className="grid w-full grid-cols-1 gap-3 pb-10 sm:grid-cols-2">
				<Button type="button" onClick={props.previous} width="w-full bg-black-600">
					Go Back
				</Button>
				<Button type="button" onClick={handleSubmit} width="w-full">
					I Have Paid
				</Button>
			</div>
		</div>
	)
}

export default Payment
