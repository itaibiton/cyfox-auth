"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthForm } from "@/features/auth/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
// Define the schema for otp validation

const otpFormSchema = z.object({
	otp: z
		.string()
		.length(6, "OTP must be exactly 6 digits")
		.regex(/^\d{6}$/, "OTP must be a 6 digit number"),
});
export const OTPForm = ({ userCredentials, setUserCredentials }: AuthForm) => {
	const form = useForm<z.infer<typeof otpFormSchema>>({
		resolver: zodResolver(otpFormSchema),
		mode: "onBlur",
		defaultValues: {
			otp: "",
		},
	});

	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const onSubmit = async (values: z.infer<typeof otpFormSchema>) => {
		setLoading(true);

		try {
			const requestBody = {
				userId: userCredentials.uid,
				token: values.otp,
			};
			console.log("Sending request with body:", requestBody);

			const res = await fetch("/api/verifyOTP", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestBody),
			});
			if (res?.ok) {
				toast({
					title: "Success",
					description: "User registered succesfully",
				});
				setTimeout(() => {
					router.push("/login");
				}, 1500);
			} else {
				toast({
					variant: "destructive",
					title: "Error",
					description: "Wrong credentials provided",
				});
				setLoading(false);
			}
		} catch (error) {
			console.error("Failed to verify OTP:", error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Internal server error",
			});
			setLoading(false);
		}
	};

	return (
		<>
			<div className="flex flex-col w-full gap-4">
				<p>Please scan the following QR Code</p>

				{/* <QRCode
						size={256}
						style={{ height: "auto", maxWidth: "100%", width: "100%" }}
						value={userCredentials.secret.qrCode}
						viewBox={`0 0 256 256`}
					/> */}
				<img width="128" height="128" src={userCredentials.secret.qrCode} />
				<p className="text-sm">{userCredentials.secret.secret}</p>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col w-full gap-4"
					>
						<FormField
							name="otp" // This prop is crucial for react-hook-form to register and manage this field
							control={form.control}
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel
										className={`${
											fieldState?.error?.message ? "text-red-500" : ""
										}`}
									>
										{fieldState?.error?.message ?? "OTP"}
									</FormLabel>
									<FormControl>
										<Input
											type="text" // Changed from 'number' to 'text' to use maxLength
											maxLength={6} // This ensures the input does not exceed 6 characters
											placeholder="Your OTP"
											{...field}
											onInput={(e) => {
												// Prevents entering non-digit characters
												e.currentTarget.value = e.currentTarget.value
													.replace(/[^0-9]/g, "")
													.slice(0, 6);
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</form>
				</Form>
				<Button type="submit" disabled={loading}>
					{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Setup OTP"}
				</Button>
			</div>
		</>
	);
};
