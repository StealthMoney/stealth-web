import axios from "axios"

export const identityPassApi = axios.create({
	baseURL: process.env.PREMBLY_BASE_URL,
	headers: {
		"x-api-key": process.env.PREMBLY_API_KEY,
		app_id: process.env.PREMBLY_APP_ID,
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
interface faceQuery {
	faceCard: File | null
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

export const verifyface = async ({ faceCard }: faceQuery) => {
	if (faceCard instanceof File) {
		const base64Image = await fileToBase64(faceCard)

		const { data } = await axios.post(
			"/api/face_liveness",
			{
				faceCard: base64Image,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		)
		return data
	} else {
		throw new Error("Invalid file object")
	}
}

const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => {
			const base64String = reader.result as string
			const base64Content = base64String.split(",")[1]
			resolve(base64Content)
		}
		reader.onerror = (error) => reject(error)
	})
}
