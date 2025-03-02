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
		const { faceCard } = payload
		console.log(faceCard, "is faceCard")

		if (!faceCard)
			return NextResponse.json(
				{
					success: false,
					message: "image not given",
				},
				{ status: 400 }
			)

		const faceLivenessVerification = await identityPassApi.post(
			"/identitypass/verification/biometrics/face/liveliness_check",
			{ image: faceCard }
		)
        console.log(faceLivenessVerification, "is faceliveness verification");
        

		return NextResponse.json({
			success: true,
			message: "verification request successfull",
			data: faceLivenessVerification.data,
		})
	} catch (err) {
		console.log("Face liveness verification failed", err)
		return NextResponse.json(
			{
				success: false,
				message: "face liveness verification failed",
			},
			{ status: 500 }
		)
	}
}
