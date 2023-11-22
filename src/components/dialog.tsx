import React from "react"

import * as Dialog from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"

interface CustomDialogProps {
    children: React.ReactNode
    isOpen: boolean
    onDismiss: () => void
    title: string
    titleClassName?: string
    description?: string
}

const CustomDialog = ({
    children,
    isOpen,
    onDismiss,
    title,
    titleClassName,
    description
}: CustomDialogProps) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onDismiss}>
            <Dialog.Trigger asChild />
            <Dialog.Portal>
                <Dialog.Overlay className="bg-stealth-gray opacity-30 data-[state=open]:animate-overlayShow fixed inset-0" />
                <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-stealth-black text-white-100 p-[25px] focus:outline-none">
                    {/* Custom shadow code */}
                    {/* shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] */}
                    
                    <Dialog.Title
                        className={`m-0 text-[20px] text-center font-semibold ${
                            titleClassName || ""
                        }`}
                    >
                        {title}
                    </Dialog.Title>
                    <Dialog.Description className="mt-[10px] mb-5 text-[15px] text-center leading-normal">
                        {description}
                    </Dialog.Description>
                    {children}
                    <Dialog.Close asChild>
                        <button
                            className="absolute -top-10 -right-7 bg-black-100 text-white hover:bg-slate-800 focus:shadow-black-500 inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                            aria-label="Close"
                        >
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default CustomDialog
