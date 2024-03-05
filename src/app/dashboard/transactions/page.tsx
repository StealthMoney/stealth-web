import TransactionsTable from "@/components/transactions-table"
import Form from "./form"
import { getAllPaymentDetails } from "@/app/helpers/get-price"

const Page = async () => {
	const transactionsRes = await getAllPaymentDetails()

	if (transactionsRes instanceof Error) {
		return (
			<div className="flex h-screen flex-col items-center justify-center">
				<h1 className="mt-4 font-satoshi text-lg font-bold">
					Failed to fetch transactions!
				</h1>
				<p className="mt-2 text-sm text-gray-500">{transactionsRes.message}</p>
			</div>
		)
	}
	return (
		<div className="h-4/5 w-full">
			<div className="mb-6 flex w-full items-center justify-between">
				<p className="font-satoshi text-2xl font-bold capitalize">Transactions</p>
				<Form />
			</div>
			<TransactionsTable transactions={transactionsRes.data} />
		</div>
	)
}

export default Page
