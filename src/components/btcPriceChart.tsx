"use client"
import {
	ResponsiveContainer,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
} from "recharts"
import { useEffect, useMemo, useState, useCallback } from "react"
import * as Select from "@radix-ui/react-select"
import {
	ArrowDownIcon,
	ArrowUpIcon,
	ChevronDownIcon,
} from "@radix-ui/react-icons"
import { useRefresh } from "@/app/context/refreshProvider"
import { REFRESH_EVENT } from "@/lib/refresh_bus"

type Range =
	| "ONE_DAY"
	| "ONE_WEEK"
	| "ONE_MONTH"
	| "SIX_MONTH"
	| "ONE_YEAR"
	| "FIVE_YEARS"
type Currency = "NGN" | "USD"

type PricePoint = {
	timestamp: number
	priceUsd: number
	priceNgn: number
}

const GRAPHQL_ENDPOINT = "https://api.blink.sv/graphql"

const formatNaira = (value: number) =>
	`₦${value.toLocaleString(undefined, {
		maximumFractionDigits: 0,
	})}`

const formatUsd = (value: number) =>
	`$${value.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`

const formatCompactNumber = (value: number, currency: Currency) => {
	const prefix = currency === "NGN" ? "₦" : "$"
	const absValue = Math.abs(value)

	if (absValue >= 1_000_000_000) {
		return `${prefix}${(value / 1_000_000_000).toFixed(1)}B`
	}
	if (absValue >= 1_000_000) {
		return `${prefix}${(value / 1_000_000).toFixed(1)}M`
	}
	if (absValue >= 1_000) {
		return `${prefix}${(value / 1_000).toFixed(1)}K`
	}
	return currency === "NGN" ? formatNaira(value) : formatUsd(value)
}

export default function BtcPriceChart() {
	const [data, setData] = useState<PricePoint[]>([])
	const [range, setRange] = useState<Range>("ONE_WEEK")
	const [currency, setCurrency] = useState<Currency>("NGN")
	const [loading, setLoading] = useState(true)
	const [isChangingRange, setIsChangingRange] = useState(false)
	const { setSectionRefreshing, refreshingSections } = useRefresh()

	const fetchPrices = useCallback(
		async (isRefresh = false) => {
			if (isRefresh) {
				setSectionRefreshing("chart", true)
			} else {
				const isInitialLoad = data.length === 0
				if (!isInitialLoad) {
					setIsChangingRange(true)
				} else {
					setLoading(true)
				}
			}

			try {
				// Fetch exchange rate
				const response = await fetch(
					"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
				)
				const responseData = await response.json()
				const ngnRate = responseData.usd.ngn

				// Fetch BTC prices
				const res = await fetch(GRAPHQL_ENDPOINT, {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						query: `
            query ($range: PriceGraphRange!) {
              btcPriceList(range: $range) {
                price { formattedAmount }
                timestamp
              }
            }
          `,
						variables: { range },
					}),
				})

				const json = await res.json()

				const formatted: PricePoint[] = json.data.btcPriceList.map((item: any) => {
					const priceUsd = Number(item.price.formattedAmount) / 100
					const priceNgn = priceUsd * ngnRate
					return {
						timestamp: item.timestamp * 1000,
						priceUsd,
						priceNgn,
					}
				})

				setData(formatted)
			} catch (err) {
				console.error("BTC chart fetch failed", err)
			} finally {
				if (isRefresh) {
					setSectionRefreshing("chart", false)
				} else {
					if (data.length === 0) {
						setLoading(false)
					} else {
						setIsChangingRange(false)
					}
				}
			}
		},
		[range, data.length, setSectionRefreshing]
	)

	useEffect(() => {
		fetchPrices()
	}, [range, fetchPrices])

	useEffect(() => {
		const handleRefresh = () => {
			fetchPrices(true)
		}

		window.addEventListener(REFRESH_EVENT, handleRefresh)
		return () => window.removeEventListener(REFRESH_EVENT, handleRefresh)
	}, [fetchPrices])

	const delta = useMemo(() => {
		if (data.length < 2) return null
		const priceKey = currency === "NGN" ? "priceNgn" : "priceUsd"
		const start = data[0][priceKey]
		const end = data[data.length - 1][priceKey]

		return ((end - start) / start) * 100
	}, [data, currency])

	const formatTime = (value: number) => {
		const date = new Date(value)

		switch (range) {
			case "ONE_DAY":
				return date.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				})
			case "ONE_WEEK":
				return date.toLocaleDateString("en-US", {
					weekday: "short",
					timeZone: "UTC",
				})
			case "ONE_MONTH":
				return date.toLocaleDateString([], {
					day: "numeric",
					month: "short",
				})
			case "SIX_MONTH":
				return date.toLocaleDateString([], {
					day: "numeric",
					month: "short",
				})
			case "ONE_YEAR":
				return date.toLocaleDateString([], { month: "short" })
			case "FIVE_YEARS":
				return date.getFullYear().toString()
		}
	}

	const formatPrice = (value: number) => {
		return currency === "NGN" ? formatNaira(value) : formatUsd(value)
	}

	if (loading || refreshingSections["chart"]) {
		return (
			<div className="flex h-full items-center justify-center text-sm text-gray-400">
				Loading market data…
			</div>
		)
	}

	const priceDataKey = currency === "NGN" ? "priceNgn" : "priceUsd"

	const rangeOptions = [
		{ value: "ONE_DAY", label: "1D" },
		{ value: "ONE_WEEK", label: "5D" },
		{ value: "ONE_MONTH", label: "1M" },
		{ value: "SIX_MONTH", label: "6M" },
		{ value: "ONE_YEAR", label: "1Y" },
		{ value: "FIVE_YEARS", label: "MAX" },
	]

	const getRangeLabel = () => {
		switch (range) {
			case "ONE_DAY":
				return "today"
			case "ONE_WEEK":
				return "this week"
			case "ONE_MONTH":
				return "this month"
			case "SIX_MONTH":
				return "last 6 months"
			case "ONE_YEAR":
				return "this year"
			case "FIVE_YEARS":
				return "last 5 years"
		}
	}

	return (
		<div className="flex h-full w-full flex-col gap-4 rounded-lg border border-[#494949] bg-[#0E0E0E] p-6">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<p className="text-[20px] text-sm text-[#ffffff]">Market Summary</p>
					<div className="mt-2">
						<p className="flex items-center gap-x-2 text-[20px] font-semibold text-[#D4D4D4]">
							{data.length > 0
								? formatPrice(
										data[data.length - 1][currency === "NGN" ? "priceNgn" : "priceUsd"]
								  )
								: "0"}{" "}
							<span className="text-[12px] text-gray-400">{currency}</span>
						</p>
						{delta !== null && (
							<p className="mt-1 flex items-center gap-1 text-sm">
								<span
									className={`inline-flex items-center gap-x-1 ${
										delta >= 0 ? "text-[#199B2E]" : "text-[#B31919]"
									}`}>
									{delta >= 0 ? "+" : ""}
									{delta.toFixed(2)}%{" "}
									{delta > 0 ? (
										<ArrowUpIcon color="#199B2E" />
									) : (
										<ArrowDownIcon color="#B31919" />
									)}{" "}
									{getRangeLabel()}
								</span>
							</p>
						)}
					</div>
				</div>

				<div className="mt-6 flex w-full items-center justify-end">
					{/* Time Range Buttons */}
					<div className="flex gap-1 rounded-lg p-1">
						{rangeOptions.map((option) => (
							<button
								key={option.value}
								onClick={() => setRange(option.value as Range)}
								className={`px-3 py-1 text-xs font-medium transition-colors ${
									range === option.value
										? "border-b border-b-[#F7931A] text-[#F7931A]"
										: "text-[#AAAAAA]"
								}`}>
								{option.label}
							</button>
						))}
					</div>

					{/* Currency Selector */}
					<Select.Root
						value={currency}
						onValueChange={(value) => setCurrency(value as Currency)}>
						<Select.Trigger className="text-white flex items-center gap-1 rounded border border-gray-600 bg-[#010101] px-2 py-1 text-sm font-medium hover:border-gray-500">
							<Select.Value />
							<ChevronDownIcon className="h-4 w-4" />
						</Select.Trigger>
						<Select.Portal>
							<Select.Content className="z-50 rounded-md border border-[#2B2B2B] bg-[#494949] shadow-lg">
								<Select.Viewport className="p-1">
									<Select.Item
										value="NGN"
										className="flex cursor-pointer items-center rounded px-3 py-2 hover:bg-[#010101]/20 data-[state=checked]:bg-[#010101] data-[state=checked]:text-[#ffffff]">
										<Select.ItemText className="text-white">NGN</Select.ItemText>
									</Select.Item>
									<Select.Item
										value="USD"
										className="flex cursor-pointer items-center rounded px-3 py-2 hover:bg-[#010101]/20 data-[state=checked]:bg-[#010101] data-[state=checked]:text-[#ffffff]">
										<Select.ItemText className="text-white">USD</Select.ItemText>
									</Select.Item>
								</Select.Viewport>
							</Select.Content>
						</Select.Portal>
					</Select.Root>
				</div>
			</div>

			<div className="min-h-0 flex-1">
				{isChangingRange ? (
					<div className="flex h-full items-center justify-center text-sm text-gray-400">
						Loading...
					</div>
				) : (
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={data}>
							<defs>
								<linearGradient id="btcBgGradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#FF8A00" stopOpacity={0.3} />
									<stop offset="100%" stopColor="#FF8A00" stopOpacity={0.02} />
								</linearGradient>
							</defs>

							<XAxis
								dataKey="timestamp"
								tickFormatter={formatTime}
								stroke="#555"
								style={{ fontSize: "12px" }}
								interval="preserveStartEnd"
								minTickGap={24}
							/>

							<YAxis
								stroke="#555"
								tickFormatter={(v) => formatCompactNumber(v, currency)}
								domain={[
									(dataMin: number) => dataMin * 0.98,
									(dataMax: number) => dataMax * 1.02,
								]}
								width={70}
								style={{ fontSize: "12px" }}
							/>

							<Tooltip
								formatter={(value) => {
									if (typeof value !== "number") return ["-", currency]
									return [formatPrice(value), currency]
								}}
								labelFormatter={(label) => new Date(label).toLocaleString()}
								contentStyle={{
									backgroundColor: "#1a1a1a",
									border: "1px solid #333",
									borderRadius: "6px",
									fontSize: "12px",
									color: "#fff",
								}}
							/>

							<Area
								type="monotone"
								dataKey={priceDataKey}
								fill="url(#btcBgGradient)"
								stroke="#FF8A00"
								strokeOpacity={1}
								strokeWidth={2}
								dot={false}
								isAnimationActive
								animationDuration={900}
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
			</div>
		</div>
	)
}
