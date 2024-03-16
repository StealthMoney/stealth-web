import { Nunito } from "next/font/google"
import LocalFont from "next/font/local"
import type { Metadata } from "next"

import AuthProvider from "@/app/context/AuthProvider"
import QueryProvider from "@/app/context/QueryProvider"
import "./globals.css"

const nunito = Nunito({
	style: ["normal", "italic"],
	subsets: ["latin"],
	display: "swap",
	variable: "--nunito",
})

const satoshi = LocalFont({
	src: [
		{ path: "../assets/fonts/Satoshi-Light.otf", weight: "300" },
		{ path: "../assets/fonts/Satoshi-Regular.otf", weight: "400" },
		{ path: "../assets/fonts/Satoshi-Medium.otf", weight: "500" },
		{ path: "../assets/fonts/Satoshi-Bold.otf", weight: "700" },
		{ path: "../assets/fonts/Satoshi-Black.otf", weight: "900" },
	],
	variable: "--satoshi",
})

export const metadata: Metadata = {
	title: "Stealth Money",
	description:
		"Stealth Money is a platform where you secure your financial future with Bitcoin savings and self custody.",
	openGraph: {
		type: "website",
		url: "https://app.stealth.money",
		title: "Stealth Money",
		description:
			"Stealth Money is a platform where you secure your financial future with Bitcoin savings and self custody.",
		images: [
			{
				url: "https://app.stealth.money/assets/logo.png",
				alt: "Stealth Money",
			},
		],
	},
	other: {
		"theme-color": "#000000",
	},
	twitter: {
		card: "summary",
		creator: "@stealthmoney_",
		title: "Stealth Money",
		description:
			"Stealth Money is a platform where you secure your financial future with Bitcoin savings and self custody.",
		images: ["https://app.stealth.money/assets/logo.png"],
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={`${nunito.variable} ${satoshi.variable}`}>
				<QueryProvider>
					<AuthProvider>{children}</AuthProvider>
				</QueryProvider>
			</body>
		</html>
	)
}
