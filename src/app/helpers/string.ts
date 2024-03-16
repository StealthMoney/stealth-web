export const formatBtcAddress = (walletAddress: string) => {
	const firstPart = walletAddress.slice(0, 8)
	const lastPart = walletAddress.slice(-6)
	return `${firstPart}...${lastPart}`
}

export const getBaseUrl = () => {
	return process.env.VERCEL_ENV === "production"
		? "https://app.stealth.money"
		: process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL
		? `https://www.${
				process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL
		  }`
		: "http://localhost:3000"
}
