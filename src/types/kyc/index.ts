interface BaseStepProps {
	setKycprogress: () => void
	formValues: KycFieldTypes
	updateKycForm: (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => void
	formError: FormErrorTypes
	accountName: string
	setAccountName: (name: string) => void
	bvnFailed: boolean
	setBvnfailed: (failed: boolean) => void
	bvnVerified: boolean
	setBvnVerified: (verified: boolean) => void
	genderVerified: boolean
	setGenderVerified: (verified: boolean) => void
	buttonDisabled: boolean
	setButtonDisabled: (disabled: boolean) => void
}

export interface KycFieldTypes {
	bankName: string
	AccountNumber: string
	Bvn: string
	gender: string
	faceCard: File | null
}

export type FormErrorTypes = Omit<KycFieldTypes, "faceCard"> & {
	faceCard: string
}

export interface Step1ErrorTypes {
	bankName: string
	AccountNumber: string
	Bvn: string
	gender: string
}

export interface Step2ErrorTypes {
	faceCard: string
}

export interface Step1Props extends BaseStepProps {
	updateFormErrors: (errors: Step1ErrorTypes) => void
}

export interface Step2Props extends BaseStepProps {
	submitInfo: () => void
	updateFormErrors: (errors: Step2ErrorTypes) => void
}
