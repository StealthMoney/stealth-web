import { identityPassApi } from "@/config/preambly"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
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
		const { bvn } = payload
		if (!bvn) {
			return NextResponse.json(
				{
					success: false,
					message: "BVN invalid or wasn't given",
				},
				{ status: 400 }
			)
		}

		const bvnVerification = await identityPassApi.post(
			"/identitypass/verification/bvn",
			{ number: bvn }
		)

		return NextResponse.json(
			{
				success: true,
				message: "validation Successful",
				data: bvnVerification.data,
			},
			{ status: 200 }
		)
	} catch (err) {
		console.log("Error verifying bvn", err)
		return NextResponse.json(
			{ success: false, message: "BVN validation failed" },
			{ status: 500 }
		)
	}
}
