import endpoints from "@/config/endpoints"
import { NextResponse } from "next/server"
import { identityPassApi } from "@/config/preambly"

// https://api.prembly.com
export async function POST(req: Request) {
	// const url = endpoints().kyc.validate

	if (!req.body) {
		return NextResponse.json(
			{ success: false, message: "Request body is missing" },
			{ status: 400 }
		)
	}

	const payload = await req.json().catch(() => null)

	if (!payload) {
		return NextResponse.json(
			{ success: false, message: "Invalid JSON format" },
			{ status: 400 }
		)
	}

	try {
		const { bankName, AccountNumber, Bvn, faceCard, gender } = payload

		if (!bankName || !AccountNumber || !Bvn || !faceCard || !gender)
			return NextResponse.json(
				{ success: false, message: "bad request" },
				{ status: 400 }
			)

		const AccountNumberVerification = await identityPassApi.post(
			"/identitypass/verification/bank_account/basic",
			{ number: AccountNumber, bank_code: "..." } // update needed here
		)

		console.log(AccountNumberVerification)

		return NextResponse.json(
			{
				success: true,
				message: "validation Successful",
				data: AccountNumberVerification.data,
			},
			{ status: 200 }
		)
	} catch (err) {
		console.log("Something went wrong with KYC request", err)
		return NextResponse.json(
			{ success: false, message: "problem with request" },
			{ status: 500 }
		)
	}
}
