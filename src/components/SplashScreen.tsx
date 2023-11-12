import React from "react"
import Image from "next/image"
import logo from "../assets/logo-transparent.svg"
import circle from "../assets/circle-drawing.svg"
import wallet from "../assets/wallet.svg"

const SplashScreen = () => {
    return (
        <section className="hidden md:block col-span-2 bg-stealth-gray text-white pl-12 p-[35px]">
            {/* Stealth Logo */}
            <Image src={logo} alt="Stealth transparent logo" width={85} />

            {/* Welcome text */}
            <h1 className="text-[30px] mt-8 leading-loose">
                Fully control and build <br /> your Bitcoin wealth with
                <br />
                <span className="flex items-center font-semibold">
                    &nbsp; &nbsp; Stealth Money
                    <Image
                        src={circle}
                        alt="Circle"
                        width={240}
                        className="absolute"
                    />
                </span>
            </h1>

            {/* Wallet image */}
            <Image src={wallet} alt="Bitcoin wallet illustration" width={400} />
        </section>
    )
}

export default SplashScreen
