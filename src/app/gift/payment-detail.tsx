"use client"

import { Button } from "@/components"
import { formatCurrency } from "../helpers/amount"
import { Copy } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Props {
	amount: string | number
	amountInSats: string | number
	feeAmount: string | number
	amountDue: string | number
	accountNumber: string | number
	accountName: string
	bankName: string
	paymentReference: string
}

export const PaymentDetail = (props: Props) => {
	const { amount, feeAmount, amountDue, accountNumber, accountName, bankName } =
		props
	const router = useRouter()
	const [copied, setCopied] = useState(false)
	const [next, setNext] = useState(false)

	const handleCopy = () => {
		navigator.clipboard.writeText(accountNumber.toString())
		setCopied(true)
		setTimeout(() => {
			setCopied(false)
		}, 3000)
	}

	return (
		<>
			<div className="rounded-lg bg-black-700 px-7 py-6 text-white-200 md:p-10">
				<p className="mb-2 text-center font-satoshi text-[28px] font-medium">
					Gift Bitcoin
				</p>
				<p className="text-center text-lg text-black-400">
					Make payment into the account details provided below.
				</p>
				<div className="mb-12 mt-8 w-full">
					<p className="text-white-300">You are to pay</p>
					<div className="flex w-full items-center justify-between">
						<p className="font-satoshi text-xl font-medium md:text-[28px]">
							{formatCurrency(Number(amountDue))}
						</p>
						<button
							onClick={handleCopy}
							className={`flex items-center gap-1 text-xl ${
								copied && "text-green-100"
							}`}>
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
						<p>{bankName}</p>
						<p>{accountNumber}</p>
					</div>
				</div>
				<div className="my-12 w-full">
					<div className="flex w-full items-center justify-between text-sm text-white-300">
						<p>Amount of Bitcoin Purchase</p>
						<p>Charges</p>
					</div>
					<div className="flex w-full items-center justify-between text-xl font-medium">
						<p>{formatCurrency(Number(amount))}</p>
						<p>{formatCurrency(Number(feeAmount))}</p>
					</div>
				</div>
				<hr className="w-full" />
				<div className="mb-20 mt-12 w-full">
					<div className="flex w-full items-center justify-between text-sm text-white-300">
						<p>Total Amount To Be Paid</p>
						<p>Account Name</p>
					</div>
					<div className="flex w-full items-center justify-between text-xl font-medium">
						<p>{formatCurrency(Number(amountDue))}</p>
						<p className="m-0 max-w-[50%] p-0 text-right text-base md:text-lg">
							{accountName}
						</p>
					</div>
				</div>
				<div className="grid w-full grid-cols-2 gap-3">
					<Button
						type="button"
						onClick={() => router.push("/account/login")}
						width="w-full bg-black-600">
						Cancel
					</Button>
					<Button
						type="button"
						onClick={() => setNext(true)}
						width="w-full text-white-200">
						I Have Paid
					</Button>
				</div>
			</div>
			<PaidModal isVisible={next} />
		</>
	)
}

const PaidModal = ({ isVisible }: { isVisible: boolean }) => {
	const router = useRouter()
	if (!isVisible) return null
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black-600 bg-opacity-70">
			<div className="flex flex-col items-center justify-center gap-y-10 rounded-lg bg-black-700 p-10 text-white-200">
				<p className="text-center text-xl md:text-2xl">Thanks for your payment.</p>
				<p className="max-w-[90%] text-center text-lg text-white-200 md:text-xl">
					Your gift will be sent when your payment is confirmed.
				</p>
				<Button
					type="button"
					onClick={() => router.push("/account/login")}
					width="w-full">
					Continue
				</Button>
			</div>
		</div>
	)
}
