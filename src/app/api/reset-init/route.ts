import endpoints from "@/config/endpoints"
import { NextResponse } from "next/server"

export async function POST(request: Request, response: NextResponse) {
	const url = endpoints().auth["init-reset-password"]
	const payload = await request.json()
	if (!payload) {
		return NextResponse.json(
			{ success: false, message: "Invalid JSON body!" },
			{ status: 400 }
		)
	}
	try {
		const res = await fetch(url, {
			method: "POST",
			body: JSON.stringify(payload),
			headers: { "Content-Type": "application/json" },
		})
		if (res.status === 200 || res.ok) {
			return NextResponse.json(
				{
					success: true,
					message: "A reset mail has been sent to your email address!",
				},
				{ status: 201 }
			)
		} else if (res.status === 400) {
			return NextResponse.json(
				{ success: false, message: "Bad request" },
				{ status: 400 }
			)
		} else {
			return NextResponse.json(
				{ success: false, message: "Internal server error!" },
				{ status: 500 }
			)
		}
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Internal server error!" },
			{ status: 500 }
		)
	}
}
