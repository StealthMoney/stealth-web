
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-screen grid place-content-center">
                {children}
            </body>
        </html>
    )
}
