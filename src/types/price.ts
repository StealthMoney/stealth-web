export type ExchangeRateProps = {
	status: string
	message: string
	_meta: string | null
	_links: string | null
	data: {
		currency: string
		pricePerBtc: number
		pricePerUsd: number
		pricePerSat: number
	}
}

export type PaymentDetailsProps = {
	message: string
	status: string
	data: {
		accountNumber: string
		accountName: string
		bankName: string
		paymentReference: string
	}
}

export type fetchMeta = {
	status: string
	message: string
	_meta: string
	_links: string[]
}

export type PaymentDetail = {
	id: number
	userId: number
	accountNumber: number
	amount: number
	amountDue: number
	amountInSats: string
	walletAddress: string
	narration: string
	paymentState: "INITIATED" | "PENDING" | "ALREADY_PROCESSED" | "PAID" | "FAILED"
	responseCode: string
	responseMessage: string
	paymentReference: string
	processorId: string
	processorPaymentReference: string
	createdDate: string
	paymentDate: Date | string
}

export type PaymentStatusProps = fetchMeta & {
	data: PaymentDetail
}
