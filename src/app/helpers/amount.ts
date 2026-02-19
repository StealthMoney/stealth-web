export const formatCurrency = (amount: number) => {
	const intl = new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
	})
	return intl.format(amount)
}

export const getCurrencyValue = ({
	currency,
	amount,
	pricePerSat,
	pricePerUsd,
}: {
	currency: "BTC" | "USDT"
	amount: string
	pricePerSat: number
	pricePerUsd: number
}) => {
	const amountInSats = Math.round(Number(amount) / pricePerSat)
	const amountInNaira = Number(amount) / pricePerUsd

	if (currency === "BTC") {
		return {
			amount: amountInNaira,
			assetValue: amountInSats,
		}
	} else {
		return {
			amount,
			assetValue: amountInNaira,
		}
	}
}

export const formatDigits = (amount: number) => {
	if (!amount || isNaN(amount)) return "₦0"

	const num = Number(amount)

	if (num >= 1_000_000_000_000) {
		const trillions = num / 1_000_000_000_000
		const formatted = trillions % 1 === 0 ? trillions : trillions.toFixed(1)
		return `₦${formatted.toLocaleString("en-US")}T`
	}

	if (num >= 1_000_000_000) {
		const billions = num / 1_000_000_000
		const formatted = billions % 1 === 0 ? billions : billions.toFixed(1)
		return `₦${formatted.toLocaleString("en-US")}B`
	}

	if (num >= 1_000_000) {
		const millions = num / 1_000_000
		const formatted = millions % 1 === 0 ? millions : millions.toFixed(1)
		return `₦${formatted.toLocaleString("en-US")}M`
	}

	return num.toLocaleString("en-NG", {
		style: "currency",
		currency: "NGN",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	})
}
