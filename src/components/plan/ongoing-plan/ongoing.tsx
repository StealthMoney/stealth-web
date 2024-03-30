"use client"
import data from "@/components/plan/ongoing-plan/dummydata.json"
import { WarningCircle } from "@phosphor-icons/react"

export default function Ongoing() {
	return (
		<section className="flex flex-wrap items-center">
			{data.map((item, index) => (
				<div
					key={index}
					className="flex my-5 mx-2 px-6 py-3 flex-col items-center justify-center gap-5 md:w-[450px] border border-[#494949] rounded-md">
					<div className="w-full flex flex-col gap-2 text-[#808080]">
						<h1 className="font-bold text-lg text-white-100">Ongoing Plan</h1>
						<small>
							This is your current DCA plan. You can cancel it whenever you want to.
						</small>
					</div>

					<div className="w-full flex flex-col gap-3">
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

					<small className="flex text-[#808080] items-center">
						<WarningCircle className="text-alt-orange-100" />
						<span className="mx-2">
							Your DCA plan has 6 more months to run. Ends on the 23rd May, 2024.
						</span>
					</small>

					<div className="flex w-full items-center justify-center my-6">
						<button className="mx-2 w-full rounded-md border border-[#494949] bg-[#2B2B2B] px-4 py-4">
							Cancel Plan
						</button>
					</div>
				</div>
			))}
		</section>
	)
}
