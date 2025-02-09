"use client"

import { useRef, useState, useEffect } from "react"
import Button from "../shared/button"
import Image from "next/image"
import type { Step2Props } from "@/types/kyc"
import * as faceapi from "face-api.js"
import { motion } from "framer-motion"

export default function Step2({
	submitInfo,
	setKycprogress,
	updateKycForm,
	formError,
	updateFormErrors,
}: Step2Props) {
	const videoRef = useRef<HTMLVideoElement>(null)
	const [stream, setStream] = useState<MediaStream | null>(null)
	const [isCameraActive, setIsCameraActive] = useState(false)
	const [buttonText, setButtonText] = useState("Start Camera")
	const [errorMessage, setErrorMessage] = useState("")
	const [isFaceDetected, setIsFaceDetected] = useState(false)
	const [isModelLoaded, setIsModelLoaded] = useState(false)

	useEffect(() => {
		const loadModels = async () => {
			try {
				await faceapi.nets.tinyFaceDetector.loadFromUri("/models")
				console.log("Tiny Face Detector Model loaded successfully")

				await faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models")
				console.log("Face Landmark Tiny Model loaded successfully")
				await faceapi.nets.faceRecognitionNet.loadFromUri("/models")
				console.log("Face Recognition Model loaded successfully")

				setIsModelLoaded(true)
			} catch (error) {
				console.error("Error loading face detection models:", error)
				setErrorMessage(
					"Failed to load face detection models. Please refresh the page."
				)
			}
		}
		loadModels()

		// Cleanup function for camera stream
		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop())
			}
		}
	}, [stream])

	useEffect(() => {
		setButtonText(isCameraActive ? "Take Selfie" : "Start Camera")
	}, [isCameraActive])

	useEffect(() => {
		if (formError.faceCard) {
			setErrorMessage(formError.faceCard)
		}
	}, [formError.faceCard])

	const startCamera = async () => {
		setIsCameraActive(true)

		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 1280 },
					height: { ideal: 720 },
					facingMode: "user",
				},
			})

			if (videoRef.current) {
				videoRef.current.srcObject = mediaStream
				videoRef.current.onloadedmetadata = () => {
					videoRef.current?.play()
					setIsCameraActive(true)
					setStream(mediaStream)
					setErrorMessage("")
					startFaceDetection()
				}
			} else {
				setErrorMessage("Failed to initialize camera. Please try again.")
			}
		} catch (err) {
			console.error("Error accessing camera:", err)
			setErrorMessage("Camera access denied. Please enable camera permissions.")
			updateFormErrors({
				faceCard: "Camera access denied. Please enable camera permissions.",
			})
		}
	}

	const startFaceDetection = () => {
		if (!videoRef.current || !isModelLoaded) return

		const detectFace = async () => {
			if (videoRef.current) {
				const detections = await faceapi
					.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
					.withFaceLandmarks(true)

				if (detections) {
					setIsFaceDetected(true)
					setErrorMessage("")
				} else {
					setIsFaceDetected(false)
					setErrorMessage(
						"No face detected or face not clear. Please adjust your position."
					)
				}
			}

			if (isCameraActive) {
				requestAnimationFrame(detectFace)
			}
		}

		detectFace()
	}

	const takePhoto = () => {
		if (!videoRef.current || !isFaceDetected) return

		try {
			const canvas = document.createElement("canvas")
			canvas.width = videoRef.current.videoWidth
			canvas.height = videoRef.current.videoHeight

			const ctx = canvas.getContext("2d")
			if (!ctx) return

			// Draw the current video frame
			ctx.drawImage(videoRef.current, 0, 0)

			// Convert to blob and create file
			canvas.toBlob(
				(blob) => {
					if (blob) {
						const file = new File([blob], "selfie.jpg", { type: "image/jpeg" })

						// Update form
						updateKycForm({
							target: {
								name: "faceCard",
								value: file,
							},
						} as any)

						// Cleanup camera
						if (stream) {
							stream.getTracks().forEach((track) => track.stop())
						}
						setIsCameraActive(false)
						setErrorMessage("")

						// setKycprogress()
					}
				},
				"image/jpeg",
				0.8
			)
			setIsCameraActive(false)
		} catch (error) {
			console.error("Error capturing photo:", error)
			setErrorMessage("Failed to capture photo. Please try again.")
			setIsCameraActive(false)
		}
	}

	const handleCameraAction = () => {
		if (isCameraActive) {
			if (isFaceDetected) {
				takePhoto()
			} else {
				setErrorMessage(
					"No face detected or face not clear. Please adjust your position."
				)
			}
		} else {
			startCamera()
		}
	}

	return (
		<section className="flex min-h-screen w-full items-center justify-center">
			<div className="my-8 mt-24 flex w-full flex-col md:w-2/4">
				<div className="w-full">
					<h1 className="text-[20px] font-bold lg:text-[28px]">
						Complete your KYC (2/2)
					</h1>
					<p className="text-[12px] lg:text-[16px]">
						Take your liveness test to complete the KYC registration.
					</p>
				</div>

				<div className="relative flex min-h-[400px] items-center justify-center">
					<div className="flex min-h-[200px] min-w-[200px] items-center justify-center overflow-hidden rounded-3xl border border-[#494949] px-8 py-12">
						{!isCameraActive ? (
							<Image
								src="/cameraface.svg"
								alt="face camera"
								width={100}
								height={100}
								className="z-10 lg:w-2/4"
							/>
						) : (
							<video
								ref={videoRef}
								autoPlay
								playsInline
								className="absolute z-10 h-[48%] w-[52%] rounded-3xl object-cover max-sm:w-[65%] md:w-[68%] lg:w-[38%]"
							/>
						)}
					</div>

					{!isFaceDetected && (
						<motion.span
							className={`absolute z-20 inline-block h-[0.2%] w-[50%] ${
								isCameraActive ? "bg-[#494949]" : "bg-[#F7931A]"
							} max-sm:w-[65%] md:w-[65%] lg:w-[40%]`}
							animate={{
								y: ["500%", "10000%", "-10000%"],
							}}
							transition={{
								duration: 2,
								ease: "easeInOut",
								repeat: Number.POSITIVE_INFINITY,
							}}></motion.span>
					)}

					{/* Vertical Bar */}
					<div className="absolute inset-0 m-auto h-[60%] w-[30%] bg-[#010101]" />

					{/* Horizontal Bar */}
					<div className="absolute inset-0 m-auto h-[30%] w-[80%] bg-[#010101]" />
				</div>

				{errorMessage && (
					<p className="mt-2 text-center text-red-500">{errorMessage}</p>
				)}

				<div className="mt-6">
					<Button width="w-full" type="button" onClick={handleCameraAction}>
						<div className="flex items-center justify-center">
							<span className="text-[15px] font-bold lg:text-[20px]">
								{buttonText}
							</span>
							<Image
								src="/arrow-right-icon.svg"
								alt="continue"
								width={50}
								height={10}
								className="my-auto ml-4"
							/>
						</div>
					</Button>
				</div>
			</div>
		</section>
	)
}
