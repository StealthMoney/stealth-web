import SplashScreen from "@/components/SplashScreen"

export default function RegisterLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <main className="grid grid-cols-5 min-h-screen">
            <SplashScreen />
            {children}
        </main>
    )
}
