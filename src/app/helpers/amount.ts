import { SATS_PER_BTC } from "@/config/constants"

export const formatCurrency = (amount: string) => {
    const intl = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN"
    })
    return intl.format(Number(amount))
}

export const getCurrencyValue = ({
    amount,
    pricePerSat,
    pricePerUsd
}: {
    amount: string
    pricePerSat: number
    pricePerUsd: number
}) => {
    const amountInSats = Number(amount) / pricePerSat
    const amountInNaira = Number(amount) / pricePerUsd
    return {
        amount: amountInNaira,
        amountInSats
    }
}
