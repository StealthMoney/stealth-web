interface BaseStepProps {
	setKycprogress: () => void
	formValues: KycFieldTypes
	updateKycForm: (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => void
	formError: FormErrorTypes
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
	facecard: string
}

export interface Step1Props extends BaseStepProps {
	updateFormErrors: (errors: Step1ErrorTypes) => void
}

export interface Step2Props extends BaseStepProps {
	submitInfo: () => void
	updateFormErrors: (errors: Step2ErrorTypes) => void
}
