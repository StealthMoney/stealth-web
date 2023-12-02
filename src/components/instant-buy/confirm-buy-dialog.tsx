import { PaymentDetail } from "@/types/price"
import React from "react"
import CustomDialog from "../dialog"
import Image from "next/image"
import { getPaymentStatus } from "@/app/profile/payment"

export const ConfirmBuyDialog = ({
    isConfirmBuy,
    setConfirmBuy,
    startAmount,
    paymentDetail,
    setCheckPaymentConfirmed
}: {
    isConfirmBuy: boolean
    setConfirmBuy: (isOpen?: boolean) => void
    startAmount: string
    paymentDetail: PaymentDetail
    setCheckPaymentConfirmed: (isOpen?: boolean) => void
}) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isSubmitted, setIsSubmitted] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [isCopied, setIsCopied] = React.useState(false)
    const [remainingTime, setRemainingTime] = React.useState(15 * 60) // 5 minutes in seconds

    const handleSubmit = async () => {
        setIsSubmitting(true)
        setIsSubmitted(false)
        setErrorMessage("")

        try {
            console.log(paymentDetail.data?.paymentReference)
            const response = await getPaymentStatus(
                paymentDetail.data?.paymentReference
            )
            if (!response) {
                throw new Error("Something went wrong")
            }
            if (response.error) {
                throw new Error(response.message)
            }

            setConfirmBuy(false)
            setCheckPaymentConfirmed(true)

            console.log(response.paymentStatus)
        } catch (error) {
            console.log(error)
            setErrorMessage(
                error instanceof Error ? error?.message : "Something went wrong"
            )
        }

        setIsSubmitting(false)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(paymentDetail.data.accountNumber)
        setIsCopied(true)
    }

    const formatMoney = (amount: string) => {
        return Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN"
        }).format(Number(amount))
    }

    React.useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime((prevTime) => prevTime - 1)
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, [])

    const getFiveMinutesFromNow = () => {
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60

        return (
            <div>
                {minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
            </div>
        )
    }

    return (
        <>
            <CustomDialog
                isOpen={isConfirmBuy}
                onDismiss={() => setConfirmBuy(false)}
                title="Make Payment"
                description="Make payment into the account provided below."
                titleClassName="text-[28px] font-medium"
                descriptionClassName="text-[18px] font-light text-black-400"
            >
                <div className="flex flex-col gap-y-4">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <p className="text-[18px] font-normal text-black-400">
                                You are to pay:
                            </p>
                            <p className="text-[28px] font-medium text-white-100 tracking-wide">
                                {formatMoney(startAmount)}
                            </p>
                        </div>
                        <button
                            className="bg-black-100 text-black-400 text-[20px] mx-4 hover:text-white-200 focus:shadow-black-500 inline-flex gap-x-2 h-[25px] w-[25px] appearance-none items-center justify-center focus:shadow-[0_0_0_2px] focus:outline-none"
                            onClick={handleCopy}
                            aria-label="copy"
                        >
                            Copy
                            <Image
                                src="/copy.svg"
                                alt="close"
                                width="20"
                                height="20"
                            />
                        </button>
                    </div>
                    <div className="flex justify-between mt-5">
                        <div className="flex flex-col gap-y-3 mt-5 tracking-wide">
                            <p className="text-[16px] font-normal text-black-400">
                                Bank Name
                            </p>
                            <p className="text-[18px] font-normal text-white-100 tracking-wide capitalize">
                                {paymentDetail.data?.accountName}
                            </p>
                        </div>
                        <div className="flex flex-col justify-between gap-y-3 mt-5 text-right tracking-wide">
                            <p className="text-[16px] font-normal text-black-400">
                                Account Number
                            </p>
                            <p className="text-[18px] font-normal text-white-100">
                                {paymentDetail.data?.accountNumber}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between mt-5">
                        <div className="flex flex-col gap-y-3 mt-5 tracking-wide">
                            <p className="text-[16px] font-normal text-black-400">
                                Amount of Bitcoin Purchase
                            </p>
                            <p className="text-[18px] font-normal text-white-100 tracking-wide">
                                {formatMoney(startAmount)}
                            </p>
                        </div>
                        <div className="flex flex-col justify-between gap-y-3 mt-5 text-right">
                            <p className="text-[16px] font-normal text-black-400">
                                Charges
                            </p>
                            <p className="text-[18px] font-normal text-white-100">
                                {formatMoney("100")}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white-700 h-[1px] w-full my-8"></div>
                <div className="flex gap-y-4 justify-between">
                    <div className="flex flex-col gap-y-4">
                        <p className="text-[16px] font-normal text-black-400">
                            Total Amount to be paid
                        </p>
                        <p className="text-[28px] font-medium text-white-100 tracking-wide">
                            {formatMoney(
                                (Number(startAmount) + 100).toString()
                            )}
                        </p>
                    </div>
                    <div className="flex flex-col gap-y-4">
                        <p className="text-[16px] font-normal text-black-400 tracking-wide">
                            Expires in:
                        </p>
                        <p className="text-[28px] font-medium text-green-100 tracking-wide">
                            {getFiveMinutesFromNow()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-y-4 mt-24 w-full justify-between gap-2">
                    <button
                        className="bg-black-500 text-white-100 text-[18px] font-light py-5 border border-white-400 w-full rounded-md hover:bg-slate-800 focus:shadow-black-500 focus:outline-none"
                        onClick={() => setConfirmBuy(false)}
                    >
                        Go Back
                    </button>
                    <button
                        className="bg-orange-600 text-white-100 text-[18px] font-light py-5 border border-white-400 w-full rounded-md hover:bg-orange-100 focus:shadow-black-500 focus:outline-none"
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? "Checking..." : "I Have Paid"}
                    </button>
                </div>
            </CustomDialog>
        </>
    )
}
