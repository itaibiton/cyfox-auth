"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define the schema for email and password validation
const formSchema = z.object({
	email: z.string().email("Please fill valid email"), // Validates email format
	password: z.string().min(1, "Password fill in your password"), // Minimum 8 characters
});

export function LoginForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		mode: "all",
		defaultValues: {
			email: "",
			password: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		// Handle login logic here
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="border flex flex-col w-full p-4 gap-4 rounded"
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
								<Input type="password" placeholder="Your password" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<Button type="submit">Login</Button>
			</form>
		</Form>
	);
}
