export type UserProps = {
	profileId: number
	createdAt: string | null
	updatedAt: string | null
	status:
		| "ACTIVE"
		| "INACTIVE"
		| "PENDING"
		| "REJECTED"
		| "SUSPENDED"
		| "DELETED"
	kycConfigId: number
	kycInfoId: number
	userId: number
	profileType: string
	login: string
	firstName: string
	lastName: string
	email: string
	imageUrl: string | null
	kycInfo: {
		level: String
		limits: [
			{
				asset: String
				network: string
				minAmountInNaira: number
				maxAmountInNaira: number
			},
			{
				asset: string
				network: string
				minAmountInNaira: number
				maxAmountInNaira: number
			},
		]
	}
	activated: boolean
	langKey: string
	createdBy: string
	createdDate: string
	lastModifiedBy: string
	lastModifiedDate: string
	authorities: string[]
	admin: false
	accountDetail?: {
		accountNumber: string
		accountName: string
		bankName: string
		status: string
	}
	physicalWallets:
		| [
				{
					id: number
					alias: string
					xpubKey: string
				},
		  ]
		| []
}
