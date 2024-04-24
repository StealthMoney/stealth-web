"use client"

import jwt_decode from "jwt-decode"
import { SessionProvider, signOut, useSession } from "next-auth/react"
import { useEffect } from "react"

import { DecodedJwt } from "@/types/jwt"

export function SessionCheckComponent({
	children,
}: {
	children: React.ReactNode
}) {
	const { data: session, status } = useSession()
	const isLoggedOut = status === "unauthenticated"

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (!session?.accessToken && !isLoggedOut) {
				signOut({ redirect: false })
				return
			}

			if (status === "authenticated") {
				const decodedToken = jwt_decode(session?.accessToken ?? "") as DecodedJwt
				if (!decodedToken) {
					signOut({ redirect: false })
					return
				}
				const expires = new Date((decodedToken.exp ?? 0) * 1000)
				if (expires < new Date()) {
					signOut({
						redirect: false,
					})
				}
			}
		}, 30000) // check every 30 seconds

		return () => clearInterval(intervalId)
	}, [session, status, isLoggedOut])

	return <>{children}</>
}

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<SessionProvider>
			<SessionCheckComponent>{children}</SessionCheckComponent>
		</SessionProvider>
	)
}
