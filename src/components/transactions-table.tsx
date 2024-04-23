"use client"

import { useState } from "react"

import { formatBtcAddress } from "@/app/helpers/string"
import { formatCurrency } from "@/app/helpers/amount"
import TransactionItem from "./transaction-item"
import { formatDate } from "@/app/helpers/time"
import { Dialog } from "."
import { PaymentDetail, PaymentStatusProps, fetchMeta } from "@/types/price"
import { SATS_PER_BTC } from "@/config/constants"

interface Props {
	transactions: PaymentDetail[]
}

const StatusColor = {
	PAID: "bg-green-1200 text-green-100",
	ALREADY_PROCESSED: "bg-green-1200 text-green-100",
	IN_PROGRESS: "bg-orange-1200 text-orange-100",
	PENDING: "bg-orange-1200 text-orange-100",
	INITIATED: "bg-orange-1200 text-orange-100",
	FAILED: "bg-red-1200 text-red-100",
}

const TransactionsTable = ({ transactions }: Props) => {
	return (
		<>
			<div className="h-[73vh] w-full overflow-auto rounded-md border border-white-700 bg-black-700 p-6 text-white-300">
				<TableHead />
				<TableBody transactions={transactions} />
			</div>
		</>
	)
}

export default TransactionsTable

export const TableHead = () => (
	<div className="hidden w-full items-center gap-1 border-b px-2 py-5 lg:flex">
		<p className="w-[100px]">No.</p>
		<p className="flex flex-1">Date</p>
		<p className="flex flex-1">Amount</p>
		<p className="flex flex-1">Value (BTC)</p>
		<p className="flex flex-1">Wallet Address</p>
		<p className="flex flex-1">Status</p>
	</div>
)

export const TableBody = ({
	transactions,
}: {
	transactions: PaymentDetail[]
}) => {
	const [selected, setSelected] = useState<PaymentDetail | null>(null)

	return (
		<>
			<Dialog isOpen={!!selected} onDismiss={() => setSelected(null)}>
				{selected && <TransactionItem transaction={selected} />}
			</Dialog>
			<div className="w-full overflow-y-auto">
				{!transactions.length ? (
					<div className="grid w-full place-items-center py-20">
						<p className="font-satoshi text-xl font-medium">No transactions yet.</p>
					</div>
				) : (
					<div className="w-full overflow-y-auto">
						{transactions
							.sort(
								(a, b) =>
									Number(new Date(b?.createdDate)) - Number(new Date(a?.createdDate))
							)
							.map((transaction, index) => (
								<div
									key={transaction?.id}
									onClick={() => setSelected(transaction)}
									className="hover my-5 flex w-full cursor-pointer flex-col gap-1 rounded-md bg-[#191919] px-2 py-4 transition-all hover:bg-black-600 lg:my-auto lg:flex-row lg:items-center lg:rounded-none lg:bg-[transparent]">
									<div className="flex w-full">
										<div className="flex w-2/4 flex-col lg:w-full lg:flex-row">
											<div className="hidden lg:flex lg:w-[100px]">{index + 1}</div>
											<div className="flex flex-1">
												{formatDate(new Date(transaction?.createdDate))}
											</div>
											<div className="flex flex-1">
												{formatCurrency(+transaction?.amountDue || 0)}
											</div>
											<div className="flex flex-1">
												{(Number(transaction?.amountInSats) / SATS_PER_BTC || 0).toFixed(8)}
											</div>
											<div className="flex flex-1">
												{formatBtcAddress(transaction.walletAddress ?? "")}
											</div>
										</div>
										<div className="w-2/4 lg:flex lg:w-1/4 lg:flex-1">
											<div className="flex items-baseline justify-end">
												<p
													className={`w-fit rounded p-1 text-[10px] capitalize ${
														StatusColor[transaction?.paymentState]
													}`}>
													{transaction?.paymentState?.split("_").join(" ")}
												</p>
											</div>
										</div>
									</div>
								</div>
							))}
					</div>
				)}
			</div>
		</>
	)
}
