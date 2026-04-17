"use client"
export const REFRESH_EVENT = "app:refresh"

export const triggerRefresh = () => {
	window.dispatchEvent(new Event(REFRESH_EVENT))
}
