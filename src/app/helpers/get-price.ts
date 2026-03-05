"use server"

import endpoints from "@/config/endpoints"
import { auth } from "@/auth"
import {
	ExchangeRateProps,
	PaymentDetail,
	PaymentDetailsProps,
	PaymentStatusProps,
	fetchMeta,
	PaymentsResponse,
} from "@/types/price"
import { getAuthHeaders } from "@/shared/functions"
import { PaymentQuery } from "@/types/transactions"

export const getExchangeRate = async (
	params: string
): Promise<ExchangeRateProps | Error> => {
	const session = await getAuthHeaders(false)
	if (!session) {
		return new Error("No session found!")
	}
	const derivedParam = params === "SATS" || params === "BTC" ? "BTC" : "TRC20"
	const url = endpoints(derivedParam).price.btc
	const response = await fetch(url, {
		headers: session,
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
	walletAddress?: string
	walletId?: string
	assetCurrency?: string | number
	network?: string
	narration?: string
	generatePaymentLink?: boolean
}

export const getPaymentDetails = async (
	payload: PaymentPayload
): Promise<
	(PaymentDetailsProps & { ok: true }) | { ok: false; message: string }
> => {
	try {
		const session = await auth()
		if (!session) return { ok: false, message: "No session found!" }

		const { accessToken } = session
		const url = endpoints().payment["get-details"]
		const response = await fetch(url, {
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			cache: "no-store",
		})
		const data = await response.json()
		if (!response.ok) {
			return {
				ok: false,
				message: data?.message || "Failed to fetch payment details!",
			}
		}
		return { ok: true, ...data }
	} catch (error) {
		return {
			ok: false,
			message:
				error instanceof Error ? error.message : "An unexpected error occurred",
		}
	}
}

export const getAllPaymentDetails = async (
	query: PaymentQuery = {}
): Promise<PaymentsResponse> => {
	const session = await getAuthHeaders()
	if (!session) {
		throw new Error("No session found!")
	}

	const params = new URLSearchParams()

	if (query.assetCurrency) params.set("assetCurrency", query.assetCurrency)
	if (query.page !== undefined) params.set("page", String(query.page))
	if (query.size !== undefined) params.set("size", String(query.size))
	if (query.sort) params.set("sort", query.sort)

	const url = `${endpoints().payment.list}?${params.toString()}`

	const response = await fetch(url, {
		method: "GET",
		headers: session,
	})

	if (!response.ok) {
		throw new Error("Failed to fetch payment details!")
	}

	return response.json()
}

export const confirmPayment = async (
	referenceNumber: string
): Promise<PaymentStatusProps | Error> => {
	const session = await getAuthHeaders()
	if (!session) {
		return new Error("No session found!")
	}
	const url = endpoints().payment["get-status"]
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify({ referenceNumber }),
		headers: session,
	})
	if (!response.ok) {
		return new Error("Failed to fetch payment details!")
	}
	const data = await response.json()
	return data as PaymentStatusProps
}
