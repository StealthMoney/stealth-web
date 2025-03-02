import Input from "../shared/input"
import Button from "../shared/button"
import Image from "next/image"
import {
	KycFieldTypes,
	Step1Props,
	FormErrorTypes,
	Step1ErrorTypes,
} from "@/types/kyc"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchAccountDetails, verifyBvn } from "@/config/preambly"
import Spinner from "../spinner"
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons"

export default function Step1({
	setKycprogress,
	formValues,
	updateKycForm,
	formError,
	updateFormErrors,
}: Step1Props) {
	const [accountName, setAccountName] = useState<string>("")
	const [bvnVerified, setBvnVerified] = useState<boolean>(false)
	const [bvnFailed, setBvnfailed] = useState<boolean>(false)
	const [genderVerified, setGenderverified] = useState<boolean>(false)
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(true)

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

	const { isError, data, isLoading } = useQuery({
		queryKey: [
			"bank_account_verification",
			formValues.bankName,
			formValues.AccountNumber,
		],
		queryFn: () =>
			fetchAccountDetails({
				bankName: formValues.bankName,
				AccountNumber: formValues.AccountNumber,
			}),
		enabled: !!formValues.bankName && !!formValues.AccountNumber,
	})

	useEffect(() => {
		if (data && data.data.response_code === "00") {
			setAccountName(data.data.account_data.account_name)
		} else if (data && data.data.response_code === "01") {
			setAccountName("Account verification failed")
		} else {
			setAccountName("Account verification failed")
		}
	}, [data])

	const {
		data: isBvnData,
		isLoading: isBvnLoading,
		isError: isBvnError,
	} = useQuery({
		queryKey: ["bvn_verification", formValues.Bvn],
		queryFn: () => verifyBvn({ bvn: formValues.Bvn }),
		enabled:
			!!formValues.Bvn &&
			!!formValues.bankName &&
			!!formValues.AccountNumber &&
			accountName !== "" &&
			!accountName.includes("Account"),
	})

	useEffect(() => {
		setBvnfailed(false)
		setBvnVerified(false)
		if (isBvnData && isBvnData.data.response_code === "00") {
			const firstName = isBvnData.data.data.firstName
			const lastName = isBvnData.data.data.lastName
			const middleName = isBvnData.data.data.middleName
			console.log(middleName, "is middle")

			setBvnVerified(false)
			setBvnfailed(false)

			if (accountName !== "" && firstName && lastName && middleName) {
				const splitName = accountName.split(" ")
				if (
					splitName.includes(firstName) &&
					splitName.includes(lastName) &&
					splitName.includes(middleName)
				) {
					setBvnVerified(true)
				} else {
					setBvnVerified(false)
					setBvnfailed(true)
				}
			}
		} else if (isBvnData && isBvnData.data.response_code === "01") {
			setBvnfailed(true)
		} else [null]
	})

	useEffect(() => {
		if (
			formValues.gender !== "" &&
			formValues.gender !== "--" &&
			bvnVerified &&
			isBvnData
		) {
			if (
				isBvnData.data.data.gender.toLowerCase() === formValues.gender.toLowerCase()
			) {
				setGenderverified(true)
			}
		} else {
			setGenderverified(false)
		}
	}, [formValues.gender, isBvnData.data.data.gender])

	useEffect(() => {
		if (
			!data ||
			!isBvnData ||
			accountName === "" ||
			accountName === "Account verification failed" ||
			!bvnVerified ||
			!genderVerified
		) {
			setButtonDisabled(true)
		} else {
			setButtonDisabled(false)
		}
	}, [data, isBvnData, accountName, bvnVerified, genderVerified])

	useEffect(() => {
		console.log(formValues)
	}, [formValues])

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
					<div className="relative flex w-full items-center justify-center gap-x-2">
						<Input
							typed="text"
							label="Bank Name *"
							name="bankName"
							value={formValues.bankName}
							onChange={updateKycForm}
							error={formError.bankName}
						/>
						<div className="absolute bottom-2 right-4 flex -translate-y-1/2 transform items-center justify-center">
							{isLoading ? <Spinner /> : null}
						</div>
					</div>
					{isError && <p className="text-[#B31919]">Account verification failed</p>}
					{data && <p className="text-orange-100">{accountName}</p>}
				</div>

				<div className="my-6">
					<Input
						typed="text"
						label="Account Number *"
						value={formValues.AccountNumber}
						name={"AccountNumber"}
						onChange={updateKycForm}
						error={formError.AccountNumber}
					/>
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
						<div className="absolute bottom-2 right-4 flex -translate-y-1/2 transform items-center justify-center">
							{isBvnLoading ? (
								<Spinner />
							) : bvnVerified ? (
								<CheckIcon className=" text-green-600" width="24px" height="24px" />
							) : null}
							{isBvnData && bvnFailed ? (
								<Cross2Icon className=" text-[#B31919]" width="24px" height="24px" />
							) : null}
						</div>
					</div>
					{isBvnError && <p className="text-[#B31919]">BVN verification failed</p>}
				</div>

				<div className="my-6 w-full">
					<label htmlFor="Gender">
						Gender <span className="text-[#B31919]">*</span>
					</label>
					<div className="flex h-[60px] w-full items-center gap-1 rounded border p-2 transition-all duration-300 focus-within:border-alt-orange-100">
						<select
							name="gender"
							className="h-full w-full bg-transparent text-white-100"
							id="Gender"
							value={formValues.gender}
							onChange={updateKycForm}>
							<option value="--" className="text-black-100">
								--
							</option>
							<option value="male" className="text-black-100">
								male
							</option>
							<option value="female" className="text-black-100">
								female
							</option>
						</select>
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
