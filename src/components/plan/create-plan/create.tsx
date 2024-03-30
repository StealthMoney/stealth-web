"use client"
import Image from "next/image"
import { PlusIcon } from "@radix-ui/react-icons"
import { useState, MouseEventHandler, useEffect } from "react"
import { CurrencyInput } from "@/components/shared/input"
import { INT_REGEX } from "@/config/constants"
import { formatCurrency } from "@/app/helpers/amount"
import InstantBuy from "@/components/instant-buy"
import { Dialog } from "@/components"
import { getExchangeRate } from "@/app/helpers/get-price"
import { ExchangeRateProps } from "@/types/price"
import { WarningCircle } from "@phosphor-icons/react"

const CurrencyList = ["NGN", "USD"]
const weeklyintervalOptions = ["weekly", "daily", "monthly"]
const monthlyintervalOptions = ["3months", "6months", "1year"]
export default function Create({ exchangeRate }: any) {
	const [createPlan, setCreatePlan] = useState(true)
	const [rateValue, setRateValue] = useState<
		ExchangeRateProps | Error | undefined
	>()
	const [openModal, setOpenModal] = useState(false)
	const [formData, setFormData] = useState({
		amount: "",
		currency: "NGN",
		interval_weekly: "weekly",
		interval_monthly: "3months",
	})
	const [error, setError] = useState("")
	const [errorInstant, setErrorInstant] = useState("")

	const [buyPrice, setBuyPrice] = useState("")

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const addPlan: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault()
		if (!INT_REGEX.test(formData.amount) || formData.amount === "")
			return setError("Please enter a valid number")
		console.log(formData)
	}

	const clearPlan: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault()
		setFormData((prev) => ({
			...prev,
			amount: "",
			currency: "NGN",
			interval_monthly: "3months",
			interval_weekly: "weekly",
		}))
		console.log(formData)
	}

	const closeModal = () => {
		setOpenModal(false)
	}

	const openModalFunc = () => {
		setOpenModal(true)
	}

	const handleInstantBuyChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setBuyPrice(e.target.value)
	}

	const handleInstantBuySubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
		if (!INT_REGEX.test(buyPrice) || buyPrice === "") {
			setErrorInstant("Please Enter a valid Number")
		} else {
			console.log(buyPrice)
			openModalFunc()
		}
	}

	useEffect(() => {
		console.log(exchangeRate.data)
	}, [exchangeRate])

	return (
		<section className="flex min-h-screen px-4 py-6">
			{!createPlan ? (
				<div className="flex h-full w-2/4 flex-col items-center justify-center gap-8">
					<div className="h-1/4 w-2/4">
						<Image
							src="/empty.svg"
							alt="no-items"
							width={100}
							height={100}
							className="h-full w-full"
						/>
					</div>
					<h1 className="font-bold">Create a DCA plan</h1>
					<p>
						To implement Dollar-Cost Averaging (DCA) for Bitcoin purchases into your
						self-custody, please click the &quot;Create Plan&quot; button below.
					</p>

					<div className="flex items-center justify-center">
						<button className="mx-2 rounded-md border border-[#494949] bg-[#2B2B2B] px-4 py-2">
							Learn more
						</button>
						<button className="mx-2 flex items-center justify-center rounded-md border border-[#FAB766] bg-[#F7931A] px-4 py-2">
							<span className="mx-1">
								<PlusIcon width={20} height={20} />
							</span>
							Create Plan
						</button>
					</div>
				</div>
			) : (
				<div className="flex w-full gap-4">
					<div className="flex w-2/4 flex-col gap-8 rounded-md border border-[#494949] px-4 py-2">
						<div className="flex w-full flex-col gap-4">
							<h1 className="font-bold text-white-100">Create New Plan</h1>
							<p className="text-[#808080]">
								Dollar-Cost Averaging (DCA) is a smart and simple way to invest in
								Bitcoin, over time. Instead of putting all your money in at once, you
								spread your investments out in small, regular amounts. Fill in the
								details below to create a DCA plan.
							</p>
						</div>

						<div className="flex w-full flex-col gap-4">
							<Dialog isOpen={openModal} onDismiss={closeModal}>
								{exchangeRate && exchangeRate.data ? (
									<InstantBuy
										amount={formData.amount}
										currency={formData.currency}
										exchangeRate={exchangeRate.data}
									/>
								) : (
									<p>Error fetching exchange rate data</p>
								)}
							</Dialog>
							<form className="flex flex-col gap-4 px-2">
								<CurrencyInput
									amount={formData.amount}
									currency={formData.currency}
									inputName="amount"
									label="Enter Amount"
									selectName="currency"
									handleAmountChange={handleChange}
									handleCurrencyChange={handleChange}
									error={error}>
									{CurrencyList.map((currency) => (
										<option key={currency} value={currency}>
											{currency}
										</option>
									))}
								</CurrencyInput>

								<div className="w-full">
									<label htmlFor="interval_" className="font-bold">
										How often should the DCA be carried out?
									</label>
									<div className="h-[60px] w-full cursor-pointer rounded border bg-transparent p-2 transition-all duration-300 focus-within:bg-alt-orange-100">
										<select
											name="interval_weekly"
											id="interval_"
											value={formData.interval_weekly}
											onChange={handleChange}
											className="h-full w-full rounded bg-transparent">
											{weeklyintervalOptions.map((item, index) => (
												<option className="bg-black-100" value={item} key={index}>
													{item}
												</option>
											))}
										</select>
									</div>
								</div>

								<div className="w-full">
									<label htmlFor="interval_" className="font-bold">
										For how long do you want this plan to run?
									</label>
									<div className="h-[60px] w-full cursor-pointer rounded border bg-transparent p-2 transition-all duration-300 focus-within:bg-alt-orange-100">
										<select
											name="interval_monthly"
											id="interval_"
											value={formData.interval_monthly}
											onChange={handleChange}
											className="h-full w-full rounded bg-transparent">
											{monthlyintervalOptions.map((item, index) => (
												<option className="bg-black-100" value={item} key={index}>
													{item}
												</option>
											))}
										</select>
									</div>
								</div>

								<div>
									<h1 className="font-bold text-[#F7931A]">Notice</h1>
									<ol className="flex list-decimal flex-col gap-2 text-[#808080]">
										<li>
											We will always send you a reminder on the day of the purchase.
										</li>
										<li>You can always cancel an ongoing plan.</li>
										<li>
											DCA does not eliminate the risk of market volatility. Prices can
											still go up and down, and the value of your investments may
											fluctuate.
										</li>
									</ol>
								</div>

								<div className="flex w-full items-center px-4 py-2">
									<div className="mx-2 w-2/4">
										<button
											onClick={clearPlan}
											className="mx-2 w-full rounded-md border border-[#494949] bg-[#2B2B2B] px-4 py-2">
											Clear Details
										</button>
									</div>
									<div className="mx-2 w-2/4">
										<button
											onClick={addPlan}
											className="mx-2 flex w-full items-center justify-center rounded-md border border-[#FAB766] bg-[#F7931A] px-4 py-2">
											Create Plan
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
					<div className="flex w-2/4 flex-col gap-8">
						<div className="rounded-md border border-[#494949] px-4 py-2">
							<div>
								<h1 className="font-bold text-white-100">Instant Buy</h1>
								<p>
									Instantly buy Bitcoin into your self custody hardware wallet. Remember
									it’s not your Bitcoin until you self-custody it.
								</p>
							</div>

							<div className="w-full">
								<CurrencyInput
									amount={buyPrice}
									currency={CurrencyList[0]}
									inputName="amount"
									label="Enter Amount"
									selectName="currency"
									handleAmountChange={handleInstantBuyChange}
									handleCurrencyChange={handleInstantBuyChange}
									error={errorInstant}>
									{CurrencyList.map((currency) => (
										<option key={currency} value={currency}>
											{currency}
										</option>
									))}
								</CurrencyInput>
								{exchangeRate.data && (
									<p className="flex items-center gap-1 text-xs text-black-400">
										<WarningCircle className="text-alt-orange-100" />
										Exchange rate: 1 BTC ={" "}
										{formatCurrency(exchangeRate.data?.pricePerBtc)}
									</p>
								)}

								<div className="my-4 px-4 py-2">
									<button
										onClick={handleInstantBuySubmit}
										className="mx-2 flex w-full items-center justify-center rounded-md border border-[#FAB766] bg-[#F7931A] px-4 py-6">
										Buy Now
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</section>
	)
}
