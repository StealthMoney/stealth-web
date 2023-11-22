import "./globals.css"
import type { Metadata } from "next"
import AuthProvider from "./context/AuthProvider"
import localFont from "next/font/local"

const satoshi = localFont({ src: "../assets/Satoshi-Regular.woff2" })

export const metadata: Metadata = {
    title: "Stealth Money",
    description: "Get full control and build your Bitcoin wealth"
}

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body
                className={`${satoshi.className} bg-stealth-black text-white`}
            >
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    )
}
