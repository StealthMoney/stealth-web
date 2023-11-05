import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import AuthProvider from "./context/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

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
            <body style={{"backgroundColor": "#010101"}}>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    )
}
