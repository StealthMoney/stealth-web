"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import data from "@/components/plan/ongoing-plan/dummydata.json"

export default function Layout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()

	return (
		<section>
			<header className="w-full">
				<div className="mb-6 flex w-full items-center">
					<p className="font-satoshi text-2xl font-bold capitalize">
						Dollar Cost Averaging (Automated Purchase)
					</p>
				</div>
			</header>

			<nav className="text-[#555555 ] flex w-full items-center justify-start border-b border-b-[#494949] px-4">
				<ul className="flex w-full list-none items-center justify-start">
					<li
						className={`mx-2 list-none py-8 hover:cursor-pointer hover:border-b hover:border-b-[#F7931A] hover:text-[#F7931A] ${
							pathname === "/dashboard/plans"
								? "border-b border-b-[#F7931A] text-[#F7931A]"
								: ""
						}`}>
						<Link href="/dashboard/plans">Create Plan</Link>
					</li>

					<li
						className={`mx-2 cursor-not-allowed list-none py-8 hover:border-b hover:border-b-[#F7931A] hover:text-[#F7931A] ${
							pathname === "/dashboard/plans/ongoing_plans"
								? "border-b border-b-[#F7931A] text-[#F7931A]"
								: ""
						}`}>
						<Link href="#" className="cursor-not-allowed">
							Ongoing Plans{" "}
							<small className="mx-1 inline-block rounded-full bg-[#F7931A] px-2 text-white-100">
								{0}
							</small>
						</Link>
					</li>
				</ul>
			</nav>

			{children}
		</section>
	)
}
