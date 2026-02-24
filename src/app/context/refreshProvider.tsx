"use client"

import {
	createContext,
	useContext,
	useState,
	useCallback,
	ReactNode,
} from "react"
import { REFRESH_EVENT, triggerRefresh } from "@/lib/refresh_bus"

interface RefreshContextType {
	isRefreshing: boolean
	refreshData: () => void
	refreshingSections: Record<string, boolean>
	setSectionRefreshing: (section: string, isRefreshing: boolean) => void
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined)

export function RefreshProvider({ children }: { children: ReactNode }) {
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [refreshingSections, setRefreshingSections] = useState<
		Record<string, boolean>
	>({})

	const setSectionRefreshing = useCallback(
		(section: string, refreshing: boolean) => {
			setRefreshingSections((prev) => ({
				...prev,
				[section]: refreshing,
			}))
		},
		[]
	)

	const refreshData = useCallback(() => {
		setIsRefreshing(true)
		triggerRefresh()

		// Auto-reset after 3 seconds (fallback in case some components don't report completion)
		setTimeout(() => {
			setIsRefreshing(false)
			setRefreshingSections({})
		}, 3000)
	}, [])

	return (
		<RefreshContext.Provider
			value={{
				isRefreshing,
				refreshData,
				refreshingSections,
				setSectionRefreshing,
			}}>
			{children}
		</RefreshContext.Provider>
	)
}

export function useRefresh() {
	const context = useContext(RefreshContext)
	if (context === undefined) {
		throw new Error("useRefresh must be used within a RefreshProvider")
	}
	return context
}
