import { Suspense } from "react"
import { PaymentDetail } from "./payment-detail"
import endpoints from "@/config/endpoints"
import { PaymentDetails } from "@/components/instant-buy"
import { Spinner } from "@/components"
import Image from "next/image"

const getPaymentDetails = async (code: string) => {
	if (!code) {
		return { error: "Invalid code" }
	}
	const url = endpoints(code).payment["get-payment-by-token"]
	const res = await fetch(url)
	if (!res.ok) {
		if (res.status === 400) {
			const data = await res.json()
			return { error: data.message }
		}
		return {
			error:
				"An error occurred while fetching payment details. Please try again later!",
		}
	}
	const data = await res.json()
	return data.data as PaymentDetails
}

export default async function Page({
	searchParams,
}: {
	searchParams: {
		code: string
	}
}) {
	const { code } = searchParams
	if (!code) {
		return (
			<div className="flex h-screen w-full flex-col items-center justify-center overflow-y-auto bg-black-600 p-2">
				<div className="rounded-lg bg-black-700 p-10">
					<p className="text-center text-lg text-red-100">Invalid gift code</p>
				</div>
			</div>
		)
	}
	const paymentDetail = await getPaymentDetails(code)
	if ("error" in paymentDetail) {
		return (
			<div className="flex h-screen w-full flex-col items-center justify-center overflow-y-auto bg-black-600 p-2">
				<div className="rounded-lg bg-black-700 p-10">
					<p className="text-center text-lg text-red-100">{paymentDetail.error}</p>
				</div>
			</div>
		)
	}

	return (
		<section className="relative flex h-screen w-full flex-col items-center justify-center overflow-y-auto bg-black-600 p-2">
			<div className=" mb-1 flex items-center justify-center">
				<Image src="/stealth.svg" alt="logo" width={100} height={30} />
			</div>
			<Suspense
				fallback={
					<div>
						<Spinner />
					</div>
				}>
				<PaymentDetail
					amount={paymentDetail.amount}
					amountInSats={paymentDetail.amountInSats}
					feeAmount={paymentDetail.feeAmount}
					amountDue={paymentDetail.amountDue}
					accountNumber={paymentDetail.accountNumber}
					accountName={paymentDetail.accountName}
					bankName={paymentDetail.bankName}
					paymentReference={paymentDetail.paymentReference}
				/>
			</Suspense>
		</section>
	)
}
