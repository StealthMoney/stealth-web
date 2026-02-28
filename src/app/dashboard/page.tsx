// import { unstable_noStore as noStore } from "next/cache"
import { RedirectClient } from "@/components/shared/redirectClient"
import { getAllPaymentDetails, getExchangeRate } from "../helpers/get-price"
import { getProfile } from "../helpers/get-profile"
import Client from "./client"
import { ExpiredSessionError } from "@/shared/error"
import { auth } from "@/auth"
import {
	verifyAuthTokenExpiry,
	normalizeAssetCurrency,
} from "@/shared/functions"
export const dynamic = "force-dynamic"
import { PageParamProps } from "@/types/transactions"

const Page = async ({ searchParams }: PageParamProps) => {
	const resolvedParams = await searchParams
	const data = await auth()
	let shouldRedirect = await verifyAuthTokenExpiry(data)

	if (shouldRedirect) {
		return <RedirectClient to="/account/login" />
	}

	const transactionsRes = await getAllPaymentDetails({
		assetCurrency: normalizeAssetCurrency(resolvedParams.assetCurrency ?? "SATS"),
		page: Number(resolvedParams.page ?? 0),
		size: Number(resolvedParams.size ?? 10),
		sort: "createdDate,desc",
	})

	const rate = await getExchangeRate(resolvedParams.assetCurrency ?? "BTC")
	const profile = await getProfile()
	console.log(profile, "is profile")

	if (rate instanceof Error) {
		return (
			<div className="flex h-screen flex-col items-center justify-center">
				<h1 className="mt-4 font-satoshi text-lg font-bold">
					Failed to fetch exchange rate!
				</h1>
				<p className="mt-2 text-sm text-gray-500">{rate.message}</p>
			</div>
		)
	}

	if (profile instanceof Error) {
		if (profile instanceof ExpiredSessionError) {
			return <RedirectClient to="/account/login" />
		}
		return (
			<div className="flex h-screen flex-col items-center justify-center">
				<h1 className="mt-4 font-satoshi text-lg font-bold">
					Failed to fetch user profile!
				</h1>
				<p className="mt-2 text-sm text-gray-500">{profile.message}</p>
			</div>
		)
	}

	return (
		<Client
			exchangeRate={rate}
			profile={profile}
			transactions={transactionsRes.data.content ?? []}
			totalPages={transactionsRes.data.totalPages}
			currentPage={transactionsRes.data.pageNo}
		/>
	)
}

export default Page
