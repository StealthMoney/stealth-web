import React from "react"
import AllResources from "@/components/resources/all-resources"

const Page = () => {
	return (
		<div className="w-full">
			<div className="mb-6 flex w-full items-center">
				<p className="font-satoshi text-2xl font-bold capitalize">Resources</p>
			</div>
			<AllResources />
		</div>
	)
}

export default Page
