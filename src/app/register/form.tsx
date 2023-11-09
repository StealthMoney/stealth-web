"use client"

import React from "react"

import { redirect } from "next/navigation"
import Link from "next/link"

type FormProps = {
    action: (
        formData: FormData
    ) => Promise<{ error?: string; success?: boolean }>
}

const Form = ({ action, ...props }: FormProps) => {
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [passwordsMatch, setPasswordsMatch] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    const validateData = () => {
        if (error) {
            setError("")
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return false
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters")
            return false
        }

        return true
    }

    const isButtonDisabled =
        loading ||
        error !== "" ||
        !password ||
        !confirmPassword ||
        !email ||
        !passwordsMatch

    const formAction = async (formData: FormData) => {
        const isValid = validateData()
        if (isValid === false) {
            return
        }
        setLoading(true)
        const res = await action(formData)
        setLoading(false)
        if (res.error) {
            setError(res.error)
            return
        }
        setError("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        redirect("/account/activate")
    }

    React.useEffect(() => {
        if (error === "") {
            return
        }
        setTimeout(() => {
            setError("")
        }, 3000)
    }, [error])

    React.useEffect(() => {
        setPasswordsMatch(password === confirmPassword)
    }, [password, confirmPassword])

    return (
        <form
            action={formAction}
            {...props}
            className="col-span-3 items-center p-11 px-[150px]"
        >
            <section>
                <h2 
                    className="text-xl font-bold"
                >
                    Come on Board!
                </h2>
                <p
                    className="text-gray-400 text-[14px]"
                >
                    It&apos;s not your Bitcoin until you self custody it.
                     Start your journey to becoming a Bitcoin owner today.
                </p>
            </section>
            <div
                className={`bg-none ${
                    error ? "bg-red-100" : ""
                } rounded-lg px-5 py-4 mb-5 flex items-center justify-center text-[14px] text-red-700 font-semibold opacity-[0.8]`}
            >
                {error ? <p>{error}</p> : null}
            </div>

            <div>
                
                <div className="flex flex-col px-5 py-2">
                    <label
                        htmlFor="email"
                        className="text-[14px] mb-1"
                    >
                        Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                        className="border border-gray-800 bg-stealth-gray px-3 py-2 text-[14px] text-black"
                        type="email"
                        name="email"
                        required
                        value={email}
                        placeholder="theo@stealth.money"
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="flex flex-col px-5 py-2">
                    <label
                        htmlFor="password"
                        className="text-[14px] mb-1"
                    >
                        Password 
                        <span className="text-stealth-orange">
                            (minimum of 8 characters)
                        </span>
                        <span className="text-red-600">*</span>
                    </label>
                    <input
                        className="border border-gray-800 bg-stealth-gray px-3 py-2 text-[14px] text-black"
                        required
                        name="password"
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <div className="flex flex-col px-5 py-4">
                    <label
                        htmlFor="confirm-password"
                        className="text-[14px] mb-1"
                    >
                        Confirm Password<span className="text-red-600">*</span>
                    </label>
                    <input
                        className="border border-gray-800 bg-stealth-gray px-3 py-2 text-[14px] text-black"
                        required
                        type="password"
                        value={confirmPassword}
                        placeholder="Password"
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                    />
                </div>
                <div className=" px-5 py-4 text-[14px]">
                   <input type="checkbox" name="agree" id="agree" required />
                   &nbsp;
                   <label htmlFor="agree">
                    I agree to the &nbsp;
                    <Link 
                        href={"#"}
                        className="text-stealth-orange"
                    >
                        Terms of Services
                    </Link> 
                    &nbsp; and the &nbsp;
                    <Link 
                        href={"#"}
                        className="text-stealth-orange"
                    >
                        Privacy Policy
                    </Link> 
                    &nbsp; of Stealth Money
                   </label>
                </div>
                <div className="flex flex-col px-5 py-2">
                    <button
                        disabled={isButtonDisabled}
                        className="bg-stealth-orange disabled:cursor-not-allowed disabled:bg-stealth-gray text-white px-3 py-2 text-[18px]"
                    >
                        Create Account
                    </button>
                </div>
                <div className="flex flex-col items-center px-5 py-2">
                    <p className="text-[15px]">
                        Already have an account?{" "}
                        <Link
                            href="/api/auth/signin"
                            className="text-stealth-orange"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </form>
    )
}

export default Form
