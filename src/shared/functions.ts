import { ApiResponse } from "@/types/kyc"
import { auth } from "@/auth"
import jwtDecode from "jwt-decode"
import { Session } from "next-auth"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
// import * as bitcoin from "bitcoinjs-lib"
// import * as ecc from "tiny-secp256k1"
// import ECPairFactory from "ecpair"

type JwtPayload = { exp: number }
export const formatAmountForDisplay = (amount: string): string => {
	if (!amount) return ""
	const clean = amount.replace(/,/g, "")
	return new Intl.NumberFormat("en-US").format(Number(clean))
}

export const createResponse = (
	message: string,
	status: number,
	success: boolean
): ApiResponse => ({
	message,
	status,
	success,
})

export const getAuthHeaders = async (isJson: boolean = true) => {
	const session = await auth()
	if (!session) return null

	const { accessToken } = session

	const baseHeaders: Record<string, string> = {
		Authorization: `Bearer ${accessToken}`,
	}

	if (isJson) baseHeaders["Content-Type"] = "application/json"

	return baseHeaders
}

export const verifyAuthTokenExpiry = async (
	value: Session | null
): Promise<boolean> => {
	let shouldRedirect = false
	if (!value || !value?.accessToken) {
		shouldRedirect = true
	} else {
		try {
			const decoded = jwtDecode<JwtPayload>(value?.accessToken)
			shouldRedirect = decoded.exp * 1000 <= Number(new Date())
		} catch {
			shouldRedirect = true
		}
	}

	return shouldRedirect
}

export const normalizeAssetCurrency = (
	value?: string
): "USDT" | "SATS" | undefined => {
	if (value === "USDT") return "USDT"
	if (value === "SATS") return "SATS"
	return undefined
}

export const toAssetCurrency = (value: "BTC" | "USDT"): "SATS" | "USDT" =>
	value === "BTC" ? "SATS" : "USDT"

export const handleCurrencyChange = (
	currency: "USDT" | "BTC",
	router: AppRouterInstance,
	searchParams: URLSearchParams
) => {
	const params = new URLSearchParams(searchParams.toString())
	params.set("assetCurrency", toAssetCurrency(currency))
	params.set("page", "0")
	router.push(`?${params.toString()}`)
}

export const getPaginationRange = (currentPage: number, totalPages: number) => {
	const delta = 2
	const range: (number | "...")[] = []

	const left = Math.max(0, currentPage - delta)
	const right = Math.min(totalPages - 1, currentPage + delta)

	if (left > 0) {
		range.push(0)
		if (left > 1) range.push("...")
	}

	for (let i = left; i <= right; i++) {
		range.push(i)
	}

	if (right < totalPages - 1) {
		if (right < totalPages - 2) range.push("...")
		range.push(totalPages - 1)
	}

	return range
}

export const handlePageChange = (
	page: number,
	searchParams: URLSearchParams,
	router: AppRouterInstance
) => {
	const params = new URLSearchParams(searchParams.toString())
	params.set("page", String(page))
	router.push(`?${params.toString()}`)
}

// bitcoin.initEccLib(ecc)

// const ECPair = ECPairFactory(ecc) // will come back to you no worry

// export const generateTestnetBitcoinAddress = () => {
// 	const keyPair = ECPair.makeRandom({
// 		network: bitcoin.networks.testnet,
// 	})

// 	const { address } = bitcoin.payments.p2wpkh({
// 		pubkey: keyPair.publicKey,
// 		network: bitcoin.networks.testnet,
// 	})

// 	return {
// 		address,
// 		publicKey: Buffer.from(keyPair.publicKey).toString("hex"),
// 		privateKey: keyPair.toWIF(), // testnet WIF
// 	}
// }
