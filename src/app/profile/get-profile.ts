import { auth } from "@/auth"
import endpoints from "@/config/endpoints"

export const getProfile = async () => {
    const session = await auth()
    if (!session) {
        return null
    }
    const { accessToken } = session

    const url = endpoints().user.profile
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    if (!res.ok) {
        throw new Error("Failed to fetch user profile")
    }
    const profile = await res.json()

    return profile
}
