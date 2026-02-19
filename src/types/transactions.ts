export type TransactionProps = {
	id: string
	userId: 852
	paymentId: 1107
	walletAddress: string
	transactionStatus: "INITIATED" | "PROCESSING" | "SUCCESSFUL" | "FAILED"
	transactionReference: string
	processorId: string
	createdDate: Date | string
	amount: string
	value: string
}

export interface PaymentQuery {
	assetCurrency?: "USDT" | "SATS"
	page?: number
	size?: number
	sort?: string
}
