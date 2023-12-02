"use client"

import Image from "next/image"
import React from "react"

import { formatCurrency, getCurrencyValue } from "@/app/helpers/amount"
import { Price } from "@/types/price"

import CurrencySelector from "../currency-selector"
import CustomDialog from "../dialog"
import { getPaymentDetails } from "@/app/profile/payment"

export const InstantBuyDialog = ({
    setIsInstantBuy,
    isInstantBuy = false,
    rate,
    startAmount,
    setPaymentDetail,
    setIsConfirmBuy,
    setStartAmount
}: {
    isInstantBuy: boolean
    setIsInstantBuy: (value?: boolean) => void
    rate: Price
    startAmount: string
    setPaymentDetail: (value: any) => void
    setIsConfirmBuy: (value?: boolean) => void
    setStartAmount: (value: any) => void
}) => {
    const [amount, setAmount] = React.useState(startAmount)
    const [currency, setCurrency] = React.useState(
        rate.data.currency?.toString()
    )
    const [satAmount, setSatAmount] = React.useState("")
    const [walletAddress, setWalletAddress] = React.useState("")
    const [narration, setNarration] = React.useState("")
    const [error, setError] = React.useState({
        amount: "",
        walletAddress: "",
        fetchError: ""
    })

    React.useEffect(() => {
        const { amountInSats } = getCurrencyValue({
            amount: startAmount,
            pricePerUsd: rate.data.pricePerUsd,
            pricePerSat: rate.data.pricePerSat
        })
        setAmount(startAmount)
        setSatAmount(amountInSats.toFixed())
    }, [
        rate.data.currency,
        rate.data.pricePerBtc,
        rate.data.pricePerSat,
        rate.data.pricePerUsd,
        startAmount
    ])

    const handleAmountChange = (event: any) => {
        setError({
            ...error,
            amount: ""
        })
        const value = event.target.value
        if (/^\d*\.?\d*$/.test(value)) {
            const { amountInSats } = getCurrencyValue({
                amount: value,
                pricePerUsd: rate.data.pricePerUsd,
                pricePerSat: rate.data.pricePerSat
            })

            setAmount(value)
            setSatAmount(amountInSats.toFixed())
        }
    }

    const handleSatAmountChange = (event: any) => {
        setError({
            ...error,
            amount: "",
            walletAddress: ""
        })
        const value = event.target.value
        if (/^\d*\.?\d*$/.test(value)) {
            const { amount } = getCurrencyValue({
                amount: value,
                pricePerUsd: rate.data.pricePerUsd,
                pricePerSat: rate.data.pricePerSat
            })
            setAmount(amount.toFixed())
            setSatAmount(value)
        }
    }

    const handleWalletAddressChange = (event: any) => {
        setError({
            ...error,
            walletAddress: ""
        })
        const value = event.target.value
        setWalletAddress(value)
    }

    const pasteAddress = async () => {
        if (!navigator.clipboard) {
            return
        }
        const regexForBitcoinAddress = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/
        const text = await navigator.clipboard.readText()
        if (!regexForBitcoinAddress.test(text) || text.length < 25) {
            setError({
                ...error,
                walletAddress: "Invalid address"
            })
            setWalletAddress(text)
            return
        }
        setWalletAddress(text)
    }

    const getPaymentDetail = async () => {
        if (!amount) {
            setError({
                ...error,
                amount: "Amount is required"
            })
            return
        }
        if (!walletAddress) {
            setError({
                ...error,
                walletAddress: "Wallet address is required"
            })
            return
        }
        const res = await getPaymentDetails({
            amount,
            amountInSats: Number(satAmount),
            narration,
            walletAddress
        })
        if (!res) {
            setError({
                ...error,
                fetchError: "Something went wrong"
            })
            return
        }
        if (res.error) {
            setError({
                ...error,
                fetchError: res.message || "Something went wrong"
            })
            return
        }
        setPaymentDetail(res.paymentDetail)
        setStartAmount(amount)
        setIsInstantBuy && setIsInstantBuy(false)
        setIsConfirmBuy && setIsConfirmBuy(true)
    }

    return (
        <CustomDialog
            isOpen={isInstantBuy}
            onDismiss={setIsInstantBuy}
            title="Instant Buy"
            titleClassName="text-[28px] font-medium"
            description="Please enter narration and your wallet address correctly"
            descriptionClassName="text-[18px] font-light text-black-400"
        >
            <div className="flex flex-col gap-5">
                <div className="relative">
                    <div className="flex flex-col gap-y-2 relative">
                        <label
                            htmlFor="amount"
                            className="text-[14px] flex justify-between"
                        >
                            <span>
                                Enter Amount{" "}
                                <span className="text-red-100">*</span>
                            </span>
                            <span className="text-red-100">{error.amount}</span>
                        </label>
                        <input
                            id="amount"
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder=""
                            className="bg-inherit w-full rounded-[4px] h-[60px] p-[10px] border border-white-700 text-white-100"
                        />
                        <div className="flex px-2 border-l-[1px] border-l-white-700 absolute right-0 bottom-0 h-full max-h-[60px]">
                            <CurrencySelector
                                selectedCurrency={currency}
                                onCurrencyChange={setCurrency}
                            />
                        </div>
                        <button className="absolute -bottom-5 left-4 bg-black-100 text-white-100 hover:bg-black-500 w-[30px] p-1 z-50 focus:shadow-black-500 inline-flex border border-white-700 appearance-none rounded-full focus:shadow-[0_0_0_2px] focus:outline-none">
                            <Image
                                src="/arrows-down-up.svg"
                                width={18}
                                height={18}
                                alt="arrows-down-up"
                            />
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col pt-[14px]">
                <div className="relative">
                    <div className="flex flex-col gap-y-2 relative">
                        <input
                            id="sat-amount"
                            type="text"
                            value={satAmount}
                            onChange={handleSatAmountChange}
                            placeholder=""
                            className="bg-inherit w-full rounded-[4px] h-[60px] p-[10px] border border-white-700 text-white-100"
                        />
                        <div className="flex px-2 border-l-[1px] border-l-white-700 absolute right-0 bottom-0 h-full max-h-[60px]">
                            <CurrencySelector
                                selectedCurrency={"SAT"}
                                onCurrencyChange={setCurrency}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center py-[10px] text-[16px] gap-2 text-black-400">
                    <Image
                        src="/info.svg"
                        width={20}
                        height={20}
                        alt="info-icon"
                    />
                    <small>
                        Exchange Rate: 1 BTC ={" "}
                        {formatCurrency(rate.data.pricePerBtc.toString())}
                    </small>
                </div>
                <div className="relative mt-10">
                    <div className="flex flex-col gap-y-2 relative">
                        <label
                            htmlFor="wallet-address"
                            className="text-[14px] flex justify-between"
                        >
                            <span>
                                Wallet Address{" "}
                                <span className="text-red-100">*</span>
                            </span>
                            <span className="text-red-100">
                                {error.walletAddress}
                            </span>
                        </label>
                        <input
                            id="wallet-address"
                            type="text"
                            value={walletAddress}
                            onChange={handleWalletAddressChange}
                            className="bg-inherit w-full rounded-[4px] h-[60px] p-[10px] pr-[80px] border border-white-700 text-white-100"
                        />
                        <button
                            onClick={pasteAddress}
                            className="flex items-center gap-1 px-2 bg-black-100 border-l-[1px text-green-100 uppercase text-[10px] border-l-white-700 absolute right-1 bottom-1 h-full max-h-[50px]"
                        >
                            <p>paste</p>
                            <Image
                                src="/copy.svg"
                                width={18}
                                height={18}
                                alt="paste"
                            />
                        </button>
                    </div>
                    <p className="text-[12px] text-black-400 mt-2">
                        Please enter your wallet address here correctly. We are
                        not responsible for any loss of funds due to incorrect
                        address.
                    </p>
                </div>
                <div className="relative mt-10">
                    <div className="flex flex-col gap-y-2 relative">
                        <label
                            htmlFor="naration"
                            className="text-[14px] flex justify-between"
                        >
                            Narration
                        </label>
                        <input
                            id="naration"
                            type="text"
                            value={narration}
                            onChange={(event: any) =>
                                setNarration(event.target.value)
                            }
                            placeholder="Bitcoin Purchase"
                            className="bg-inherit w-full rounded-[4px] h-[60px] p-[10px] border border-white-700 text-white-100 placeholder:text-black-400"
                        />
                    </div>
                </div>
                {error.fetchError && (
                    <p className="text-red-100 text-center text-[20px] font-semibold mt-8">{error.fetchError}!!!</p>
                )}
                <div className="flex justify-between items-center w-full mt-20">
                    <button
                        className="bg-orange-1100 w-full text-white-100 hover:bg-orange-100 focus:shadow-black-500 inline-flex h-[40px] px-[20px] appearance-none items-center justify-center rounded-[6px] focus:shadow-[0_0_0_2px] focus:outline-none"
                        onClick={getPaymentDetail}
                    >
                        Buy
                    </button>
                </div>
            </div>
        </CustomDialog>
    )
}
