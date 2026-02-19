import { NextRequest, NextResponse } from "next/server"
import endpoints from "@/config/endpoints"

export async function POST(request: Request) {
	const url = endpoints().payment["get-details"]
	const payload = await request.json()
	console.log(payload, "ispayloas")

	try {
		const res = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				narration: payload.narration,
				walletAddress: payload.walletAddress,
				assetCurrency: payload.assetCurrency,
				network: payload.network,
				amount: payload.amount,
			}),
		})
		console.log(res, "is res")

		if (!res.ok) {
			return NextResponse.json(
				{
					success: false,
					message: "Transaction failed. Unable to generated payment details",
				},
				{ status: 500 }
			)
		}
		const data = await res.json()
		return NextResponse.json(
			{ success: true, message: "Transaction successful", data },
			{ status: 201 }
		)
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "User not created" },
			{ status: 500 }
		)
	}
}
