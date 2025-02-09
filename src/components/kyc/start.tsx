import React, { useState } from "react"
import Image from "next/image"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import Step1 from "./Step1"
import Step2 from "./step2"
import {
	KycFieldTypes,
	FormErrorTypes,
	Step1ErrorTypes,
	Step2ErrorTypes,
} from "@/types/kyc"

interface StartPropsTypes {
	open: boolean
	setOpen: () => void
	setKycProgress: () => void
	kycProgress: number
	reverseKycProgress: () => void
}

export default function Start({
	open,
	setOpen,
	setKycProgress,
	kycProgress,
	reverseKycProgress,
}: StartPropsTypes) {
	const [kycForm, setKycForm] = useState<KycFieldTypes>({
		bankName: "",
		AccountNumber: "",
		Bvn: "",
		gender: "",
		faceCard: null,
	})

	const [formErrors, setFormErrors] = useState<FormErrorTypes>({
		bankName: "",
		AccountNumber: "",
		Bvn: "",
		gender: "",
		faceCard: "",
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target
		setKycForm((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSubmit = () => {
		if (validateForm(kycForm)) {
			console.log(kycForm)
		}
	}

	const validateForm = (formValues: KycFieldTypes) => {
		const errors: FormErrorTypes = {
			bankName: "",
			AccountNumber: "",
			Bvn: "",
			gender: "",
			faceCard: "",
		}

		if (!formValues.bankName.trim()) {
			errors.bankName = "Bank name is required."
		}

		if (!formValues.AccountNumber.trim()) {
			errors.AccountNumber = "Account number is required."
		} else if (!/^\d{10}$/.test(formValues.AccountNumber)) {
			errors.AccountNumber = "Account number must be 10 digits."
		}

		if (!formValues.Bvn.trim()) {
			errors.Bvn = "BVN is required."
		} else if (!/^\d{11}$/.test(formValues.Bvn)) {
			errors.Bvn = "BVN must be 11 digits."
		}

		if (!formValues.gender.trim()) {
			errors.gender = "Gender is required."
		} else if (
			!["male", "female", "other"].includes(formValues.gender.toLowerCase())
		) {
			errors.gender = "Gender must be Male, Female, or Other."
		}

		if (!formValues.faceCard) {
			errors.faceCard = "Face card upload is required."
		}

		setFormErrors(errors)

		// Return true if no errors
		return Object.values(errors).every((error) => error === "")
	}

	const handleStep1Errors = (stepErrors: Step1ErrorTypes) => {
		setFormErrors((prev) => ({
			...prev,
			...stepErrors,
		}))
	}

	const handleStep2Errors = (errors: Step2ErrorTypes) => {
		setFormErrors((prev) => ({
			...prev,
			...errors,
		}))
	}

	return (
		<div className="relative w-full">
			{kycProgress > 0 && (
				<div>
					<button
						onClick={reverseKycProgress}
						title="back"
						className="absolute left-0 top-0 flex
items-center justify-center gap-x-2 bg-transparent text-[#CCCCCC]">
						<Image src={"/Square.svg"} alt="back" width={20} height={10} /> Go back
					</button>
				</div>
			)}
			{kycProgress === 0 ? (
				<section className="my-4 flex w-full flex-col-reverse items-center justify-between rounded-lg border-2 border-red-100 bg-[#0E0E0E] px-2 py-2 md:flex-row md:px-4">
					<div className="flex w-full flex-col gap-y-4 md:w-3/4 md:max-w-[80%] md:gap-y-2">
						<h2 className="text-[12px] font-bold lg:text-[24px]">
							Complete your KYC and Set-up your Account
						</h2>

						<p className="text-[15px] text-[#808080] lg:text-[20px]">
							Please kindly verify your identity and set up your profile to complete
							the registration process and unlock all features in two easy steps.
						</p>

						<div>
							<button
								title="complete KYC"
								className="flex items-center justify-center bg-transparent font-semibold text-orange-100"
								onClick={setKycProgress}>
								Complete Registration <ChevronRightIcon />
							</button>
						</div>
					</div>

					<div className="mb-4 hidden w-full items-center justify-center md:mb-0 md:flex md:w-1/4">
						<Image src={"/kyc.svg"} alt="kyc-logo" width={100} height={100} />
					</div>
				</section>
			) : kycProgress === 1 ? (
				<Step1
					setKycprogress={setKycProgress}
					formValues={kycForm}
					updateKycForm={handleChange}
					formError={formErrors}
					updateFormErrors={handleStep1Errors}
				/>
			) : kycProgress === 2 ? (
				<Step2
					submitInfo={handleSubmit}
					setKycprogress={setKycProgress}
					formValues={kycForm}
					updateKycForm={handleChange}
					formError={formErrors}
					updateFormErrors={handleStep2Errors}
				/>
			) : (
				""
			)}
		</div>
	)
}
