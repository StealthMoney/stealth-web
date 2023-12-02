import { auth } from "@/auth"
import endpoints from "@/config/endpoints"

export const getExchangeRate = async () => {
    const session = await auth()
    if (!session) {
        return null
    }
    const { accessToken } = session
    const url = endpoints().price.btc
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        // revalidate data every 30 seconds
        next: { revalidate: 30, tags: ["price"] }
    })
    if (!response.ok) {
        return { error: "Failed to fetch exchange rate" }
    }
    const data = await response.json()
    return data
}
