"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Facebook, Github, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import Link from "next/link";

// Define the schema for email and password validation
const credentialsFormSchema = z.object({
	email: z.string().email("Please fill valid email"), // Validates email format
	password: z.string().min(1, "Password fill in your password"), // Minimum 8 characters
});

// Define the schema for otp validation
const otpFormSchema = z.object({
	otp: z
		.string()
		.length(6, "OTP must be exactly 6 digits")
		.regex(/^\d{6}$/, "OTP must be a 6 digit number"),
});

type UserCredentials = {
	email: string;
	password: string;
	isOTP: boolean;
};

export function LoginForm() {
	const [userCredentials, setUserCredentials] = useState<UserCredentials>({
		email: "",
		password: "",
		isOTP: false,
	});

	return (
		<div className="flex flex-col w-full gap-4 rounded max-w-sm h-full py-52">
			<div className="flex flex-col  w-full gap-4">
				<Image
					src="./cyfox.svg"
					alt="logo"
					width="200"
					height="80"
					className="h-14 scale-110 block lg:hidden"
				/>
				<div className="flex flex-col gap-2">
					<p className="text-xl font-medium">Login to Cyfox</p>
					<p className="text-muted-foreground">
						Enter your credentials below to sign in
					</p>
				</div>
				<Separator />
				{userCredentials.isOTP ? (
					<OTPForm
						userCredentials={userCredentials}
						setUserCredentials={setUserCredentials}
					/>
				) : (
					<CredentialsForm
						userCredentials={userCredentials}
						setUserCredentials={setUserCredentials}
					/>
				)}
			</div>
		</div>
	);
}

type AuthForm = {
	userCredentials: UserCredentials;
	setUserCredentials: React.Dispatch<React.SetStateAction<UserCredentials>>;
};

const CredentialsForm = ({ userCredentials, setUserCredentials }: AuthForm) => {
	const form = useForm<z.infer<typeof credentialsFormSchema>>({
		resolver: zodResolver(credentialsFormSchema),
		mode: "all",
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const [loading, setLoading] = useState(false);

	async function onSubmit(values: z.infer<typeof credentialsFormSchema>) {
		console.log(values);
	}

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
									<Input
										type="password"
										placeholder="Your password"
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={loading}>
						{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
					</Button>
				</form>
			</Form>
			<div className="flex flex-col items-center py-4 gap-4 mb-4">
				<p>Or sign in using</p>
				<div className="flex justify-center gap-4 w-full px-4">
					<div className="bg-white border rounded w-full flex items-center justify-center py-2 shadow">
						<Facebook />
					</div>
					<div className="bg-white border rounded w-full flex items-center justify-center py-2 shadow">
						<Github />
					</div>
				</div>
			</div>
			<p className="text-sm text-center">
				New here?{" "}
				<Link className="underline  text-primary" href="/register">
					Sign up
				</Link>
			</p>
		</div>
	);
};

// Assuming AuthForm is defined elsewhere and correctly
const OTPForm = ({ userCredentials, setUserCredentials }: AuthForm) => {
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

		// Use signIn from Next-Auth, specifying 'credentials' as the provider
		const result = await signIn("credentials", {
			redirect: false, // Set to true if you want to redirect the user to another page upon success
			email: userCredentials.email,
			password: userCredentials.password,
		});

		if (result?.error) {
			// Handle error - e.g., show an error message
			console.error("Login error:", result.error);
			// Optionally, update component state to display the error message
		} else {
			// Login successful
			console.log("Login success");
			// Optionally, redirect the user or update UI state to indicate success
		}

		setLoading(false);
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
