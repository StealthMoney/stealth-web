import { NextResponse } from "next/server"
import { identityPassApi, fetchBankCodeList } from "@/config/preambly"
import Success from "@/components/instant-buy/success"

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
		const { bankName, AccountNumber } = payload

		// kyc verification steps:
		// 1. on the UI  when user inputs bankname and account number, validate it the account number and
		// return the name on the account so user knows if the account they provided

		// 2. if step1 was successfull validate Bvn and compare data returned from preambly with
		// user's data so if it's incorrect, return a failure message if bvn verification fails.

		// 3. if bvn verification was successful, proceed to face verification using face liveness
		// if this verification passes, data is sent to the backend marking kyc as verified or complete.

		if (!bankName || !AccountNumber)
			return NextResponse.json(
				{ success: false, message: "bad request" },
				{ status: 400 }
			)

		const getbankCode = await fetchBankCodeList()

		if (!getbankCode)
			return NextResponse.json(
				{
					success: false,
					message: "bank code was not found for given bank name!",
				},
				{ status: 404 }
			)

		let bankCode

		if (getbankCode.data) {
			bankCode = getbankCode.data.find(
				(bank: any) => bank?.name?.toLowerCase() === bankName.toLowerCase()
			)?.code
		}

		if (!bankCode) {
			return NextResponse.json(
				{ success: false, message: "Invalid bank name provided!" },
				{ status: 400 }
			)
		}

		const AccountNumberVerification = await identityPassApi.post(
			"/identitypass/verification/bank_account/basic",
			{ number: AccountNumber, bank_code: bankCode }
		)

		return NextResponse.json(
			{
				success: true,
				message: "validation Successful",
				data: AccountNumberVerification.data,
			},
			{ status: 200 }
		)
	} catch (err) {
		console.log("Something went wrong with bank verification request", err)
		return NextResponse.json(
			{ success: false, message: "problem with request" },
			{ status: 500 }
		)
	}
}
