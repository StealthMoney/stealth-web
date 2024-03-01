export const formatCurrency = (amount: number) => {
	const intl = new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
	})
	return intl.format(amount)
}

export const getCurrencyValue = ({
	amount,
	pricePerSat,
	pricePerUsd,
}: {
	amount: string
	pricePerSat: number
	pricePerUsd: number
}) => {
	const amountInSats = Math.round(Number(amount) / pricePerSat)
	const amountInNaira = Number(amount) / pricePerUsd
	return {
		amount: amountInNaira,
		amountInSats,
	}
}
