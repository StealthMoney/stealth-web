import Button from "../shared/button"
import Image from "next/image"
import { Step2Props } from "@/types/kyc"

export default function Step2({
	sumbitInfo,
	setKycprogress,
	updateKycForm,
	formError,
	updateFormErrors,
}: Step2Props) {
	return (
		<section className="flex min-h-screen w-full items-center justify-center">
			<div className="my-8 mt-24 flex w-full flex-col md:w-2/4">
				<div className="w-full">
					<h1 className="text-[20px] font-bold lg:text-[28px]">
						Complete your KYC (2/2)
					</h1>
					<p className="text-[12px] lg:text-[16px]">
						Take your liveness test to complete the KYC registration.
					</p>
				</div>

				<div className="relative flex min-h-[400px] items-center justify-center">
					<div className="flex h-3/4 w-2/4 items-center justify-center rounded-3xl border border-[#494949] px-8 py-12">
						<Image
							src={"/cameraface.svg"}
							alt="face camera"
							width={100}
							height={100}
							className="z-10 lg:w-2/4"
						/>
					</div>

					{/* Vertical Bar */}
					<div className="absolute inset-0 m-auto h-[60%] w-[30%] bg-[#010101]"></div>

					{/* Horizontal Bar */}
					<div className="absolute inset-0 m-auto h-[30%] w-[60%] bg-[#010101]"></div>
				</div>

				<Button width="w-full" type="button">
					<div className="flex items-center justify-center">
						<span className="text-[15px] font-bold lg:text-[20px]">Take Selfie</span>{" "}
						<Image
							src={"/arrow-right-icon.svg"}
							alt="continue"
							width={50}
							height={10}
							className="my-auto ml-4"
						/>
					</div>
				</Button>
			</div>
		</section>
	)
}
