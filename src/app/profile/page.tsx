import { redirect } from "next/navigation"

import { Profile as ProfileType } from "@/types/profile"

import { getProfile } from "./get-profile"
import { getExchangeRate } from "./get-price"
import { Profile } from "."

export default async function Page() {
    const profileData: ProfileType = await getProfile()
    const exchangeRate = await getExchangeRate()
    if (exchangeRate.error) console.log(exchangeRate)

    if (!profileData || profileData instanceof Error) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div>
                    <h1 className="text-4xl font-bold text-center">
                        You are not signed in
                    </h1>
                    <p className="text-center">
                        You can only see this if you are signed in.
                    </p>
                    <div className="mt-8 flex items-center justify-center flex-col">
                        <button
                            className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() =>
                                redirect(
                                    "/api/auth/signin?callbackUrl=/profile"
                                )
                            }
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </main>
        )
    }
    return (
        <main className="flex flex-col gap-y-6 bg-black-100 h-full px-6 py-8">
            <p
                className={`text-white-100 font-medium text-[24px] ${
                    profileData.firstName && "capitalize"
                }`}
            >
                Hello {profileData.firstName ?? profileData.email},
            </p>
            <Profile exchangeRate={exchangeRate} />
        </main>
    )
}
