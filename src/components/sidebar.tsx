import Image from "next/image"
import Link from "next/link"

export const Sidebar = () => {
    return (
        <aside className="fixed top-0 left-0 w-[276px] h-full flex flex-col items-start gap-[64px] bg-black-100 p-7 border-r-[1px] border-r-white-700">
            <div className="flex flex-col items-center text-white-100">
                <Link href="#">
                    <Image
                        src="/stealth.svg"
                        alt="logo"
                        width={100}
                        height={100}
                    />
                </Link>
            </div>
            <div className="flex flex-col items-start text-left font-thin text-white-100 gap-y-[55px]">
                <Link
                    href="#"
                    className="flex justify-start items-center gap-3 w-full"
                >
                    <Image
                        src="/square.svg"
                        alt="logo"
                        width={20}
                        height={20}
                    />
                    <p className="text-lg">Dashboard</p>
                </Link>
                <Link
                    href={"#"}
                    className="flex justify-start items-center gap-3 w-full"
                >
                    <Image src="/list.svg" alt="logo" width={20} height={20} />
                    <p className="text-lg">Transactions</p>
                </Link>
                <Link
                    href={"#"}
                    className="flex justify-start items-center gap-3 w-full"
                >
                    <Image
                        src="/calender.svg"
                        alt="logo"
                        width={20}
                        height={20}
                    />
                    <p className="text-lg">Plans</p>
                </Link>
                <Link
                    href={"#"}
                    className="flex justify-start items-center gap-3 w-full"
                >
                    <Image src="/user.svg" alt="logo" width={20} height={20} />
                    <p className="text-lg">Profile</p>
                </Link>
                <Link
                    href={"#"}
                    className="flex justify-start items-center gap-3 w-full"
                >
                    <Image src="/stack.svg" alt="logo" width={20} height={20} />
                    <p className="text-lg">Resources</p>
                </Link>
                <Link
                    href={"#"}
                    className="flex justify-start items-center gap-3 w-full"
                >
                    <Image
                        src="/headset.svg"
                        alt="logo"
                        width={20}
                        height={20}
                    />
                    <p className="text-lg">Help and Support</p>
                </Link>
            </div>
            <div className="flex flex-col items-center text-white-100">
                <Link href={"#"} className="flex justify-start items-center gap-3 w-full">
                    <Image
                        src="/signout.svg"
                        alt="logo"
                        width={20}
                        height={20}
                    />
                    <p className="text-center text-red-100 text-lg">Log out</p>
                </Link>
            </div>
        </aside>
    )
}
