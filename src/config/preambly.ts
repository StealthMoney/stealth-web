import axios from "axios"

export const identityPassApi = axios.create({
	baseURL: process.env.PREMBLY_BASE_URL,
	headers: {
		"x-api-key": process.env.PREMBLY_API_KEY,
		app_id: process.env.PREMBLY_APP_ID,
		"Content-Type": "application/json",
		accept: "application/json",
	},
})

export const fetchBankCodeList = async () => {
	try {
		const response = await axios.get(process.env.BANK_NAME_FETCH || "")
		return response.data
	} catch (error) {
		console.error("Error fetching bank codes:", error)
		return null
	}
}

interface qwuery {
	bankName: string
	AccountNumber: string
}
interface bvnQuery {
	bvn: string
}

export const fetchAccountDetails = async ({
	bankName,
	AccountNumber,
}: qwuery) => {
	const { data } = await axios.post(
		"/api/verify_bankaccount",
		{
			bankName,
			AccountNumber,
		},
		{ headers: { "Content-Type": "application/json" } }
	)
	return data
}

export const verifyBvn = async ({ bvn }: bvnQuery) => {
	const { data } = await axios.post(
		"/api/verify_bvn",
		{
			bvn,
		},
		{ headers: { "Content-Type": "application/json" } }
	)
	return data
}
