"use client"
import Input from "../shared/input"
import Button from "../shared/button"
import Image from "next/image"
import { KycFieldTypes, Step1Props, Step1ErrorTypes } from "@/types/kyc"
import { useEffect } from "react"
export default function Step1({
	setKycprogress,
	formValues,
	updateKycForm,
	formError,
	updateFormErrors,
	buttonDisabled,
	setButtonDisabled,
}: Step1Props) {
	const validateStepFields = (formValues: KycFieldTypes) => {
		const errors: Step1ErrorTypes = {
			Bvn: "",
		}

		if (!formValues.Bvn.trim()) {
			errors.Bvn = "BVN is required."
		} else if (!/^\d{11}$/.test(formValues.Bvn)) {
			errors.Bvn = "BVN must be 11 digits."
		}

		updateFormErrors(errors)
		return Object.values(errors).every((error) => error === "")
	}

	const handleContinue = () => {
		const isValid = validateStepFields(formValues)
		if (isValid) {
			setKycprogress()
		}
	}

	useEffect(() => {
		if (formValues.Bvn && formValues.Bvn.length < 11) {
			setButtonDisabled(true)
		} else {
			setButtonDisabled(false)
		}
	}, [formValues.Bvn])

	return (
		<section className="z-0 flex min-h-screen w-full items-center justify-center">
			<div className="my-8 mt-24 flex w-full flex-col md:w-2/4">
				<div className="w-full">
					<h1 className="text-[20px] font-bold lg:text-[28px]">
						Complete your KYC (1/2)
					</h1>
					<p className="text-[12px] lg:text-[16px]">
						Please enter all details correctly
					</p>
				</div>

				<div className="my-6">
					<div className="relative flex w-full items-center justify-center gap-x-2">
						<Input
							typed="text"
							label="Bank Verification Number *"
							value={formValues.Bvn}
							name={"Bvn"}
							onChange={updateKycForm}
							error={formError.Bvn}
						/>
					</div>
				</div>

				<div className="flex w-full flex-col gap-y-2">
					<h1 className="text-[10px] font-semibold text-[#F7931A] lg:text-[16px]">
						Please Note:
					</h1>
					<p className="text-[12px] text-[#aaaaaa]">
						Please understand we need your BVN to confirm your bank account and
						nothing more. Your BVN shall not be made public.
					</p>
				</div>

				<div className="my-6 mt-8 w-full">
					<Button
						type="button"
						width="w-full"
						disabled={buttonDisabled}
						onClick={handleContinue}>
						<div className="flex items-center justify-center">
							<span className="text-[15px] font-bold lg:text-[20px]">Continue</span>{" "}
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
			</div>
		</section>
	)
}
