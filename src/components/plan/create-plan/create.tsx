import Image from "next/image"
import emptyState from "/empty.svg"

export default function Create() {
	return (
		<section className="flex items-center justify-center px-4 py-6">
			<div className="flex w-2/4 flex-col items-center justify-center">
				<Image src={emptyState} alt="no-items" width={40} height={40} />
				<h1 className="font-bold">Create a DCA plan</h1>
				<p>
					To implement Dollar-Cost Averaging (DCA) for Bitcoin purchases into your
					self-custody, please click the &quot;Create Plan&quot; button below.
				</p>

				<div>
					<button className="mx-2 rounded-md border border-[#494949] bg-[#2B2B2B] px-4 py-2">
						Learn more
					</button>
					<button className="mx-2 rounded-md border border-[#FAB766] bg-[#F7931A] px-4 py-2">
						Create Plan
					</button>
				</div>
			</div>
		</section>
	)
}
