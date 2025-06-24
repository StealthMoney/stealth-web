interface BaseStepProps {
	setKycprogress: () => void
	formValues: KycFieldTypes
	updateKycForm: (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => void
	formError: FormErrorTypes
	buttonDisabled: boolean
	setButtonDisabled: (disabled: boolean) => void
}

export interface KycFieldTypes {
	Bvn: string
	faceCard: File | null
}

export type FormErrorTypes = Omit<KycFieldTypes, "faceCard"> & {
	faceCard: string
}

export interface Step1ErrorTypes {
	Bvn: string
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
