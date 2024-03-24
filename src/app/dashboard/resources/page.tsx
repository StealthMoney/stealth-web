import React from "react"
import All from "@/components/resources/all-resources"

const Page = () => {
	return (
		<div className="w-full">
			<div className="mb-6 flex w-full items-center">
				<p className="font-satoshi text-2xl font-bold capitalize">Resources</p>
			</div>
			<All />
		</div>
	)
}

export default Page
