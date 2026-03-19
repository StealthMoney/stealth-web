import * as Switch from "@radix-ui/react-switch"

const CustomSwitch = ({
	checked = false,
	onCheckedChange,
}: {
	checked: boolean
	onCheckedChange: (checked: boolean) => void
}) => {
	return (
		<Switch.Root
			checked={checked}
			onCheckedChange={onCheckedChange}
			className="relative h-[25px] w-[42px] rounded-full bg-[#78788029] data-[state=checked]:bg-[#F7931A]"
			id="app-switch">
			<Switch.Thumb
				className="bg-white block h-[21px] w-[21px] translate-x-0.5 rounded-full shadow transition-transform duration-150 data-[state=checked]:translate-x-[19px]"
				style={{ backgroundColor: "white" }}
			/>
		</Switch.Root>
	)
}

export default CustomSwitch
