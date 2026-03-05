"use client"

import { useState } from "react"
import { ExchangeRateProps, PaymentDetailsProps } from "@/types/price"
import Processing from "./processing"
import Success from "./success"
import Payment from "./payment"
import Init from "./init"
import { UserProps } from "@/types/profile"

type BuyState = "init" | "payment" | "processing" | "success"

interface Props {
	chosenCurrency: "BTC" | "USDT"
	paymentConfig: UserProps["physicalWallets"] | []
	amount: string
	currency: string
	exchangeRate: ExchangeRateProps["data"]
	dismiss: () => void
}

export type PaymentDetails = Pick<
	PaymentDetailsProps["data"],
	| "accountNumber"
	| "accountName"
	| "bankName"
	| "paymentReference"
	| "feeAmount"
	| "amountDue"
	| "assetValue"
	| "amount"
	| "narration"
	| "assetAmount"
>

const InstantBuy = (props: Props) => {
	const [screen, setScreen] = useState<BuyState>("init")
	const [txnHash, setTxnHash] = useState("")
	const [paymentState, setPaymentState] = useState("PENDING")

	const [depositInfo, setDepositInfo] = useState<PaymentDetails>({
		accountNumber: "",
		accountName: "",
		bankName: "",
		paymentReference: "",
		feeAmount: "",
		amountDue: "",
		assetValue: "",
		amount: "",
		narration: "",
		assetAmount: "",
	})
	const [fields, setFields] = useState({
		amount: props.amount.replace(/,/g, ""),
		currency: props.currency,
		assetValue: "",
		narration: "",
		walletAddress: "",
		walletId: "",
		usexpub: false,
		assetCurrency: "",
		network: "",
	})

	const pasteWalletAddress = async () => {
		navigator.clipboard.readText().then((text) => {
			if (text) {
				setFields({ ...fields, walletAddress: text })
			}
		})
	}

	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
			| { target: { name: string; value: boolean | string } }
	) => {
		const { name, value } = e.target
		if (
			(name === "amount" || name === "assetValue") &&
			typeof value === "string"
		) {
			setFields({ ...fields, [name]: value.replace(/,/g, "") })
		} else {
			setFields({ ...fields, [name]: value })
		}
	}

	return (
		<div className="min-h-[70dvh] w-full">
			{screen === "init" && (
				<Init
					chosenCurrency={props.chosenCurrency}
					paymentConfig={props.paymentConfig}
					fields={fields}
					handleChange={handleChange}
					exchangeRate={props.exchangeRate}
					pasteWalletAddress={pasteWalletAddress}
					setDepositInfo={setDepositInfo}
					setAssetValue={(value: string) =>
						setFields({ ...fields, assetValue: value })
					}
					next={() => setScreen("payment")}
					close={() => props.dismiss()}
				/>
			)}
			{screen === "payment" && (
				<Payment
					chosenCurrency={props.chosenCurrency}
					amount={fields.amount}
					depositInfo={depositInfo}
					next={() => setScreen("processing")}
					previous={() => setScreen("init")}
					close={() => props.dismiss()}
					paymentState={paymentState}
					setPaymentState={setPaymentState}
				/>
			)}
			{screen === "processing" && (
				<Processing
					chosenCurrency={props.chosenCurrency}
					amountPayable={depositInfo.amountDue}
					paymentReference={depositInfo.paymentReference}
					setTxnHash={(value) => setTxnHash(value)}
					paymentState={paymentState}
					setPaymentState={setPaymentState}
					next={() => setScreen("success")}
				/>
			)}
			{screen === "success" && (
				<Success
					chosenCurrency={props.chosenCurrency}
					txnHash={txnHash}
					next={() => props.dismiss()}
				/>
			)}
		</div>
	)
}

export default InstantBuy
