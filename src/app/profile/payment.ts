"use server"

import { auth } from "@/auth"
import endpoints from "@/config/endpoints"

export const getPaymentDetails = async ({
    amount,
    narration,
    walletAddress,
    amountInSats
}: {
    amount: string
    narration: string
    walletAddress: string
    amountInSats: number
}) => {
    const url = endpoints().payment["get-details"]
    const session = await auth()
    if (!session) {
        return null
    }
    const { accessToken } = session

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ amount, narration, walletAddress, amountInSats })
    })
    if (!res.ok) {
        console.log(res)
        return { error: true, message: "Something went wrong" }
    }
    const paymentDetail = await res.json()
    return { error: false, paymentDetail }
}

export const getPaymentStatus = async (reference: string) => {
    const url = endpoints().payment["get-status"]
    const session = await auth()
    if (!session) {
        return null
    }
    const { accessToken } = session

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ referenceNumber: reference })
    })
    if (!res.ok) {
        console.log(res)
        return { error: true, message: "Something went wrong" }
    }
    const paymentStatus = await res.json()
    return { error: false, paymentStatus }
}
