"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { UserCredentials } from "@/features/auth/register/types";
import CredentialsForm from "@/features/auth/register/CredentialsForm";
import { OTPForm } from "@/features/auth/register/OTPForm";

export function RegisterForm() {
	const [userCredentials, setUserCredentials] = useState<UserCredentials>({
		email: "",
		password: "",
		isOTP: false,
		uid: "",
		secret: {
			secret: "",
			qrCode: "",
		},
	});

	return (
		<div className="flex flex-col w-full gap-4 rounded max-w-sm h-full justify-center">
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
