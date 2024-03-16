import { useState } from "react"

import { ExchangeRateProps, PaymentDetailsProps } from "@/types/price"
import Processing from "./processing"
import Success from "./success"
import Payment from "./payment"
import Init from "./init"

type BuyState = "init" | "payment" | "processing" | "success"

interface Props {
	amount: string
	currency: string
	exchangeRate: ExchangeRateProps["data"]
}

export type PaymentDetails = Pick<
	PaymentDetailsProps["data"],
	| "accountNumber"
	| "accountName"
	| "bankName"
	| "paymentReference"
	| "feeAmount"
	| "amountDue"
	| "amountInSats"
	| "amount"
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
		amountInSats: "",
		amount: "",
	})
	const [fields, setFields] = useState({
		amount: props.amount,
		currency: props.currency,
		amountInSats: "",
		narration: "",
		walletAddress: "",
	})

	const pasteWalletAddress = async () => {
		navigator.clipboard.readText().then((text) => {
			if (text) {
				setFields({ ...fields, walletAddress: text })
			}
		})
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => setFields({ ...fields, [e.target.name]: e.target.value })

	return (
		<div className="min-h-[70dvh] w-full">
			{screen === "init" && (
				<Init
					fields={fields}
					handleChange={handleChange}
					exchangeRate={props.exchangeRate}
					pasteWalletAddress={pasteWalletAddress}
					setDepositInfo={setDepositInfo}
					setAmountInSats={(value: string) =>
						setFields({ ...fields, amountInSats: value })
					}
					next={() => setScreen("payment")}
				/>
			)}
			{screen === "payment" && (
				<Payment
					amount={fields.amount}
					depositInfo={depositInfo}
					next={() => setScreen("processing")}
					previous={() => setScreen("init")}
					paymentState={paymentState}
					setPaymentState={setPaymentState}
				/>
			)}
			{screen === "processing" && (
				<Processing
					amountPayable={depositInfo.amountDue}
					paymentReference={depositInfo.paymentReference}
					setTxnHash={(value) => setTxnHash(value)}
					paymentState={paymentState}
					setPaymentState={setPaymentState}
					next={() => setScreen("success")}
				/>
			)}
			{screen === "success" && <Success txnHash={txnHash} />}
		</div>
	)
}

export default InstantBuy
