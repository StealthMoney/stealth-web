import SplashScreen from "@/components/SplashScreen";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="grid grid-cols-5 min-h-screen bg-stealth-black">
                <SplashScreen />
                {children}
            </body>
        </html>
    )
}
