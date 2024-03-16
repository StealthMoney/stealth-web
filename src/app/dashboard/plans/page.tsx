import Create from "@/components/plan/create-plan/create"
import { getExchangeRate } from "@/app/helpers/get-price"

const Page = async () => {
	const rate = await getExchangeRate()
	return <Create exchangeRate={rate} />
}

export default Page
