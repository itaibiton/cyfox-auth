import Image from "next/image";
import { LoginForm } from "@/features/login/LoginForm";
import React from "react";
function page() {
	return (
		<div className="w-full min-h-screen bg-background flex ">
			<div className="w-full p-8 xl:p-20 bg-card hidden md:flex flex-col justify-between">
				<Image
					src="./cyfox.svg"
					alt="logo"
					width="200"
					height="80"
					className="h-14 scale-110"
				/>
				<p>
					Best AI-Driven, End-to-End Cybersecurity Solutions for Your Business
					Utilize machine learning to automatically detect cyber-attacks.
				</p>
			</div>
			<div className="w-full p-20 flex justify-center">
				<LoginForm />
			</div>
		</div>
	);
}

export default page;
