"use client"
import { WarningCircle } from "@phosphor-icons/react"
import { useEffect, useState, useCallback } from "react"

import TransactionsTable from "@/components/transactions-table"
import { CurrencyInput } from "@/components/shared/input"
import { formatCurrency, formatDigits } from "../helpers/amount"
import InstantBuy from "@/components/instant-buy"
import { ExchangeRateProps, PaymentDetail } from "@/types/price"
import { INT_REGEX } from "@/config/constants"
import { Button, Dialog } from "@/components"
import { UserProps } from "@/types/profile"
import GeneratePayLink from "@/components/generateLink"
import Start from "@/components/kyc/start"
import { formatAmountForDisplay, toAssetCurrency } from "@/shared/functions"
import BtcPriceChart from "@/components/btcPriceChart"
import { UpdateIcon } from "@radix-ui/react-icons"
import { CurrencyToggle } from "@/components/shared/CurrencyBuyTabOption"
import { useRouter, useSearchParams } from "next/navigation"
import {
	handleCurrencyChange,
	getPaginationRange,
	handlePageChange,
} from "@/shared/functions"
import { triggerRefresh, REFRESH_EVENT } from "@/lib/refresh_bus"
import { useRefresh } from "../context/refreshProvider"
import { getAllPaymentDetails, getExchangeRate } from "../helpers/get-price"
import Loading from "@/components/shared/loading"

const CurrencyList = ["NGN"] // just ngn for now

interface Props {
	exchangeRate: ExchangeRateProps
	profile: UserProps
	transactions: PaymentDetail[]
	totalPages: number
	currentPage: number
}

const Client = ({
	exchangeRate: { data },
	profile,
	transactions,
	totalPages,
	currentPage,
}: Props) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const assetParam = searchParams.get("assetCurrency") // "SATS" | "USDT" | null

	const [fields, setFields] = useState({ amount: "", currency: "NGN" })
	const [openModal, setOpenModal] = useState(false)
	const [openGenerateModal, setOpenGenerateModal] = useState(false)
	const [error, setError] = useState("")
	const [kycScreen, setKycScreen] = useState<0 | 1 | 2 | 3>(0)
	const displayAmount = formatAmountForDisplay(fields.amount)
	const paymentConfig = profile.physicalWallets
	const selectedCurrency: "BTC" | "USDT" = assetParam === "USDT" ? "USDT" : "BTC"
	const [transactionsData, setTransactions] = useState(transactions)
	const [exchangeRateData, setExchangeRateData] = useState(data)
	const [totalPagesData, setTotalPagesData] = useState(totalPages)

	const { refreshingSections, setSectionRefreshing, refreshData } = useRefresh()
	console.log(selectedCurrency, "is selectedcee")

	const handleRefresh = useCallback(async () => {
		setSectionRefreshing("transactions", true)
		setSectionRefreshing("chart", true)

		try {
			const [transactionsRes, rateRes] = await Promise.all([
				getAllPaymentDetails({
					assetCurrency: selectedCurrency === "USDT" ? "USDT" : "SATS",
					page: currentPage,
					size: 10,
					sort: "createdDate,desc",
				}),
				getExchangeRate(selectedCurrency),
			])

			setTransactions(transactionsRes.data.content ?? [])
			setTotalPagesData(transactionsRes.data.totalPages)

			if (!(rateRes instanceof Error)) {
				setExchangeRateData(rateRes.data)
			}
		} catch (error) {
			console.error("Refresh failed:", error)
		} finally {
			setSectionRefreshing("transactions", false)
		}
	}, [selectedCurrency, currentPage, setSectionRefreshing])

	useEffect(() => {
		window.addEventListener(REFRESH_EVENT, handleRefresh)
		return () => window.removeEventListener(REFRESH_EVENT, handleRefresh)
	}, [handleRefresh])

	useEffect(() => {
		setTransactions(transactions)
	}, [transactions])

	useEffect(() => {
		setExchangeRateData(data)
	}, [data])

	useEffect(() => {
		setTotalPagesData(totalPages)
	}, [totalPages])

	console.log(data)
	// console.log(generateTestnetBitcoinAddress());

	const displayName = profile.firstName
		? profile.firstName
		: profile.email.split("@")[0]

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target

		if (name === "amount") {
			const cleanValue = value.replace(/\D/g, "")
			setFields({ ...fields, [name]: cleanValue })
			return
		}
		setFields({ ...fields, [name]: value })
	}

	const handleSubmit1 = async () => {
		const { amount } = fields

		const cleanAmount = amount.replace(/[^\d]/g, "")

		if (Number(cleanAmount) <= 0) {
			return setError("Please enter an amount greater than 0!")
		}
		//checks if the amount includes only integers to avoid exponential notation e.g 3.9e10
		if (!INT_REGEX.test(amount)) {
			return setError("Please enter a valid amount!")
		}
		setOpenModal(true)
	}

	const handleSubmit2 = async () => {
		const { amount } = fields

		const cleanAmount = amount.replace(/[^\d]/g, "")

		if (Number(cleanAmount) <= 0) {
			return setError("Please enter an amount greater than 0!")
		}
		//checks if the amount includes only integers to avoid exponential notation e.g 3.9e10
		if (!INT_REGEX.test(amount)) {
			return setError("Please enter a valid amount!")
		}
		setOpenGenerateModal(true)
	}

	const closeModal = () => {
		setOpenModal(false)
		setOpenGenerateModal(false)
		setFields({ ...fields, amount: "" })
	}

	useEffect(() => {
		const timeout = setTimeout(() => {
			setError("")
		}, 5000)
		return () => clearTimeout(timeout)
	}, [error])

	const IncreaseKycProgress = () => {
		setKycScreen((prev) => {
			if (prev < 3) return (prev + 1) as 0 | 1 | 2 | 3
			return prev
		})
	}

	const reduceKycProgress = () => {
		setKycScreen((prev) => {
			if (prev !== 0) return (prev - 1) as 0 | 1 | 2 | 3
			return prev
		})
	}

	return (
		<>
			{(profile.kycInfo.level === "ONE" ||
				((profile.kycInfo.level === "TWO" || profile.kycInfo.level === "THREE") &&
					profile.physicalWallets.length === 0)) && (
				<section>
					<Start
						open={openModal}
						setOpen={closeModal}
						setKycProgress={IncreaseKycProgress}
						kycProgress={kycScreen}
						paymentConfig={paymentConfig}
						kycInfo={profile.kycInfo}
						reverseKycProgress={reduceKycProgress}
					/>
				</section>
			)}

			{kycScreen === 0 && (
				<>
					<Dialog isOpen={openModal} onDismiss={closeModal}>
						<InstantBuy
							chosenCurrency={selectedCurrency === "USDT" ? "USDT" : "BTC"}
							paymentConfig={paymentConfig}
							amount={fields.amount}
							currency={fields.currency}
							exchangeRate={exchangeRateData}
							dismiss={closeModal}
						/>
					</Dialog>

					<Dialog isOpen={openGenerateModal} onDismiss={closeModal}>
						<GeneratePayLink
							chosenCurrency={selectedCurrency === "USDT" ? "USDT" : "BTC"}
							amount={fields.amount}
							currency={fields.currency}
							exchangeRate={exchangeRateData}
							dismiss={closeModal}
						/>
					</Dialog>
					<div className="flex w-full flex-col gap-6">
						<p className="font-satoshi text-2xl font-bold capitalize">
							Hello {displayName},
						</p>

						{/* Currency Tabs */}
						<CurrencyToggle
							selectedCurrency={selectedCurrency}
							onChange={(value) => {
								handleCurrencyChange(value, router, searchParams)
							}}
							onRefresh={refreshData}
						/>

						<div className="grid h-[350px] w-full grid-cols-5 gap-6 md:mb-12">
							<div className="col-span-6 flex h-full flex-col justify-between rounded-lg border border-black-500 bg-black-700 p-6 md:col-span-2 lg:col-span-2">
								<div>
									<p className="font-satoshi text-xl font-medium">Instant Buy</p>
									<p className="mb-4 text-xs text-black-400">
										<span>
											Instantly buy {selectedCurrency === "BTC" ? "Bitcoin" : "USDT"} into
											your
											{selectedCurrency === "BTC" ? " self custody hardware" : ""} wallet.
										</span>

										{selectedCurrency === "BTC" && (
											<span>
												{" "}
												Remember it&apos;s not your Bitcoin until you self-custody it.
											</span>
										)}
									</p>
									<CurrencyInput
										disableInput={profile.kycInfo.level === "ONE"}
										amount={displayAmount}
										currency={fields.currency}
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
									{Number(fields.amount) > profile.kycInfo.maxAmount ? (
										(profile.kycInfo.level === "ONE" ||
											profile.kycInfo.level === "TWO") && (
											<p className="flex items-center gap-1 text-xs text-red-100">
												<WarningCircle className="text-red-100" />
												Upgrade your KYC to buy BTC above{" "}
												{formatDigits(profile.kycInfo.maxAmount)}.
											</p>
										)
									) : Number(fields.amount) < profile.kycInfo.minAmount ? (
										<p className="flex items-center gap-1 text-xs text-red-100">
											<WarningCircle className="text-red-100" />
											{selectedCurrency === "BTC" ? "Due to dust transactions," : ""}{" "}
											{selectedCurrency === "BTC" ? "y" : "Y"}our purchase must be{" "}
											{formatDigits(profile.kycInfo.minAmount)} or higher.
										</p>
									) : null}

									<p className="flex items-center gap-1 text-xs text-black-400">
										<WarningCircle className="text-alt-orange-100" />
										{selectedCurrency === "BTC"
											? `Exchange rate: 1 BTC = ${formatCurrency(data?.pricePerBtc ?? 0)}`
											: `Exchange rate: 1 USDT = ${formatCurrency(data?.price ?? 0)}`}
									</p>
								</div>
								<div className="grid w-full gap-6">
									{!true && (
										<Button
											type="button"
											onClick={handleSubmit2}
											width="w-full bg-black-600"
											disabled={true}>
											Generate Payment Link
										</Button>
									)}
									<Button
										type="button"
										disabled={
											profile.kycInfo.level === "ONE" ||
											(profile.kycInfo.level === "TWO" &&
												Number(fields.amount) < profile.kycInfo.minAmount)
										}
										onClick={handleSubmit1}
										// width="w-full"
										style={{ width: "100%" }}>
										Buy {selectedCurrency}
									</Button>
								</div>
							</div>
							<div className="hidden h-full items-center justify-center rounded-lg border border-black-500 bg-black-700 md:col-span-3 md:flex lg:col-span-3">
								<BtcPriceChart />
							</div>
						</div>

						<div>
							{refreshingSections["transactions"] ? (
								<Loading />
							) : (
								<>
									<TransactionsTable
										transactions={transactionsData}
										pricePerUsd={exchangeRateData.pricePerUsd}
										chosenCurrency={selectedCurrency}
									/>

									<div className="mt-4 flex items-center justify-center gap-2">
										{getPaginationRange(currentPage, totalPagesData).map((page, i) =>
											page === "..." ? (
												<span key={`ellipsis-${i}`} className="px-2 text-[#494949]">
													...
												</span>
											) : (
												<button
													key={page}
													onClick={() =>
														handlePageChange(page as number, searchParams, router)
													}
													className={`rounded border px-3 py-1 text-sm ${
														currentPage === page
															? "text-black border-[#F7931A] bg-[#F7931A]"
															: "text-white border-[#494949] bg-transparent hover:border-[#F7931A]"
													}`}>
													{(page as number) + 1}
												</button>
											)
										)}
									</div>
								</>
							)}
						</div>
					</div>
				</>
			)}
		</>
	)
}

export default Client
