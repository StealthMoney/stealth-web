// "use client"

import { ArrowsDownUp, Copy, WarningCircle } from "@phosphor-icons/react"
import { Dispatch, SetStateAction, useEffect, useState, useMemo } from "react"

import { formatCurrency, getCurrencyValue } from "@/app/helpers/amount"
import { getPaymentDetails } from "@/app/helpers/get-price"
import { CurrencyInput } from "@/components/shared/input"
import { Button, Input, Spinner } from "@/components"
import { ExchangeRateProps, PaymentDetailsProps } from "@/types/price"
import { validateWalletAddress } from "@/app/helpers/address"
import { PaymentDetails } from "."
import { formatAmountForDisplay } from "@/shared/functions"
import { Cross1Icon } from "@radix-ui/react-icons"
import CustomSwitch from "../shared/switch"
import { UserProps } from "@/types/profile"
import { XpubSelect } from "../xpubSelect"

interface Props {
	chosenCurrency: "BTC" | "USDT"
	paymentConfig: UserProps["physicalWallets"] | []
	exchangeRate: ExchangeRateProps["data"]
	fields: {
		amount: string
		currency: string
		assetValue: string
		walletAddress?: string
		walletId?: string
		usexpub: boolean
		network: string
		assetCurrency: string
	}
	handleChange: (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
			| { target: { name: string; value: boolean } }
	) => void
	pasteWalletAddress: () => void
	setAssetValue: (value: string) => void
	setDepositInfo: Dispatch<SetStateAction<PaymentDetails>>
	next: () => void
	close: () => void
}

const CurrencyList = ["NGN", "SATS"] // removed USD for now

const getCurrencyList = (chosenCurrency: "BTC" | "USDT") => {
	if (chosenCurrency === "BTC") return ["NGN", "SATS"]
	if (chosenCurrency === "USDT") return ["NGN", "USDT"]
	return ["NGN"]
}

const Init = (props: Props) => {
	const [reversed, setReversed] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const { fields, handleChange } = props
	const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null)

	const displayAmount = useMemo(
		() => formatAmountForDisplay(fields.amount),
		[fields.amount]
	)
	const displayAmount1 = useMemo(
		() => formatAmountForDisplay(fields.assetValue),
		[fields.assetValue]
	)

	const assetCurrency = useMemo(
		() => (props.chosenCurrency === "BTC" ? "SATS" : "USDT"),
		[props.chosenCurrency]
	)

	const network = useMemo(
		() => (props.chosenCurrency === "BTC" ? "BTC" : "TRC20"),
		[props.chosenCurrency]
	)

	const handleSubmit = async () => {
		const { amount, assetValue, walletAddress, usexpub } = fields

		const cleanAmount = amount.replace(/,/g, "")
		const numericAmount = parseFloat(cleanAmount)
		const cleanSats = assetValue.replace(/,/g, "")
		const numericAssetvalue = parseFloat(cleanSats)

		if (!assetCurrency) {
			return alert("Can't determine currency")
		}

		if (!network) {
			return alert("Can't determine network")
		}

		if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
			return alert("Please enter amount!")
		}

		if (isNaN(numericAssetvalue)) {
			return alert("Invalid amount in sats!")
		}

		if (!selectedWalletId && usexpub && props.chosenCurrency === "BTC") {
			setError("Please Choose your x-pub key")
			return
		}

		if (!walletAddress && !usexpub) {
			setError("Please enter a wallet address")
			return
		}
		setLoading(true)
		try {
			const res = await getPaymentDetails({
				amount: numericAmount,
				network,
				assetCurrency,
				// amountInSats: numericAssetvalue,
				...(props.chosenCurrency === "BTC" && fields.usexpub
					? {
							walletId:
								props.paymentConfig.length === 1
									? String(props.paymentConfig[0]?.id)
									: String(selectedWalletId),
					  }
					: { walletAddress: fields.walletAddress }),
			})
			if (!res.ok) {
				const message = res?.message
				setError(message || "Something went wrong with request")
				setLoading(false)
				return
			}
			props.setDepositInfo(res.data)
			props.next()
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message)
				setLoading(false)
			}
		}
	}

	const walletError = useMemo(() => {
		const { walletAddress, usexpub } = fields
		if (usexpub) return ""
		if (
			walletAddress &&
			!validateWalletAddress(props.chosenCurrency, walletAddress)
		) {
			return "Invalid wallet address!"
		}
		return ""
	}, [fields, props.chosenCurrency])

	const isButtonDisabled = useMemo(() => {
		const { walletAddress, usexpub, amount, assetValue } = fields
		const cleanAmount = amount.replace(/,/g, "")
		const numericAmount = parseFloat(cleanAmount)

		const cleanAsset = assetValue.replace(/,/g, "")
		const numericAsset = parseFloat(cleanAsset)

		if (!amount || isNaN(numericAmount) || numericAmount <= 0) return true

		if (!assetValue || isNaN(numericAsset)) return true

		if (usexpub) {
			if (props.chosenCurrency === "BTC" && !selectedWalletId) return true
		} else {
			if (!walletAddress) return true
			if (!validateWalletAddress(props.chosenCurrency, walletAddress)) return true
		}
		return false
	}, [fields, props.chosenCurrency, selectedWalletId])

	// when amount field is being edited
	useEffect(() => {
		if (reversed) return

		if (!fields.amount || fields.amount === "" || fields.amount === "0") {
			props.setAssetValue("0")
			return
		}

		const cleanAmount = fields.amount.replace(/,/g, "")
		const numericAmount = parseFloat(cleanAmount)

		if (isNaN(numericAmount) || !isFinite(numericAmount)) {
			props.setAssetValue("0")
			return
		}

		const { assetValue } = getCurrencyValue({
			currency: props.chosenCurrency,
			amount: cleanAmount,
			pricePerSat: props.exchangeRate.pricePerSat,
			pricePerUsd: props.exchangeRate.pricePerUsd,
			price: props.exchangeRate.price,
		})

		if (!isNaN(assetValue) && isFinite(assetValue)) {
			const formatted =
				props.chosenCurrency === "BTC"
					? Math.floor(assetValue).toString()
					: assetValue.toFixed(2)
			props.setAssetValue(formatted)
		} else {
			props.setAssetValue("0")
		}
	}, [fields.amount, reversed, props.chosenCurrency])

	// when sats/usdt field is being edited
	useEffect(() => {
		if (!reversed) return

		if (
			!fields.assetValue ||
			fields.assetValue === "" ||
			fields.assetValue === "0"
		) {
			handleChange({ target: { name: "amount", value: "0" } } as any)
			return
		}

		const cleanSats = fields.assetValue.replace(/,/g, "")
		const numericSats = parseFloat(cleanSats)

		if (isNaN(numericSats) || !isFinite(numericSats)) {
			handleChange({ target: { name: "amount", value: "0" } } as any)
			return
		}

		let amountInNaira
		if (props.chosenCurrency === "BTC") {
			amountInNaira = numericSats * (props.exchangeRate?.pricePerSat ?? 0)
		} else {
			amountInNaira = numericSats * (props.exchangeRate.price ?? 0)
		}

		if (!isNaN(amountInNaira) && isFinite(amountInNaira)) {
			handleChange({
				target: { name: "amount", value: amountInNaira.toString() },
			} as any)
		} else {
			handleChange({ target: { name: "amount", value: "0" } } as any)
		}
	}, [fields.assetValue, reversed, props.chosenCurrency])

	return (
		<div className="h-full w-full">
			<button
				type="button"
				onClick={props.close}
				className="hover:text-white absolute right-4 top-4 text-red-100"
				aria-label="Close">
				<Cross1Icon fontSize={32} />
			</button>
			<p className="font-satoshi text-[28px] font-medium">Instant Buy</p>
			<p className="text-lg text-black-400">
				Please enter description and your wallet address correctly
			</p>
			<div className="my-8 flex w-full flex-col">
				<div
					className={`flex w-full ${reversed ? "flex-col-reverse" : "flex-col"}`}>
					<CurrencyInput
						amount={displayAmount}
						currency={fields.currency}
						inputName="amount"
						selectName="currency"
						handleAmountChange={handleChange}
						handleCurrencyChange={handleChange}>
						{CurrencyList.map((currency) => (
							<option key={currency} value={currency}>
								{currency}
							</option>
						))}
					</CurrencyInput>
					<div className="relative h-4 w-full">
						<button
							title="swap"
							onClick={() => setReversed(!reversed)}
							className="absolute left-[3%] top-1/2 grid aspect-square w-8 -translate-y-1/2 place-items-center rounded-full border bg-[#111]">
							<ArrowsDownUp size={20} />
						</button>
					</div>
					<CurrencyInput
						amount={displayAmount1}
						currency={props.chosenCurrency === "BTC" ? "SATS" : "USDT"}
						inputName="assetValue"
						disableInput={!reversed}
						disableSelect
						handleAmountChange={handleChange}
						handleCurrencyChange={handleChange}>
						{getCurrencyList(props.chosenCurrency).map((currency) => (
							<option key={currency} value={currency}>
								{currency}
							</option>
						))}
					</CurrencyInput>
				</div>
				<p className="flex items-center gap-1 text-xs text-black-400">
					<WarningCircle className="text-alt-orange-100" />
					{props.chosenCurrency === "BTC"
						? `Exchange rate: 1 BTC = ${formatCurrency(
								props.exchangeRate.pricePerBtc ?? 0
						  )}`
						: `Exchange rate: 1 USDT = ${formatCurrency(
								props.exchangeRate?.price ?? 0
						  )}`}
				</p>
			</div>
			{props.paymentConfig.length > 0 && props.chosenCurrency === "BTC" && (
				<>
					<div className="flex w-full items-center justify-between">
						<div className="flex items-center gap-x-2">
							<span>Use Xpub keys</span>
							<span>
								<WarningCircle className="text-alt-orange-100" />
							</span>
						</div>
						<div>
							<CustomSwitch
								checked={fields.usexpub}
								onCheckedChange={(checked) =>
									handleChange({
										target: { name: "usexpub", value: checked },
									})
								}
							/>
						</div>
					</div>
				</>
			)}
			<div className="relative my-6 mb-12 min-h-[100px]">
				<div
					className={`absolute inset-0 transition-all duration-300 ease-in-out ${
						fields.usexpub
							? "pointer-events-none translate-y-2 opacity-0"
							: "translate-y-0 opacity-100"
					}`}>
					<Input
						typed="text"
						name="walletAddress"
						value={fields.walletAddress}
						onChange={handleChange}
						label="Wallet Address"
						pasteBtn={
							<button
								type="button"
								onClick={props.pasteWalletAddress}
								className="flex items-center gap-1 px-2 text-xs uppercase text-green-100">
								paste <Copy size={14} />
							</button>
						}
					/>
					<p className="text-xs">
						Please paste in your wallet address here.{" "}
						{props.chosenCurrency === "BTC"
							? "(Avoid reusing the same address for privacy reasons)"
							: "(Provide a valid TRC20 wallet address)"}
					</p>
				</div>

				{fields.usexpub && props.paymentConfig.length === 1 && (
					<div
						className={`absolute inset-0 transition-all duration-300 ease-in-out ${
							fields.usexpub
								? "translate-y-0 opacity-100"
								: "pointer-events-none -translate-y-2 opacity-0"
						}`}>
						<p className="text-white" aria-label="x-pub-key">
							Xpub key <span className="text-[#B31919]">*</span>
						</p>
						<div className="flex flex-col gap-y-2 rounded-md border border-[#494949] bg-[#2B2B2B] px-2 py-5 font-satoshi">
							<small className="text-[14px] text-[#AAAAAA]">
								{props.paymentConfig[0]?.alias}
							</small>
							<small className="truncate text-[16px]">
								{props.paymentConfig[0]?.xpubKey}
							</small>
						</div>
					</div>
				)}

				{fields.usexpub && props.paymentConfig.length > 1 && (
					<div
						className={`flex w-full flex-col gap-1 ${
							fields.usexpub ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
						}`}>
						<label className="text-white mb-2 block text-sm font-medium">
							Enter Xpub <span className="text-[#B31919]">*</span>
						</label>
						<XpubSelect
							items={props.paymentConfig}
							value={selectedWalletId}
							onValueChange={(id) => {
								setSelectedWalletId(id)
							}}
							placeholder="Select Xpub"
						/>
					</div>
				)}
			</div>
			{fields.usexpub && walletError && (
				<small className="mb-2 block text-[#B31919]">{walletError}</small>
			)}

			{walletError && !fields.usexpub && (
				<small className="mb-2 text-[#B31919]">{walletError}</small>
			)}

			{error && <small className="mb-2 text-[#B31919]">{error}</small>}

			<div className="pb-10">
				<Button
					isDisabled={isButtonDisabled}
					type="button"
					onClick={handleSubmit}
					disabled={isButtonDisabled}
					width="w-full">
					{loading ? <Spinner /> : "Buy Now"}
				</Button>
			</div>
		</div>
	)
}

export default Init
