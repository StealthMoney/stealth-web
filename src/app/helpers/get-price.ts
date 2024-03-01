"use server"

import endpoints from "@/config/endpoints"
import { auth } from "@/auth"
import {
	ExchangeRateProps,
	PaymentDetail,
	PaymentDetailsProps,
	PaymentStatusProps,
	fetchMeta,
} from "@/types/price"

export const getExchangeRate = async (): Promise<ExchangeRateProps | Error> => {
	const session = await auth()
	if (!session) {
		return new Error("No session found!")
	}
	const { accessToken } = session
	const url = endpoints().price.btc
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		// revalidate data every 30 seconds
		next: { revalidate: 30, tags: ["price"] },
	})
	if (!response.ok) {
		return new Error("Failed to fetch exchange rate!")
	}
	const data = await response.json()
	return data as ExchangeRateProps
}

interface PaymentPayload {
	amount: string | number
	amountInSats: string | number
	walletAddress: string
	narration?: string
}

export const getPaymentDetails = async (
	payload: PaymentPayload
): Promise<PaymentDetailsProps> => {
	const session = await auth()
	if (!session) {
		throw new Error("No session found!")
	}
	const { accessToken } = session
	const url = endpoints().payment["get-details"]
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify(payload),
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		next: { revalidate: 60, tags: ["paid"] },
	})
	if (!response.ok) {
		throw new Error("Failed to fetch payment details!")
	}
	const data = await response.json()
	return data
}

export const getAllPaymentDetails = async (): Promise<
	fetchMeta & { data: PaymentDetail[] }
> => {
	const session = await auth()
	if (!session) {
		throw new Error("No session found!")
	}
	const { accessToken } = session
	const url = endpoints().payment.list
	const response = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		next: { revalidate: 10, tags: ["paid", "approved"] },
	})
	if (!response.ok) {
		throw new Error("Failed to fetch payment details!")
	}
	const data = await response.json()
	return data as fetchMeta & { data: PaymentDetail[] }
}

export const confirmPayment = async (
	referenceNumber: string
): Promise<PaymentStatusProps | Error> => {
	const session = await auth()
	if (!session) {
		return new Error("No session found!")
	}
	const { accessToken } = session
	const url = endpoints().payment["get-status"]
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify({ referenceNumber }),
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
	})
	if (!response.ok) {
		return new Error("Failed to fetch payment details!")
	}
	const data = await response.json()
	return data as PaymentStatusProps
}
