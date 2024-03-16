import { useState } from "react"

import { ExchangeRateProps } from "@/types/price"
import Success from "./success"
import Init from "./init"

type BuyState = "init" | "success"

interface Props {
	amount: string
	currency: string
	exchangeRate: ExchangeRateProps["data"]
}

const GeneratePayLink = (props: Props) => {
	const [screen, setScreen] = useState<BuyState>("init")
	const [generatedLink, setGeneratedLink] = useState("")
	const [success, setSuccess] = useState(false)

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
					setAmountInSats={(value: string) =>
						setFields({ ...fields, amountInSats: value })
					}
					next={() => setScreen("success")}
				/>
			)}
			{screen === "success" && <Success generatedLink={generatedLink} />}
		</div>
	)
}

export default GeneratePayLink
