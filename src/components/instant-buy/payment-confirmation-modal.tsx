import { formatCurrency } from "@/app/helpers/amount"
import CustomDialog from "../dialog"
import Image from "next/image"

export const PaymentConfirmationModal = ({
    amount,
    isCheckPaymentConfirmed,
    setCheckPaymentConfirmed
}: {
    amount: string
    isCheckPaymentConfirmed: boolean
    setCheckPaymentConfirmed: (value?: boolean) => void
}) => {
    const amountToPay = Number(amount) + 100

    return (
        <>
            <CustomDialog
                isOpen={isCheckPaymentConfirmed}
                onDismiss={() => setCheckPaymentConfirmed(false)}
                title="Payment Confirmation"
                description="We are confirming your payment to complete the transaction."
                titleClassName="text-[28px] font-medium"
                descriptionClassName="text-[18px] font-light text-black-400"
            >
                <div className="flex flex-col gap-y-14">
                    <div className="flex flex-col">
                        <p className="text-[18px] font-normal text-black-400">
                            You are to pay:
                        </p>
                        <p className="text-[28px] font-medium text-white-100 tracking-wide">
                            {formatCurrency(amountToPay.toString())}
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-y-4 text-center mt-10 text-[20px]">
                        <p className="max-w-sm">
                            We are waiting to confirm your transfer. This can
                            take a few minutes.
                        </p>
                    </div>

                    <div className="flex gap-x-6 items-center justify-center gap-y-4 text-center mt-10 text-[20px]">
                        <div className="flex flex-col gap-y-4 items-center justify-center gap-x-2">
                            <Image
                                src="/green-check.svg"
                                alt="clock"
                                width="20"
                                height="20"
                            />
                            <p className="text-white-100">Sent</p>
                        </div>
                        <div className="h-[2px] w-full bg-black-400"></div>
                        <div className="flex flex-col gap-y-4 items-center justify-center gap-x-2">
                            <Image
                                src="/received.svg"
                                alt="check"
                                width="20"
                                height="20"
                            />
                            <p className="text-white-100">Received</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-y-4 items-center justify-center gap-x-2 mt-10 bg-white-700 py-3 mx-10 border border-black-500 rounded-md">
                        <p>Please wait for 10:00 or more minutes</p>
                    </div>
                </div>
            </CustomDialog>
        </>
    )
}
