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

// Define the schema for email and password validation
const formSchema = z.object({
	email: z.string().email("Please fill valid email"), // Validates email format
	password: z.string().min(1, "Password fill in your password"), // Minimum 8 characters
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
					className="h-14 scale-110 block md:hidden"
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
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		mode: "all",
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const [loading, setLoading] = useState(false);

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		setLoading(true);
		// Handle login logic here
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
					<Button type="submit">
						{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
					</Button>
				</form>
			</Form>
			<div className="flex justify-evenly py-4">
				<div className="">
					<Facebook />
				</div>
				<div className="">
					<Github />
				</div>
			</div>
		</div>
	);
};

const OTPForm = ({ userCredentials, setUserCredentials }: AuthForm) => {
	return <div>OTP Form</div>;
};
