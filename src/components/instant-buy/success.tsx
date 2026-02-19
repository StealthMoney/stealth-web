"use client"
import { WarningOctagon } from "@phosphor-icons/react"
import { Cross1Icon } from "@radix-ui/react-icons"

interface Props {
	chosenCurrency: "BTC" | "USDT"
	txnHash: string
	next: () => void
}

const Success = (props: Props) => {
	return (
		<div className="flex h-full w-full flex-col items-center">
			<button
				type="button"
				onClick={props.next}
				className="hover:text-white absolute right-4 top-4 text-red-100"
				aria-label="Close">
				<Cross1Icon fontSize={32} />
			</button>
			<div className="my-8">
				<WarningOctagon
					weight="fill"
					className={`text-9xl ${
						props.chosenCurrency === "BTC" ? "text-alt-orange-100" : "text-green-500"
					}`}
				/>
			</div>
			<p className="font-satoshi text-4xl font-bold">Processing!</p>
			<p className="my-4 text-center text-xl text-black-300">
				Your {props.chosenCurrency === "BTC" ? "Bitcoin" : "USDT"} purchase is being
				processed. You will receive an email notification once it has been
				processed.
			</p>

			<p
				className={`my-1 text-center text-xl ${
					props.chosenCurrency === "BTC" ? "text-alt-orange-100" : "text-green-500"
				}`}>
				(Kindly check your spam if not seen in mail inbox.)
			</p>

			{/* // TODO: uncomment when mempool.space is implemented */}
			{/* <p className="mb-44 max-w-[90%] break-words text-center text-alt-orange-100">
				{props.txnHash}
			</p> */}
			{/* <Button
				hidden
				as="a"
				href={`https://mempool.space/tx/${props.txnHash}`}
				target="_blank"
				width="w-full">
				View Transaction
			</Button> */}
		</div>
	)
}

export default Success
