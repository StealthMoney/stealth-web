import axios from "axios"

export const identityPassApi = axios.create({
	baseURL: process.env.PREMBLY_BASE_URL,
	headers: {
		"x-api-key": process.env.PREMBLY_API_KEY,
		"app_id": process.env.PREMBLY_APP_ID,
		"Content-Type": "application/json",
		accept: "application/json",
	},
})
