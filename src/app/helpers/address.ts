import { validate, Network } from "bitcoin-address-validation"

type UsdtNetwork = "ERC20" | "TRC20" | "BEP20" | "SOL"

export const validateWalletAddress = (
	chosenCurrency: "BTC" | "USDT",
	address: string,
	network: Network = Network.mainnet,
	UsdtNetwork: UsdtNetwork = "TRC20"
) => {
	if (!address) return false
	const env = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV
	if (env === "staging" || env === "development") return true

	if (chosenCurrency === "BTC") {
		return validate(address, network)
	}

	if (chosenCurrency === "USDT") {
		switch (UsdtNetwork) {
			case "ERC20":
			case "BEP20":
				return /^0x[a-fA-F0-9]{40}$/.test(address)

			case "TRC20":
				return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)

			case "SOL":
				return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)

			default:
				return false
		}
	}
	return false
}
