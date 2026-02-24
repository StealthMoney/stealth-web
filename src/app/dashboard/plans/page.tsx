import Create from "@/components/plan/create-plan/create"
import { getExchangeRate } from "@/app/helpers/get-price"
import { getProfile } from "@/app/helpers/get-profile"
import { PageParamProps } from "@/types/transactions"

const Page = async ({ searchParams }: PageParamProps) => {
	const resolvedParams = await searchParams
	const rate = await getExchangeRate(resolvedParams.assetCurrency ?? "BTC")
	const profile = await getProfile()
	return <Create exchangeRate={rate} profile={profile} />
}

export default Page
