import { Profile } from "@/types/profile"
import Image from "next/image"

export const Header = ({ profile }: { profile: Profile }) => {
    return (
        <div className="flex justify-between items-center px-8 h-[80px] py-10 text-white-100 text-lg bg-black-100 border-b-[1px] border-t-0 border-b-white-700">
            <p>Dashboard</p>
            <div className="flex items-center gap-8">
                <button className="text-white font-bold rounded">
                    <Image
                        src="/notification.svg"
                        alt="logo"
                        width={30}
                        height={30}
                    />
                </button>
                <button className="flex items-center gap-3 text-[14px]">
                    <p className="rounded-full bg-orange-100 px-3 py-1">TI</p>
                    <p className={`${profile.firstName && "capitalize"}`}>
                        {profile.firstName ?? profile.email}
                    </p>
                    <Image
                        src="/chevron-down.svg"
                        alt="logo"
                        width={20}
                        height={20}
                    />
                </button>
            </div>
        </div>
    )
}
