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
import { toast } from "@/components/ui/use-toast";
import { AuthForm } from "@/features/auth/login/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

// Define the schema for otp validation
const otpFormSchema = z.object({
	otp: z
		.string()
		.length(6, "OTP must be exactly 6 digits")
		.regex(/^\d{6}$/, "OTP must be a 6 digit number"),
});

// Assuming AuthForm is defined elsewhere and correctly
export const OTPForm = ({ userCredentials, setUserCredentials }: AuthForm) => {
	const form = useForm<z.infer<typeof otpFormSchema>>({
		resolver: zodResolver(otpFormSchema),
		mode: "all",
		defaultValues: {
			otp: "",
		},
	});

	const [loading, setLoading] = useState(false);

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
				signIn("credentials", {
					redirect: true, // Set to true if you want to redirect the user after sign-in
					email: userCredentials.email,
					uid: userCredentials.uid,
				});
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

				<Button type="submit" disabled={loading}>
					{loading ? (
						<Loader2 className="w-5 h-5 animate-spin" />
					) : (
						"Verify OTP"
					)}
				</Button>
			</form>
		</Form>
	);
};
