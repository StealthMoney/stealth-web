import data from "./contents.json"
import Image from "next/image"
import Link from "next/link"

export default function All() {
	return (
		<section className="flex flex-wrap items-center justify-center border border-[#494949]">
			{data.map((item, index) => (
				<Link
					href={item.url}
					key={index}
					className="mx-2 my-4 flex h-[150px] w-[320px] overflow-hidden rounded-md border border-[#333333]">
					<div className="flex w-[40%] items-center justify-center bg-[#2B2B2B]">
						<Image src={item.image} alt="youtube" width={50} height={50} />
					</div>

					<div className="text-white flex w-[60%] items-center justify-center overflow-hidden px-4 py-2">
						<h1 className="text-lg font-bold">{item.title}</h1>
					</div>
				</Link>
			))}
		</section>
	)
}
