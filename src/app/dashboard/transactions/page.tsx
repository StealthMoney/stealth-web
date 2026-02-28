import TransactionsTable from "@/components/transactions-table"
import Form from "./form"
import { getAllPaymentDetails } from "@/app/helpers/get-price"
import FilteredTransactions from "./filteredTransactions"
import { normalizeAssetCurrency } from "@/shared/functions"

interface PageProps {
	searchParams: Promise<{
		assetCurrency?: "USDT" | "SATS"
		page?: string
		size?: string
	}>
}

export default async function Page({ searchParams }: PageProps) {
	const resolvedParams = await searchParams
	const transactionsRes = await getAllPaymentDetails({
		assetCurrency: normalizeAssetCurrency(resolvedParams.assetCurrency ?? "SATS"),
		page: Number(resolvedParams.page ?? 0),
		size: Number(resolvedParams.size ?? 10),
		sort: "createdDate,desc",
	})

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
		<FilteredTransactions
			totalPages={transactionsRes.data.totalPages}
			currentPage={transactionsRes.data.pageNo}
			initialTransactions={transactionsRes.data.content}
		/>
	)
}
