import Input from "../shared/input"
import Button from "../shared/button"
import Image from "next/image"
import {
	KycFieldTypes,
	Step1Props,
	FormErrorTypes,
	Step1ErrorTypes,
} from "@/types/kyc"

export default function Step1({
	setKycprogress,
	formValues,
	updateKycForm,
	formError,
	updateFormErrors,
}: Step1Props) {
	const validateStepFields = (formValues: KycFieldTypes) => {
		const errors: Step1ErrorTypes = {
			bankName: "",
			AccountNumber: "",
			Bvn: "",
			gender: "",
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

		updateFormErrors(errors)
		return Object.values(errors).every((error) => error === "")
	}

	const handleContinue = () => {
		const isValid = validateStepFields(formValues)
		if (isValid) {
			setKycprogress()
		}
	}

	return (
		<section className="flex min-h-screen w-full items-center justify-center">
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
					<Input
						typed="text"
						label="Bank Name"
						name="bankName"
						value={formValues.bankName}
						onChange={updateKycForm}
						error={formError.bankName}
					/>
				</div>

				<div className="my-6">
					<Input
						typed="text"
						label="Account Number"
						value={formValues.AccountNumber}
						name={"AccountNumber"}
						onChange={updateKycForm}
						error={formError.AccountNumber}
					/>
				</div>

				<div className="my-6">
					<Input
						typed="text"
						label="Bank Verification Number"
						value={formValues.Bvn}
						name={"Bvn"}
						onChange={updateKycForm}
						error={formError.Bvn}
					/>
				</div>

				<div className="my-6">
					<Input
						typed="text"
						label="Gender"
						value={formValues.gender}
						name={"gender"}
						onChange={updateKycForm}
						error={formError.gender}
					/>
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
					<Button type="button" width="w-full" onClick={handleContinue}>
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
