"use client"
import { Funnel, MagnifyingGlass } from "@phosphor-icons/react"
import React, { useState } from "react"

import { Button, Input } from "@/components"

const Form = () => {
	const [query, setQuery] = useState("")

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!query) {
			return alert("Please enter a valid search term!")
		}
		console.log(query)
	}

	return (
		<form onSubmit={handleSubmit} className="flex items-center gap-5 md:flex-row flex-col">
			<Input
				typed="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search"
				width="w-[300px]"
				icon={<MagnifyingGlass size={22} />}
			/>
			<Button type="submit" width="w-[110px]">
				<Funnel /> Filter
			</Button>
		</form>
	)
}

export default Form
