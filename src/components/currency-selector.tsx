"use client"

import React from "react"
import * as Select from "@radix-ui/react-select"
import Image from "next/image"

const CurrencySelector = ({
    selectedCurrency,
    onCurrencyChange
}: {
    selectedCurrency: string
    onCurrencyChange: (currency: string) => void
}) => {
    const currencies = [
        { code: "USD", name: "United States Dollar" },
        { code: "EUR", name: "Euro" },
        { code: "NGN", name: "Nigerian Naira" },
        { code: "SAT", name: "Bitcoin Satoshi's" },
    ]

    return (
        <Select.Root value={selectedCurrency} onValueChange={onCurrencyChange}>
            <Select.Trigger
                aria-label="Currency"
                className="flex gap-x-2 px-2 items-center"
            >
                <Select.Value />
                <Image
                    src={"/caret-down-filled.svg"}
                    width={20}
                    height={20}
                    alt={"caret-down"}
                />
            </Select.Trigger>
            <Select.Portal>
                <Select.Content className="border-white-700 bg-black-500 py-3 text-white-100 flex ml-[5px] w-full items-center focus:border-none focus-within:border-none">
                    <Select.ScrollUpButton />
                    <Select.Viewport>
                        {currencies.map((currency, index) => (
                            <Select.Item
                                key={currency.code}
                                value={currency.code}
                                className={`${index != 0 && "mt-2"}`}
                            >
                                <Select.ItemText>
                                    <span className="text-[14px] cursor-pointer">
                                        {currency.code}
                                    </span>
                                </Select.ItemText>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton />
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    )
}

export default CurrencySelector
