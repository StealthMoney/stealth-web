"use client"

import { ArrowsDownUp, Copy, WarningCircle } from "@phosphor-icons/react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

import { formatCurrency, getCurrencyValue } from "@/app/helpers/amount"
import { getPaymentDetails } from "@/app/helpers/get-price"
import { CurrencyInput } from "@/components/shared/input"
import { Button, Input, Spinner } from "@/components"
import { ExchangeRateProps } from "@/types/price"
import { TXN_CHARGE } from "@/config/constants"
import { validateWalletAddress } from "@/app/helpers/address"
import { Fields } from "."
import { getBaseUrl } from "@/app/helpers/string"

interface Props {
	exchangeRate: ExchangeRateProps["data"]
	fields: Fields
	handleChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => void
	pasteWalletAddress: () => void
	setAmountInSats: (value: string) => void
	next: () => void
	setGeneratedLink: Dispatch<SetStateAction<string>>
}

const CurrencyList = ["NGN", "USD", "SATS"]

const LinkGenerateInit = (props: Props) => {
	const [reversed, setReversed] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState({
		amount: "",
		walletAddress: "",
	})
	const { fields, handleChange } = props

	// api call here
	const handleSubmit = async () => {
		const { amount, narration, walletAddress } = fields
		setError(() => ({ ...error, amount: "", walletAddress: "" }))
		if (!amount) {
			setError(() => ({ ...error, amount: "Please enter amount!" }))
			return
		}
		if (!walletAddress) {
			setError(() => ({ ...error, walletAddress: "Please enter wallet address!" }))
			return
		}
		const isValidAddress = validateWalletAddress(walletAddress)
		if (!isValidAddress) {
			setError(() => ({ ...error, walletAddress: "Invalid wallet address!" }))
			return
		}
		setLoading(true)
		const res = await getPaymentDetails({
			amount: Number(amount),
			narration,
			walletAddress,
			generatePaymentLink: true,
		})
		setLoading(false)
		if (res instanceof Error) {
			alert("An error occurred while generating payment link! Please try again")
			return
		}
		if (res.status == "00" && res.data.paymentLink) {
			const code = res.data.paymentLink.split("code=")[1]
			const url = `${getBaseUrl()}/gift?code=${code}`
			props.setGeneratedLink(url)
			props.next()
		} else {
			alert("An error occurred while generating payment link! Please try again")
		}
	}

	useEffect(() => {
		const { amountInSats } = getCurrencyValue({
			amount: fields.amount,
			pricePerSat: props.exchangeRate.pricePerSat,
			pricePerUsd: props.exchangeRate.pricePerUsd,
		})
		props.setAmountInSats(amountInSats.toString())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fields.amount])

	return (
		<div className="h-full w-full">
			<p className="font-satoshi text-[28px] font-medium">Generate Payment Link</p>
			<p className="text-lg text-black-400">
				Generate a payment Link for a third party to buy Bitcoin sent directly to
				your wallet on your behalf
			</p>
			<div className="my-8 flex w-full flex-col">
				<div
					className={`flex w-full ${reversed ? "flex-col-reverse" : "flex-col"}`}>
					<CurrencyInput
						amount={fields.amount}
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
							onClick={() => setReversed(!reversed)}
							className="absolute left-[3%] top-1/2 grid aspect-square w-8 -translate-y-1/2 place-items-center rounded-full border bg-[#111]">
							<ArrowsDownUp size={20} />
						</button>
					</div>
					<CurrencyInput
						amount={fields.amountInSats}
						currency="SATS"
						inputName="amountInSats"
						error={error.amount}
						disableInput={!reversed}
						disableSelect
						handleAmountChange={handleChange}
						handleCurrencyChange={handleChange}>
						{CurrencyList.map((currency) => (
							<option key={currency} value={currency}>
								{currency}
							</option>
						))}
					</CurrencyInput>
				</div>
				<p className="flex items-center gap-1 text-[14px] text-black-400">
					<WarningCircle className="text-alt-orange-100" />
					Exchange rate: 1 BTC = {formatCurrency(props.exchangeRate.pricePerBtc)}
				</p>
			</div>
			<div className="relative my-6">
				{/* <p className="text-[14px] absolute right-2">Please paste in your wallet address here</p> */}
				<Input
					typed="text"
					name="walletAddress"
					value={fields.walletAddress}
					onChange={handleChange}
					label="Wallet Address"
					error={error.walletAddress}
					pasteBtn={
						<button
							type="button"
							onClick={props.pasteWalletAddress}
							className="flex items-center gap-1 px-2 text-xs uppercase text-green-100">
							paste <Copy size={14} />
						</button>
					}
				/>
			</div>
			<div className="mb-10 mt-6">
				<Input
					typed="text"
					name="narration"
					value={fields.narration}
					onChange={handleChange}
					label="Narration"
				/>
			</div>
			<div className="pb-10">
				<Button
					type="button"
					onClick={handleSubmit}
					disabled={loading}
					width="w-full">
					{loading ? <Spinner /> : "Generate Link"}
				</Button>
			</div>
		</div>
	)
}

export default LinkGenerateInit
