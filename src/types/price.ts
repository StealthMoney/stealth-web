export type Price = {
    status: string
    message: string
    _meta: string | null
    _links: string | null
    data: {
        currency: string
        pricePerBtc: number
        pricePerUsd: number
        pricePerSat: number
    }
}


export type PaymentDetail = {
    message: string
    status: string
    data: {
        accountName: string
        accountNumber: string
        paymentReference: string
        bankName: string
    }
}