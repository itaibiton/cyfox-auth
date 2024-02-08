"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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

export function RegisterForm() {
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
					<p className="text-xl font-medium">Register to Cyfox</p>
					<p className="text-muted-foreground">
						Enter your credentials below to sign up
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

	function onSubmit(values: z.infer<typeof credentialsFormSchema>) {
		console.log(values);
		setLoading(true);
		// Handle register logic here
		setTimeout(() => {
			setLoading(false);
			setUserCredentials((prev) => ({
				email: values.email,
				password: values.password,
				isOTP: true,
			}));
		}, 2000);
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
						{loading ? (
							<Loader2 className="w-5 h-5 animate-spin" />
						) : (
							"Register"
						)}
					</Button>
				</form>
			</Form>
			<div className="flex flex-col items-center py-4 gap-4 mb-4">
				<p>Or sign up using</p>
				<div className="flex justify-center gap-4 w-full px-4">
					<div className="">
						<Facebook />
					</div>
					<div className="">
						<Github />
					</div>
				</div>
			</div>
			<p className="text-sm text-center">
				Been here before?{" "}
				<Link className="underline  text-primary" href="/login">
					Login
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

	function onSubmit(values: z.infer<typeof otpFormSchema>) {
		console.log(values);
		setLoading(true);
		// Handle OTP logic here
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	}

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
