import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Profile } from "@/types/profile"

import { getProfile } from "./get-profile"

export default async function Layout({
    children
}: {
    children: React.ReactNode
}) {
    const profileData: Profile = await getProfile()
    return (
        <html lang="en">
            <body className="bg-black-100 h-screen pl-[276px] flex flex-col">
                <Sidebar />
                <Header profile={profileData} />
                {children}
            </body>
        </html>
    )
}
