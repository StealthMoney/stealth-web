export type ExchangeRateProps = {
	status: string
	message: string
	_meta: string | null
	_links: string | null
	data: {
		currency: string
		pricePerBtc?: number
		pricePerUsd?: number
		pricePerSat?: number
		price?: number
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
		amount: string
		feeAmount: string
		amountDue: string
		assetValue: string
		paymentLink?: string
		narration: string
		assetAmount: string
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
	assetValue: string
	assetAmount: string
	walletAddress: string
	narration: string
	paymentState: "INITIATED" | "PROCESSING" | "SUCCESSFUL" | "FAILED"
	responseCode: string
	responseMessage: string
	paymentReference: string
	processorId: string
	processorPaymentReference: string
	createdDate: string
	paymentDate: Date | string
}

export type PaginatedPayments = {
	content: PaymentDetail[]
	pageNo: number
	pageSize: number
	totalElements: number
	totalPages: number
	last: boolean
}

export type PaymentsResponse = fetchMeta & {
	data: PaginatedPayments
}

export type PaymentStatusProps = fetchMeta & {
	data: PaymentDetail
}
