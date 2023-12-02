"use client"

import React from "react"

import { InstantBuyDialog } from "@/components/instant-buy/dialog"
import InstantBuy from "@/components/instant-buy/instant-buy"
import TransactionsTable from "@/components/transactions-table"
import { PaymentDetail, Price } from "@/types/price"
import { ConfirmBuyDialog } from "@/components/instant-buy/confirm-buy-dialog"
import { PaymentConfirmationModal } from "@/components/instant-buy/payment-confirmation-modal"
import Image from "next/image"

export const Profile = ({ exchangeRate }: { exchangeRate: Price }) => {
    const [isInstantBuy, setIsInstantBuy] = React.useState(false)
    const [startAmount, setStartAmount] = React.useState("")
    const [isConfirmBuy, setIsConfirmBuy] = React.useState(false)
    const [isCheckPaymentConfirmed, setIsCheckPaymentConfirmed] =
        React.useState(false)
    const [paymentDetail, setPaymentDetail] = React.useState(
        {} as PaymentDetail
    )

    const setInstantBuy = (isOpen?: boolean) => {
        setIsInstantBuy(isOpen || false)
    }

    const setConfirmBuy = (isOpen?: boolean) => {
        setIsConfirmBuy(isOpen || false)
    }

    const setCheckPaymentConfirmed = (isOpen?: boolean) => {
        setIsCheckPaymentConfirmed(isOpen || false)
    }

    React.useEffect(() => {
        if (isConfirmBuy) {
            setInstantBuy(false)
        }
    }, [isConfirmBuy])

    return (
        <>
            <div className="flex items-center justify-between">
                <InstantBuy
                    rate={exchangeRate}
                    startAmount={startAmount}
                    setStartAmount={setStartAmount}
                    isInstantBuy={isInstantBuy}
                    setIsInstantBuy={setIsInstantBuy}
                />
                {/* <div className="flex items-center justify-between"> */}
                <Image
                    src="/btc-graph.png"
                    alt="arrow-down"
                    width="800"
                    height="300"
                    className="h-[355px] w-[700px]"
                />
            </div>
            <TransactionsTable />
            <InstantBuyDialog
                isInstantBuy={isInstantBuy}
                setIsInstantBuy={setInstantBuy}
                rate={exchangeRate}
                startAmount={startAmount}
                setPaymentDetail={setPaymentDetail}
                setIsConfirmBuy={setConfirmBuy}
                setStartAmount={setStartAmount}
            />
            <ConfirmBuyDialog
                isConfirmBuy={isConfirmBuy}
                setConfirmBuy={setConfirmBuy}
                startAmount={startAmount}
                paymentDetail={paymentDetail}
                setCheckPaymentConfirmed={setCheckPaymentConfirmed}
            />
            <PaymentConfirmationModal
                amount={startAmount}
                isCheckPaymentConfirmed={isCheckPaymentConfirmed}
                setCheckPaymentConfirmed={setCheckPaymentConfirmed}
            />
        </>
    )
}
