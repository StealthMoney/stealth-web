"use client"
import data from "@/components/plan/ongoing-plan/dummydata.json"
import { WarningCircle } from "@phosphor-icons/react"

export default function Ongoing() {
	return (
		<section className="flex flex-wrap items-center">
			{data.map((item, index) => (
				<div
					key={index}
					className="mx-2 my-5 flex flex-col items-center justify-center gap-5 rounded-md border border-[#494949] px-6 py-3 md:w-[350px]">
					<div className="flex w-full flex-col gap-2 text-[#808080]">
						<h1 className="text-lg font-bold text-white-100">Ongoing Plan</h1>
						<small>
							This is your current DCA plan. You can cancel it whenever you want to.
						</small>
					</div>

					<div className="flex w-full flex-col gap-3">
						<p className="text-[#AAAAAA]">
							<span className="font-bold text-white-100">
								Purchase amount: {item.amount}
							</span>
						</p>

						<p className="text-[#AAAAAA]">
							<span className="font-bold text-white-100">
								Occurrence: {item.interval}
							</span>
						</p>

						<p className="text-[#AAAAAA]">
							<span className="font-bold text-white-100">
								Duration: {item.duration}
							</span>
						</p>
					</div>

					<small className="flex items-center text-[#808080]">
						<WarningCircle className="text-alt-orange-100" />
						<span className="mx-2">
							Your DCA plan has 6 more months to run. Ends on the 23rd May, 2024.
						</span>
					</small>

					<div className="my-6 flex w-full items-center justify-center">
						<button className="mx-2 w-full rounded-md border border-[#494949] bg-[#2B2B2B] px-4 py-4">
							Cancel Plan
						</button>
					</div>
				</div>
			))}
		</section>
	)
}
