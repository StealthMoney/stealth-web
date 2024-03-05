"use client"

import { ArrowsDownUp, Copy, WarningCircle } from "@phosphor-icons/react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

import { formatCurrency, getCurrencyValue } from "@/app/helpers/amount"
import { getPaymentDetails } from "@/app/helpers/get-price"
import { CurrencyInput } from "@/components/shared/input"
import { Button, Input, Spinner } from "@/components"
import { ExchangeRateProps } from "@/types/price"
import { TXN_CHARGE } from "@/config/constants"

interface Props {
	exchangeRate: ExchangeRateProps["data"]
	fields: {
		amount: string
		currency: string
		amountInSats: string
		narration?: string
		walletAddress: string
	}
	handleChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => void
	pasteWalletAddress: () => void
	setAmountInSats: (value: string) => void
	setDepositInfo: Dispatch<
		SetStateAction<{
			accountNumber: string
			accountName: string
			bankName: string
			paymentReference: string
		}>
	>
	next: () => void
}

const CurrencyList = ["NGN", "USD", "SATS"]

const Init = (props: Props) => {
	const [reversed, setReversed] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const { fields, handleChange } = props

	const handleSubmit = async () => {
		const { amount, amountInSats, narration, walletAddress } = fields
		if (!amount) {
			return alert("Please enter amount!")
		}
		if (!walletAddress) {
			return alert("Please enter wallet address!")
		}
		setLoading(true)
		try {
			const amountToPay = Number(amount) + TXN_CHARGE
			const res = await getPaymentDetails({
				amount: amountToPay,
				amountInSats,
				walletAddress,
				narration,
			})
			if (res instanceof Error) {
				setError(res.message)
				setLoading(false)
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
			<p className="font-satoshi text-[28px] font-medium">Instant Buy</p>
			<p className="text-lg text-black-400">
				Please enter narration and your wallet address correctly
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
				<p className="flex items-center gap-1 text-xs text-black-400">
					<WarningCircle className="text-alt-orange-100" />
					Exchange rate: 1BTC = {formatCurrency(props.exchangeRate.pricePerBtc)}
				</p>
			</div>
			<div className="my-6">
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
				<p className="text-xs">Please paste in your wallet address here</p>
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
					{loading ? <Spinner /> : "Buy Now"}
				</Button>
			</div>
		</div>
	)
}

export default Init
