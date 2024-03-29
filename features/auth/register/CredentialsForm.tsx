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
import { AuthForm } from "@/features/auth/register/types";
import { auth, db } from "@/utils/firebaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeIcon, EyeOff, Facebook, Github, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import speakeasy from "speakeasy";
import { doc, setDoc } from "firebase/firestore";
import QRCode from "qrcode";
import { toast } from "@/components/ui/use-toast";

// Define the schema for email and password validation
const credentialsFormSchema = z
	.object({
		email: z.string().email("Please fill valid email"), // Validates email format
		password: z
			.string()
			.min(6, "Password must be at least 6 characters long")
			.regex(/[A-Z]/, "Password must include at least one capital letter")
			.regex(/\d/, "Password must include at least one number"),
		passwordConfirm: z.string(),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "Passwords must match",
		path: ["passwordConfirm"], // This specifies that the error should be attached to the passwordConfirm field
	});

const CredentialsForm = ({ userCredentials, setUserCredentials }: AuthForm) => {
	const form = useForm<z.infer<typeof credentialsFormSchema>>({
		resolver: zodResolver(credentialsFormSchema),
		mode: "all",
		defaultValues: {
			email: "",
			password: "",
			passwordConfirm: "",
		},
	});

	const [loading, setLoading] = useState(false);

	const [showPassword, setShowPassword] = useState(false);

	const generateOTPSecret = async (userId: string, userEmail: string) => {
		const secret = speakeasy.generateSecret({
			length: 20,
			name: `Cyfox(${userId})`,
		});

		// The otpauth URL is needed for generating the QR code
		const otpauthUrl = speakeasy.otpauthURL({
			secret: secret.base32,
			label: encodeURIComponent(`Cyfox:${userId}`),
			issuer: "Cyfox",
			encoding: "base32",
		});

		// Assume you save the secret to Firestore here

		// Generate QR code URL
		const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

		return { secret: secret.base32, qrCodeUrl };
	};
	const onSubmit = async (values: z.infer<typeof credentialsFormSchema>) => {
		setLoading(true);

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				values.email,
				values.password
			);

			console.log("Registration successful, user:", userCredential.user);

			// Generate an OTP secret for the user using speakeasy
			const secret = await generateOTPSecret(
				userCredential.user.uid,
				values.email
			);

			// Save the user's email and OTP secret in Firestore
			await setDoc(doc(db, "users", userCredential.user.uid), {
				email: values.email,
				otpSecret: secret.secret, // Saving the base32 encoded secret
			});

			console.log("OTP Secret generated and saved:", secret.secret);
			if (secret) {
				setUserCredentials((prev) => ({
					...prev,
					secret: {
						secret: secret.secret,
						qrCode: secret.qrCodeUrl,
					},
					uid: userCredential.user.uid,
					isOTP: true,
				}));
			} else {
				toast({
					variant: "destructive",
					title: "Error",
					description: "Please make sure this email is not registered",
				});
			}

			// Now you can handle navigation or UI update to show the QR code or further instructions
		} catch (error) {
			console.error("Registration failed:", error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Please make sure this email is not registered",
			});
			// Handle any errors that occurred during registration, OTP generation, or Firestore document creation
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col w-full gap-4"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormLabel
									className={`${
										fieldState?.error?.message ? "text-red-500" : ""
									}`}
								>
									{fieldState?.error?.message ?? "Email"}
								</FormLabel>
								<FormControl>
									<Input type="email" placeholder="Your email" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormLabel
									className={`${
										fieldState?.error?.message ? "text-red-500" : ""
									}`}
								>
									{fieldState?.error?.message ?? "Password"}
								</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											type={showPassword ? "text" : "password"}
											placeholder="Your password"
											{...field}
										/>
										<Button
											type="button"
											className="absolute right-0 top-1"
											size="sm"
											variant="ghost"
											onClick={() => setShowPassword((prev) => !prev)}
										>
											{showPassword ? (
												<EyeIcon width={16} height={16} />
											) : (
												<EyeOff width={16} height={16} />
											)}
										</Button>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="passwordConfirm"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormLabel
									className={`${
										fieldState?.error?.message ? "text-red-500" : ""
									}`}
								>
									{fieldState?.error?.message ?? "Password"}
								</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											type={showPassword ? "text" : "password"}
											placeholder="Confirm password"
											{...field}
										/>
										<Button
											type="button"
											className="absolute right-0 top-1"
											size="sm"
											variant="ghost"
											onClick={() => setShowPassword((prev) => !prev)}
										>
											{showPassword ? (
												<EyeIcon width={16} height={16} />
											) : (
												<EyeOff width={16} height={16} />
											)}
										</Button>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<small className="text-card-foreground text-xs">
						Password must be at least 6 characters long, include one uppercase
						letter and one number.
					</small>
					<Button type="submit" disabled={loading}>
						{loading ? (
							<Loader2 className="w-5 h-5 animate-spin" />
						) : (
							"Register"
						)}
					</Button>
				</form>
			</Form>
			<p className="text-sm text-center my-4">
				Been here before?{" "}
				<Link className="underline  text-primary" href="/login">
					Login
				</Link>
			</p>
		</div>
	);
};

export default CredentialsForm;
