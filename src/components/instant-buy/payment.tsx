"use client"
import { Copy } from "@phosphor-icons/react"
import { useEffect, useState } from "react"

import { formatCurrency } from "@/app/helpers/amount"
import { formatTime } from "@/app/helpers/time"
import { Button } from ".."
import { confirmPayment } from "@/app/helpers/get-price"
import { PaymentStatusProps } from "@/types/price"

interface Props {
	amount: string
	depositInfo: {
		accountNumber: string
		accountName: string
		bankName: string
		paymentReference: string
		feeAmount: string
		amountDue: string
		amountInSats: string
	}
	paymentState: string
	setPaymentState: (state: string) => void
	next: () => void
	previous: () => void
}

export const Payment = (props: Props) => {
	const [timer, setTimer] = useState(1800)
	const { amount, depositInfo } = props

	const copyPaymentDetails = () => {
		navigator.clipboard.writeText(`
		${depositInfo.bankName} \n
		${depositInfo.accountName} \n
		${depositInfo.accountNumber}
		`)
	}

	const handleSubmit = async () => {
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
			if (
				data.paymentState === "PAID" ||
				(data.paymentState === "ALREADY_PROCESSED" && timer < 1)
			) {
				props.setPaymentState(data.paymentState)
				console.log("payment-state can proceed")
				console.log("payment-state", data.paymentState)
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
		const interval = setInterval(() => {
			handleConfirmPayment()
		}, 10000)
		return () => clearInterval(interval)
		// we only want to run this effect once when the component mounts
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="h-full w-full">
			<p className="font-satoshi text-[28px] font-medium">Make Payment</p>
			<p className="text-lg text-black-400">
				Make payment into the account details provided below.
			</p>
			<div className="mb-16 mt-8 w-full">
				<p className="text-white-300">You are to pay</p>
				<div className="flex w-full items-center justify-between">
					<p className="font-satoshi text-[28px] font-medium">
						{formatCurrency(Number(depositInfo.amountDue))}
					</p>
					<button
						onClick={copyPaymentDetails}
						className="flex items-center gap-1 text-xl">
						Copy <Copy size={24} />
					</button>
				</div>
			</div>
			<div className="w-full">
				<div className="flex w-full items-center justify-between text-sm text-white-300">
					<p>Bank Name</p>
					<p>Account Number</p>
				</div>
				<div className="flex w-full items-center justify-between text-xl font-medium">
					<p>{depositInfo.bankName}</p>
					<p>{depositInfo.accountNumber}</p>
				</div>
			</div>
			<div className="my-12 w-full">
				<div className="flex w-full items-center justify-between text-sm text-white-300">
					<p>Amount of Bitcoin Purchase</p>
					<p>Charges</p>
				</div>
				<div className="flex w-full items-center justify-between text-xl font-medium">
					<p>{formatCurrency(+amount)}</p>
					<p>{formatCurrency(Number(depositInfo.feeAmount))}</p>
				</div>
			</div>
			<hr className="w-full" />
			<div className="mb-20 mt-12 w-full">
				<div className="flex w-full items-center justify-between text-sm text-white-300">
					<p>Total Amount To Be Paid</p>
					<p>Expires In</p>
				</div>
				<div className="flex w-full items-center justify-between text-xl font-medium">
					<p>{formatCurrency(Number(depositInfo.amountDue))}</p>
					<p className={`${timer > 0 ? "text-green-500" : "text-red-500"}`}>
						{formatTime(timer)}
					</p>
				</div>
			</div>
			<div className="grid w-full grid-cols-2 gap-3 pb-10">
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
