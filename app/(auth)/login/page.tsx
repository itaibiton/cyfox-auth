import { LoginForm } from "@/features/login/LoginForm";
import React from "react";
function page() {
	return (
		<div className="w-full min-h-screen bg-background flex ">
			<div className="w-full p-20 bg-card hidden md:flex">1</div>
			<div className="w-full p-20 flex items-center justify-center">
				<LoginForm />
			</div>
		</div>
	);
}

export default page;
