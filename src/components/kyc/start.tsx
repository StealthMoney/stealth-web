"use client"
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
import { UserProps } from "@/types/profile"
import { useRouter } from "next/navigation"

interface StartPropsTypes {
	open: boolean
	setOpen: () => void
	setKycProgress: () => void
	kycProgress: number
	reverseKycProgress: () => void
	paymentConfig: UserProps["physicalWallets"]
	kycInfo: UserProps["kycInfo"]
	chosenCurrency: "BTC" | "USDT"
}

export default function Start({
	open,
	setOpen,
	setKycProgress,
	kycProgress,
	reverseKycProgress,
	paymentConfig,
	kycInfo,
	chosenCurrency,
}: StartPropsTypes) {
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(true)

	const [kycForm, setKycForm] = useState<KycFieldTypes>({
		Bvn: "",
		faceCard: null,
	})

	const [formErrors, setFormErrors] = useState<FormErrorTypes>({
		Bvn: "",
		faceCard: "",
	})

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
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
			Bvn: "",
			faceCard: "",
		}

		if (!formValues.Bvn.trim()) {
			errors.Bvn = "BVN is required."
		} else if (!/^\d{11}$/.test(formValues.Bvn)) {
			errors.Bvn = "BVN must be 11 digits."
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

	const router = useRouter()
	const handleProfileNavigate = () => {
		router.push("/dashboard/profile")
	}

	const shouldShowIntro =
		(kycInfo.level === "ONE" && kycProgress === 0) ||
		((kycInfo.level === "TWO" || kycInfo.level === "THREE") &&
			paymentConfig.length === 0)

	return (
		<div className="z-0 w-full md:relative">
			{kycProgress > 0 && (
				<div>
					<button
						onClick={reverseKycProgress}
						title="back"
						className="static left-[5%] top-[15%] z-0 flex items-center justify-center
gap-x-2 bg-transparent text-[#CCCCCC] md:absolute md:left-0 md:top-0">
						<Image src={"/Square.svg"} alt="back" width={20} height={10} /> Go back
					</button>
				</div>
			)}
			{shouldShowIntro ? (
				<section className="my-4 flex w-full flex-col-reverse items-center justify-between rounded-lg border-2 border-red-100 bg-[#0E0E0E] px-2 py-2 md:flex-row md:px-4">
					<div className="flex w-full flex-col gap-y-4 md:w-3/4 md:max-w-[80%] md:gap-y-2">
						{shouldShowIntro && (
							<h2 className="text-[12px] font-bold lg:text-[24px]">
								{kycInfo.level === "ONE" &&
								kycProgress === 0 &&
								chosenCurrency === "BTC"
									? "Complete your KYC and Set-up your Account"
									: (kycInfo.level === "TWO" || kycInfo.level === "THREE") &&
									  paymentConfig.length === 0 &&
									  chosenCurrency === "BTC"
									? "Add your x-pub key"
									: chosenCurrency === "USDT"
									? "Order Your Hardware Wallet"
									: ""}
							</h2>
						)}

						{shouldShowIntro && (
							<p className="text-[15px] text-[#808080] lg:text-[20px]">
								{kycInfo.level === "ONE" &&
								kycProgress === 0 &&
								chosenCurrency === "BTC"
									? "Please kindly verify your identity and set up your profile to complete the registration process and unlock all features in two easy steps."
									: (kycInfo.level === "TWO" || kycInfo.level === "THREE") &&
									  paymentConfig.length === 0 &&
									  chosenCurrency === "BTC"
									? "You can now add your x-pub key in the profile page."
									: chosenCurrency === "USDT"
									? "You can proceed to the website to get your hardware wallet"
									: ""}
							</p>
						)}

						{shouldShowIntro && (
							<div>
								<button
									title={
										kycInfo.level === "ONE" &&
										kycProgress === 0 &&
										chosenCurrency === "BTC"
											? "complete KYC"
											: (kycInfo.level === "TWO" || kycInfo.level === "THREE") &&
											  paymentConfig.length === 0 &&
											  chosenCurrency === "BTC"
											? "Add x-pub key"
											: chosenCurrency === "USDT"
											? "Order wallet"
											: ""
									}
									className="flex items-center justify-center bg-transparent font-semibold text-orange-100"
									onClick={() => {
										if (
											kycInfo.level === "ONE" &&
											kycProgress === 0 &&
											chosenCurrency === "BTC"
										) {
											setKycProgress()
										} else if (
											(kycInfo.level === "TWO" || kycInfo.level === "THREE") &&
											chosenCurrency === "BTC" &&
											paymentConfig.length === 0
										) {
											handleProfileNavigate()
										} else if (chosenCurrency === "USDT") {
											window.open("https://www.stealth.money/order-wallet", "_blank")
										} else {
											null
										}
									}}>
									{shouldShowIntro && (
										<span className="flex items-center gap-x-2">
											{kycInfo.level === "ONE" &&
											kycProgress === 0 &&
											chosenCurrency === "BTC"
												? "Complete Registration"
												: (kycInfo.level === "TWO" || kycInfo.level === "THREE") &&
												  paymentConfig.length === 0 &&
												  chosenCurrency === "BTC"
												? "Add x-pub key"
												: chosenCurrency === "USDT"
												? "Proceed"
												: ""}{" "}
											<ChevronRightIcon />
										</span>
									)}
								</button>
							</div>
						)}
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
					buttonDisabled={buttonDisabled}
					setButtonDisabled={setButtonDisabled}
				/>
			) : kycProgress === 2 ? (
				<Step2
					submitInfo={handleSubmit}
					setKycprogress={setKycProgress}
					formValues={kycForm}
					updateKycForm={handleChange}
					formError={formErrors}
					updateFormErrors={handleStep2Errors}
					buttonDisabled={buttonDisabled}
					setButtonDisabled={setButtonDisabled}
				/>
			) : (
				""
			)}
		</div>
	)
}
