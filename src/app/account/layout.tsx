import Image from "next/image"

import { logo, wallet } from "@/assets/images"

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<main className="flex h-screen w-screen items-center overflow-hidden text-white-100">
			<div className="h-full w-full bg-black-800 p-12 lg:h-auto lg:w-[45%]">
				<div className="mt-60 flex items-center">
					<Image src={logo} alt="stealth money logo" />
				</div>
				<p className="my-11 w-[390px] font-satoshi text-[32px] font-bold">
					Fully control and build your Bitcoin wealth with Stealth Money
				</p>
				<Image
					src={wallet}
					alt="3D wallet"
					className="w-full object-cover"
					priority
				/>
			</div>
			<div className="h-full w-full flex-1 overflow-y-auto bg-black-100 py-20 pl-[72px] pr-[162px] lg:w-[55%]">
				{children}
			</div>
		</main>
	)
}
