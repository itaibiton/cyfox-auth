"use client";

import { toast } from "@/components/ui/use-toast";
import { AuthForm } from "@/features/auth/login/types";
import { auth } from "@/utils/firebaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOff, Github, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

// Define the schema for email and password validation
const credentialsFormSchema = z.object({
	email: z.string().email("Please fill valid email"), // Validates email format
	password: z.string().min(1, "Password fill in your password"), // Minimum 8 characters
});

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

	const [showPassword, setShowPassword] = useState(false);

	async function onSubmit(values: z.infer<typeof credentialsFormSchema>) {
		setLoading(true);
		// const auth = getAuth();
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				values.email,
				values.password
			);
			console.log("Authentication successful, user:", userCredential.user);

			// Optionally, check additional user data in Firestore
			const db = getFirestore();
			const userDocRef = doc(db, "users", userCredential.user.uid);
			const docSnap = await getDoc(userDocRef);

			if (docSnap.exists()) {
				console.log("User data:", docSnap.data());
				// Update userCredentials state, navigate, or perform additional actions
				setUserCredentials({
					...userCredentials,
					isOTP: true,
					email: values.email,
					uid: userCredential.user.uid,
					// Include any other user data you need in your state
				});
				// Here you can check for additional conditions or user roles if needed
			} else {
				console.log("No additional user data found in Firestore");
				toast({
					variant: "destructive",
					title: "Error",
					description: "Wrong credentials provided",
				});
			}

			// Redirect or update UI
			// e.g., router.push('/dashboard');
		} catch (error) {
			console.error("Authentication failed:", error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Wrong credentials provided",
			});
			// Handle errors, such as displaying a message to the user
		} finally {
			setLoading(false);
		}
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
					<Button type="submit" disabled={loading}>
						{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
					</Button>
				</form>
			</Form>
			<div className="flex flex-col items-center py-4 gap-2 mb-4">
				<p className="text-sm">Or sign in using</p>
				<div className="flex justify-center gap-4 w-full px-4">
					<button
						type="button"
						onClick={() => signIn("github")}
						className="border rounded w-full flex items-center justify-center py-2 shadow"
					>
						<Github />
					</button>
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

export default CredentialsForm;
