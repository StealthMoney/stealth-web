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
	<div className="flex w-full items-center gap-1 border-b px-2 py-5">
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
									className="hover flex w-full cursor-pointer items-center gap-1 px-2 py-4 transition-all hover:bg-black-600">
									<div className="w-[100px]">{index + 1}</div>
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
									<div className="flex flex-1">
										<p
											className={`w-fit rounded p-1 text-[10px] capitalize ${
												StatusColor[transaction?.paymentState]
											}`}>
											{transaction?.paymentState?.split("_").join(" ")}
										</p>
									</div>
								</div>
							))}
					</div>
				)}
			</div>
		</>
	)
}
