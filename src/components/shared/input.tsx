"use client"
import React, { ComponentProps, useState } from "react"
import { Eye, EyeSlash } from "@phosphor-icons/react"

type Props =
	| (Omit<ComponentProps<"input">, "type" | "className"> & {
			as?: "input"
			label?: React.ReactNode
			message?: React.ReactNode
			error?: string
			note?: string
			width?: string
			icon?: React.ReactNode
			pasteBtn?: React.ReactNode
			typed: React.InputHTMLAttributes<HTMLInputElement>["type"]
	  })
	| (Omit<ComponentProps<"textarea">, "className"> & {
			as: "textarea"
			label?: React.ReactNode
			error?: string
			note?: string
			width?: string
			icon?: React.ReactNode
			pasteBtn?: React.ReactNode
	  })
	| (Omit<ComponentProps<"select">, "className"> & {
			as: "select"
			label?: React.ReactNode
			error?: string
			note?: string
			width?: string
			icon?: React.ReactNode
			pasteBtn?: React.ReactNode
	  })

const Input = (props: Props) => {
	const [showPassword, setshowPassword] = useState(false)

	if (props.as === "textarea") {
		return (
			<div className={`flex flex-col ${props.width ? props.width : "w-full"}`}>
				<label htmlFor={props.name} className="mb-1 font-satoshi text-sm">
					{props.label}
				</label>
				<textarea className="min-h-[150px] w-full resize-none rounded border bg-transparent transition-all duration-300 focus:bg-alt-orange-100"></textarea>
				<p className="text-sm text-red-600">
					{props.error ? props.error : props.note}
				</p>
			</div>
		)
	}

	if (props.as === "select") {
		return (
			<div className={`flex flex-col ${props.width ? props.width : "w-full"}`}>
				<label htmlFor={props.name} className="mb-1 font-satoshi text-sm">
					{props.label}
				</label>
				<div className="h-[60px] w-full rounded border bg-transparent p-2 transition-all duration-300 focus-within:bg-alt-orange-100">
					{props.icon}
					<select className="h-full w-full rounded bg-transparent">
						{props.children}
					</select>
				</div>
				<p className="text-xs text-red-600">
					{props.error ? props.error : props.note}
				</p>
			</div>
		)
	}

	return (
		<div className={`flex flex-col ${props.width ? props.width : "w-full"}`}>
			<label htmlFor={props.name} className="mb-1 font-satoshi text-sm">
				{props.label} <span className="text-orange-100">{props.message}</span>
			</label>
			<div className="flex h-[60px] w-full items-center gap-1 rounded border p-2 transition-all duration-300 focus-within:border-alt-orange-100">
				{props.icon}
				<input
					type={showPassword ? "text" : props.typed}
					className="h-full w-full rounded bg-transparent"
					{...props}
				/>
				<div className="w-fit">{props.pasteBtn}</div>
				{props.typed === "password" && (
					<button type="button" onClick={() => setshowPassword(!showPassword)}>
						{showPassword ? <EyeSlash /> : <Eye />}
					</button>
				)}
			</div>
			<p className="text-xs text-red-600">
				{props.error ? props.error : props.note}
			</p>
		</div>
	)
}

export default Input

type CurrencyInputProps = {
	amount: string
	children: React.ReactNode
	currency: string
	handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	handleCurrencyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
	inputName?: string
	selectName?: string
	disableInput?: boolean
	disableSelect?: boolean
	note?: string
	error?: string
	label?: string
}

export const CurrencyInput = (props: CurrencyInputProps) => {
	return (
		<div className="my-1 w-full">
			<label htmlFor="" className="mb-1 font-satoshi text-sm">
				{props.label}
			</label>
			<div className="flex h-[60px] w-full items-center rounded border bg-black-100 pr-2 transition-all duration-300 focus-within:border-alt-orange-100">
				<input
					type="number"
					name={props.inputName}
					value={props.amount}
					onChange={props.handleAmountChange}
					min={0}
					className="h-full w-3/4 rounded-l bg-black-700 p-2"
					disabled={props.disableInput}
				/>
				<select
					name={props.selectName}
					value={props.currency}
					onChange={props.handleCurrencyChange}
					disabled={props.disableSelect}
					className="h-full w-1/4 cursor-pointer rounded-r bg-black-100 px-3 text-white-100">
					{props.children}
				</select>
			</div>
			<p className="pt-2 text-xs text-red-600">
				{props.error ? props.error : props.note}
			</p>
		</div>
	)
}
