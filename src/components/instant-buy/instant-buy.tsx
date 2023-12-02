"use client"

import Image from "next/image"
import React, { useState } from "react"

import { formatCurrency } from "@/app/helpers/amount"
import { Price } from "@/types/price"

import CurrencySelector from "../currency-selector"

interface InstantBuyProps {
    rate: Price
    isInstantBuy?: boolean
    setIsInstantBuy?: (value: boolean) => void
    startAmount: string
    setStartAmount: (value: string) => void
}

const InstantBuy = ({
    rate,
    setIsInstantBuy,
    startAmount,
    setStartAmount
}: InstantBuyProps) => {
    const {
        data: { currency: priceCurrency, pricePerBtc }
    } = rate
    const [exchangeRate] = useState(pricePerBtc?.toString())
    const [currency, setCurrency] = useState(priceCurrency?.toString())
    const [error, setError] = useState("")

    const handleAmountChange = (event: any) => {
        setError("")
        const value = event.target.value
        if (/^\d*\.?\d*$/.test(value)) {
            setStartAmount(value)
        }
    }

    const generatePaymentLink = () => {
        setIsInstantBuy && setIsInstantBuy(false)
    }

    const buyNow = () => {
        if (!startAmount) {
            setError("Amount is required")
            return
        }
        setIsInstantBuy && setIsInstantBuy(true)
    }

    return (
        <div className="bg-black-700 flex flex-col gap-4 border border-white-700 rounded-lg text-white-100 max-w-[480px] max-h-[361px] p-[20px]">
            <h2 className="text-[20px]">Instant Buy</h2>
            <p className="text-[12px] text-black-400">
                Instantly buy Bitcoin into your self custody hardware wallet.
                Remember it’s not your Bitcoin until you self-custody it.
            </p>
            <div>
                <div className="flex flex-col gap-y-2 relative">
                    <label
                        htmlFor="amount"
                        className="text-[14px] flex justify-between"
                    >
                        <span>
                            Enter Amount <span className="text-red-100">*</span>
                        </span>
                        <span className="text-red-100">{error}</span>
                    </label>
                    <input
                        id="amount"
                        type="text"
                        value={startAmount}
                        onChange={handleAmountChange}
                        placeholder=""
                        className="bg-inherit w-full rounded-[4px] h-[60px] p-[10px] border border-white-700 text-white-100 focus-within:border-white-700 focus:outline-none focus:bg-black-100"
                    />
                    <div className="flex px-2 border-l-[1px] border-l-white-700 absolute right-0 bottom-0 h-full max-h-[60px]">
                        <CurrencySelector
                            selectedCurrency={currency}
                            onCurrencyChange={setCurrency}
                        />
                    </div>
                </div>
                <div className="flex items-center py-[10px] gap-2 text-black-400">
                    <Image
                        src="/info.svg"
                        width={20}
                        height={20}
                        alt="info-icon"
                    />
                    <small>
                        Exchange Rate: 1 BTC = {formatCurrency(exchangeRate)}
                    </small>
                </div>
            </div>

            <div className="flex gap-x-3">
                <button
                    onClick={generatePaymentLink}
                    className="bg-black-600 hover:bg-white-700 text-white py-5 px-8 rounded border border-white-700 hover:border-transparent hover:text-black-100focus:outline-none focus:ring-2 focus:ring-white-700 focus:ring-offset-2 focus:ring-offset-black-700"
                >
                    Generate Payment Link
                </button>
                <button
                    onClick={buyNow}
                    className="bg-orange-600 hover:bg-orange-700 w-[190px] text-white py-5 px-8 rounded border border-white-700 hover:border-transparent hover:text-black-100focus:outline-none focus:ring-2 focus:ring-white-700 focus:ring-offset-2 focus:ring-offset-black-700"
                >
                    Buy Now
                </button>
            </div>
        </div>
    )
}

export default InstantBuy
