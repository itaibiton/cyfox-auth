"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { auth } from "@/utils/firebaseClient";
import { sendPasswordResetEmail } from "@firebase/auth";
import { Github } from "lucide-react";
import { Session } from "next-auth";
import React from "react";

function ResetPassword({ session }: { session: Session }) {
	const requestReset = async () => {
		try {
			await sendPasswordResetEmail(auth, session?.user?.email!);
			toast({
				title: "Success",
				description: "Check your email for the password reset link.",
			});
			//   setMessage('Check your email for the password reset link.');
		} catch (error) {
			//   setError('Failed to send password reset email. Make sure the email is correct.');
			toast({
				variant: "destructive",
				title: "Error",
				description:
					"Failed to send password reset email. Make sure the email is correct.",
			});
		}
	};

	if (session?.user?.image) {
		return (
			<div className="flex flex-col gap-2 items-center">
				<Github width={32} height={32} />
				This user type is no authorized to request password change.
			</div>
		);
	}

	return (
		<div>
			<Button onClick={requestReset}>Request Password Reset</Button>
		</div>
	);
}

export default ResetPassword;
