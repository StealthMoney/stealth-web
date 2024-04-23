import Image from "next/image"

import { logo, wallet } from "@/assets/images"

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<main className="bg-black-800">
			<section className="m-auto flex h-screen w-screen max-w-[1440px] items-center justify-center overflow-hidden text-white-100">
				<div className="h-full w-full bg-black-800 p-12 md:w-[45%] hidden md:block">
					<div className="mb-11 flex items-center">
						<Image src={logo} alt="stealth money logo" />
					</div>
					<p className="lg:w-[390px] md:w-[300px] font-satoshi text-[32px] font-bold">
						Fully control and build your Bitcoin wealth with Stealth Money
					</p>
					<Image
						src={wallet}
						alt="3D wallet"
						className="w-full object-cover"
						priority
					/>
				</div>
				<div className="h-full w-full flex-1 overflow-y-auto bg-black-100 py-20 lg:pl-[72px] lg:pr-[162px] px-4 lg:w-[55%]">
					{children}
				</div>
			</section>
		</main>
	)
}
